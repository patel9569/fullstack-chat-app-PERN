import  {Pool}from 'pg'

import dotenv from 'dotenv'
import createTablesQuery from '../models/schemaDB.js';
 


dotenv.config()

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD,PGPORT } = process.env;

const db = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: PGPORT,
  ssl: {
    require: true,
  },
});

async function initDB() {
    try {
        await db.query(createTablesQuery)
        console.log("Database initialized successfully");
        
    } catch (error) {
        console.log("error in intial DB",error)
    }
    
}




db.on('connect',()=>{
    console.log("database is connected successfully")
})

db.on('error',(err)=>{
    console.error(' Unexpected error on idle client', err)
    process.exit(-1)
})

    
   
  





export default db 
export {initDB}
