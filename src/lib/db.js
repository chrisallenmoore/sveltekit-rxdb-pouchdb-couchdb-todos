import { browser } from "$app/env";
import { createRxDatabase } from 'rxdb';
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';

var rxdbpouchdb;

var theCollections;

if (browser) {
    /**
     * Wait until pouchdb stuff is imported and then use PouchDB
     * Do this inside (browser) or onMount
     * Must do this for it to work in SvelteKit
     */
    // because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
    addPouchPlugin(await import('pouchdb-adapter-idb'));
    addPouchPlugin(await import('pouchdb-adapter-http'));
    rxdbpouchdb = await createRxDatabase({
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
                type: 'boolean'
            }
        },
        required: ['id', 'item', 'completed']
    };

    theCollections = await rxdbpouchdb.addCollections({
        todos: {
            schema: todoSchema
        }
    });
}

/**
 * Rename to the variables that will be used in the app
 */
export var db = rxdbpouchdb;
export var collections = theCollections;