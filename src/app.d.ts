// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: BetterSQLite3Database;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
