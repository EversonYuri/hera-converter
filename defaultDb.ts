import { clearAndInsertDefaultDatabase } from './src/db/clearDatabase';

console.log("cleaning DB")
await clearAndInsertDefaultDatabase()
console.log("database cleaned")

process.exit(0)