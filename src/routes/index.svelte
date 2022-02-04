<script>
	import { onMount } from 'svelte';
	import { createRxDatabase } from 'rxdb';
	import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';

	let allTodos = [];
	let item = '';

	let collections;

	onMount(async () => {
		// because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
		addPouchPlugin(await import('pouchdb-adapter-idb'));
		addPouchPlugin(await import('pouchdb-adapter-http'));

		const db = await createRxDatabase({
			name: 'rxdbtodos', // <- name
			storage: getRxStoragePouch('idb'), // <- RxStorage
			password: 'myPassword', // <- password (optional)
			multiInstance: true, // <- multiInstance (optional, default: true)
			eventReduce: true // <- eventReduce (optional, default: true)
		});

		const todoSchema = {
			keyCompression: false, // set this to true, to enable the keyCompression
			version: 0,
			title: 'todo schema',
			primaryKey: 'id',
			type: 'object',
			properties: {
				id: {
					type: 'string'
				},
				item: {
					type: 'string'
				},
				completed: {
					type: 'string'
				}
			},
			required: ['id', 'item', 'completed']
		};

		collections = await db.addCollections({
			todos: {
				schema: todoSchema
			}
		});

		getTodos();

		const replicationState = collections.todos.syncCouchDB({
			remote: 'http://admin:password@127.0.0.1:5984/rxdbtodos', // remote database. This can be the serverURL, another RxCollection or a PouchDB-instance
			waitForLeadership: true, // (optional) [default=true] to save performance, the sync starts on leader-instance only
			direction: {
				// direction (optional) to specify sync-directions
				pull: true, // default=true
				push: true // default=true
			},
			options: {
				// sync-options (optional) from https://pouchdb.com/api.html#replication
				live: true,
				retry: true
			}
		});
	});

	const addTodo = async (itemTodo) => {
		await collections.todos.insert({
			id: Date.now().toString(),
			item: itemTodo,
			completed: 'false'
		});
		item = '';
		getTodos();
	};

	const getTodos = async () => {
		allTodos = await collections.todos.find().exec(); // execute
		allTodos = allTodos;
	};
</script>

<h1>SvelteKit, RxDB, PouchDB, CouchDB Todos</h1>
<input type="text" bind:value={item} />
<button on:click={addTodo(item)}>Add Todo</button>

<hr />
<div>
	{#each allTodos as todo (todo.id)}
		<div>{todo.item}</div>
	{/each}
</div>
