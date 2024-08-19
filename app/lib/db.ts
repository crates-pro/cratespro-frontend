// app/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    user: 'mega',
    host: '127.17.0.1',
    database: 'cratespro',
    password: 'mega',
    port: 30432,
});

export default pool;
