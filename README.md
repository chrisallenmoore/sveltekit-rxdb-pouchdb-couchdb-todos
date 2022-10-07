# SvelteKit, rxDB, PouchDB & CouchDB Todos

**NOTE: this repository needs to be updated, it was built using `"@sveltejs/kit": "next"` in the package.json file. But, SvelteKit has changed it's routing and other things that break the app in it's current state. I also think rxDB has changed as well.**
*TODO: update this repository upto the new SvelteKit routing*

A simple todos app using SvelteKit, rxDB, PouchDB, CouchDB and Tailwind CSS. Data is stored in browser IndexedDB with rxDB (PouchDB) and syncs with a remote CouchDB database.

![Screenshot of SvelteKit, rxDB PouchDB, CouchDB Todos](/static/sveltekit-rxdb-pouchdb-couchdb-todos-screenshot.png)

## Features

- [X] Add todos
    - [X] By pressing the Add button
    - [X] By pressing `Enter` key while the caret is in todo item input field
    - [X] Won't add todo item if the todo item input field is empty
    - [X] Keeps caret focus in add todo input field for quick succession of adding todo items
- [ ] Update todos
    - [ ] Update todo item on blur or by pressing Enter key
- [X] Delete todos
    - [X] By pressing `X` (delete) button
    - [ ] By having an empty todo item input field on blur or by pressing `Enter` key
- Reactive data
- Beautiful UI

## TODO
- [ ] Change how todo items are updated and marked completed. rxDB doesn't allow svelte binding on rxDB's data directly, get the following error
`Since version 8.0.0 RxDocument.set() can only be called on temporary RxDocuments`

## Give it a whirl

Once you've cloned or downloaded the project, install dependencies with `npm install` (or `pnpm install` or `yarn`), then start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment.
