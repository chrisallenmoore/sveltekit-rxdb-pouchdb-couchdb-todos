<script>
	/**
	 * Import getContext to use context that was setup by the parent
	 */
	import { getContext } from 'svelte';

	export let todos = [];

	/**
	 * Setup const that uses the context setup by the parent
	 */
	const { toggleCompleted } = getContext('toggleTodoCompletedParent');
	const { deleteTodo } = getContext('deleteTodoParent');
	const { updateTodo } = getContext('updateTodoParent');
	const { updateTodoEnterKey } = getContext('updateTodoEnterKeyParent');
</script>

<section class="max-w-2xl mx-auto mt-20">
	<div class="mt-1 flex rounded-md shadow-sm bg-white p-2">
		<ul class="w-full">
			{#each todos as todo}
				<li class="p-2">
					<div class="flex items-center">
						<div class="flex items-center h-6">
							<input
								id="todo-checkbox_{todo.id}"
								name="todo-checkbox"
								type="checkbox"
								class="focus:ring-0 h-6 w-6 text-rxdb-pink shadow-inner border-slate-300 rounded"
								bind:checked={todo.completed}
								on:click|self={toggleCompleted(todo)}
							/>
						</div>
						<div class="ml-3 text-lg max-w-full grow">
							<!-- Add class: completed if the todo is checked as completed -->
							{#if todo.completed === true}
								<input
									id="todo-item_{todo.id}"
									name="todos-item"
									type="text"
									class="focus:ring-0 focus:border-rxdb-midnight-blue block rounded-md pl-3 text-rxdb-midnight-dark text-lg border-slate-100 transition w-full checked"
									bind:value={todo.item}
									on:blur|self={updateTodo(todo)}
									on:keydown={updateTodoEnterKey(todo, event)}
								/>
							{:else}
								<input
									id="todo-item_{todo.id}"
									name="todos-item"
									type="text"
									class="focus:ring-0 focus:border-slate-500 block rounded-md pl-3 text-lg text-rxdb-midnight-dark border-slate-100 transition w-full"
									bind:value={todo.item}
									on:blur|self={updateTodo(todo)}
									on:keypress={updateTodoEnterKey(todo, event)}
								/>
							{/if}
						</div>
						<div class="ml-3 text-lg items-center">
							<button
								type="button"
								class="-ml-px inline-flex items-center space-x-2 px-2 py-2 border border-rxdb-pink text-lg font-medium rounded-md text-white bg-rxdb-pink hover:bg-rxdb-pink hover:opacity-90 hover:shadow-inner focus:outline-none focus:ring-1 focus:ring-rxdb-pink focus:border-rxdb-pink transition"
								on:click={deleteTodo(todo)}
							>
								<!-- https://icons.getbootstrap.com/icons/x-lg/ -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									fill="currentColor"
									class="bi bi-x-lg"
									viewBox="0 0 16 16"
								>
									<path
										fill-rule="evenodd"
										d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
									/>
									<path
										fill-rule="evenodd"
										d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	:global(.checked) {
		text-decoration: line-through;
	}
</style>
