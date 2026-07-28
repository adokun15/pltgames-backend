/*
// Create a connection pool
const pool = new Pool({
  host:"",
  user:"",
   
  database: process.env.NODE_ENV === "production" ? "postgres" : "quich", // your database name
  port: process.env.NODE_ENV === "production" ? 6543 : 5432, // default PostgreSQL port
  password:
    process.env.NODE_ENV === "production" ? "PGuokcLLPqELuwoe" : "amos2005",
  // max: 20,
  // idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  // connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  //ssl: { rejectUnauthorized: false },
});
//postgresql://postgres.fcjjonixemxsnkqirwsj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres // the password you set during install

pool.on("connect", (client) => {
  console.log("DB connected!");
});
export default pool;
*/
import { Pool } from 'pg'
 
const pool = new Pool({
  user: 'dbuser',
  password: 'secretpassword',
  host: 'database.server.com',
  port: 3211,
  database: 'mydb',
})
 
/*
const client = new Client({
  user: 'dbuser',
  password: 'secretpassword',
  host: 'database.server.com',
  port: 3211,
  database: 'mydb',
})
 
await client.connect()
 
console.log(await client.query('SELECT NOW()'))
 
await client.end()*/