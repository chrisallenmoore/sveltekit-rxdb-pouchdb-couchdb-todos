<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import { db, collections } from '$lib/db.js';
	import TodosList from '$lib/TodosList.svelte';
	import EmptyTodosList from '$lib/EmptyTodosList.svelte';

	let todos = [];
	let item = '';

	onMount(async () => {
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

		function addEventListeners() {
			const todoInput = document.getElementById('todo-text');
			todoInput.addEventListener('keypress', addTodoKeyPressHandler, false);
		}
		addEventListeners();
		getTodos();
	}); // End onMount

	const getTodos = async () => {
		todos = await collections.todos.find().exec();
		todos = todos;
	};

	const addTodo = async (itemTodo) => {
		await collections.todos.insert({
			id: Date.now().toString(),
			item: itemTodo,
			completed: false
		});
		item = '';
		getTodos();
	};

	/**
	 * When Enter key is pressed while caret is in todo input field,
	 * submit the todo item if it's not empty
	 */
	async function addTodoKeyPressHandler(event) {
		const todoInput = document.getElementById('todo-text');
		if (event.code === 'Enter') {
			if (todoInput.value !== '') {
				await addTodo(item);
			}
		}
	}

	/**
	 * On blur, save updated todo item or delete the todo if it's empty
	 */
	async function updateTodo(todo) {
		var trimmedText = todo.item.trim();
		if (!trimmedText) {
			await collections.todos.remove();
			///db.remove(todo);
		} else {
			todo.item = trimmedText;
			await collections.todos.upsert({
				id: todo.id,
				item: trimmedText
			});
			///db.put(todo);
		}
	}

	/**
	 * If the enter key is pressed while editing a todo item, blur the todo item's input to trigger save or delete
	 */
	async function updateTodoEnterKey(todo, event) {
		if (event.code == 'Enter') {
			let inputEditTodo = document.getElementById('todo-item_' + todo.id);
			inputEditTodo.blur();
		}
	}

	/**
	 * The delete button for a todo deletes the todo
	 */
	async function deleteTodo(todoItem) {
		// get todo document that is going to be deleted
		const doc = await collections.todos
			.findOne({
				selector: {
					id: todoItem.id
				}
			})
			.exec();
		// remove the todo document
		await doc.remove();
		getTodos();
	}

	/**
	 * Toggle the checkbox if the todo item is completed or not
	 */
	async function toggleCompleted(todo) {
		let checkboxEditTodo = document.getElementById('todo-item_' + todo.id);
		if (todo.completed === true) {
			todo.completed = false;
			checkboxEditTodo.classList.remove('checked');
		} else if (todo.completed === false) {
			todo.completed = true;
			checkboxEditTodo.classList.add('checked');
		}
		///await db.put(todo);
		/*await collections.todos.upsert({
			id: todo.id,
			completed: todo.completed
		});*/
		console.log('wtf');
	}

	/**
	 * Set the context up for child components
	 */
	setContext('toggleTodoCompletedParent', { toggleCompleted });
	setContext('deleteTodoParent', { deleteTodo });
	setContext('updateTodoParent', { updateTodo });
	setContext('updateTodoEnterKeyParent', { updateTodoEnterKey });
</script>

<svelte:head>
	<title>Sveltekit, rxDB, PouchDB, and CouchDB Todos</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-4xl font-extrabold text-center">Sveltekit & rxDB Todos</h1>
		<p class="text-center text-rxdb-pink">with PouchDB and CouchDB sync</p>
	</div>
	<div class="max-w-2xl mx-auto mt-20">
		<label for="todo-text" class="block text-sm font-medium text-rxdb-pink">Add todo</label>
		<section class="mt-1 flex rounded-md shadow-sm">
			<div class="relative flex items-stretch flex-grow focus-within:z-10">
				<div
					class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rxdb-midnight-dark"
				>
					<!-- https://icons.getbootstrap.com/icons/box-arrow-in-right/ -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-box-arrow-in-right"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
						/>
						<path
							fill-rule="evenodd"
							d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
						/>
					</svg>
				</div>
				<input
					type="text"
					name="todo-text"
					id="todo-text"
					class="focus:ring-0 focus:border-rxdb-midnight-blue block w-full rounded-none rounded-l-md pl-10 text-lg border-gray-300 transition text-rxdb-midnight-dark placeholder:text-slate-400"
					placeholder="What needs to be done?"
					bind:value={item}
				/>
			</div>
			<button
				type="button"
				class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-rxdb-pink text-sm font-medium rounded-r-md text-white bg-rxdb-pink hover:bg-rxdb-pink hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-rxdb-midnight-blue focus:border-rxdb-midnight-blue transition"
				on:click={addTodo(item)}
			>
				<span>Add</span>
			</button>
		</section>
		{#if todos.length > 0}
			<TodosList {todos} />
		{:else}
			<EmptyTodosList />
		{/if}
	</div>
</div>
