import {Pool} from "pg";
import {DateTime} from "luxon";


export interface IHours {
    id: number;
    day: DateTime;
    customer: string;
    project: string;
    task: string;
    from: DateTime;
    to: DateTime;
    description: string;
    processed: boolean;
}

export class Db {
    private _pool: Pool;

    private static _instance: Db;

    public static get instance(): Db {
        if (!this._instance) {
            this._instance = new Db();
        }
        return this._instance;
    }

    private constructor() {
        this._pool = new Pool({
            host: '192.168.0.228',
            port: 5432,
            user: process.env.pgUser,
            password: process.env.pgPassword,
            database: process.env.pgDatabase
        });
    }

    async getHours(includeProcessed = false): Promise<IHours[]> {
        const client = await this._pool.connect();
        const results = await client.query('SELECT * FROM hours WHERE processed = $1', [includeProcessed])
            .then(res => res.rows.map(e => ({
                id: e.id,
                day: DateTime.fromJSDate(e.day),
                customer: e.customer,
                project: e.project,
                task: e.task,
                from: DateTime.fromFormat(e.from, 'HH:mm:ss'),
                to: DateTime.fromFormat(e.to, 'HH:mm:ss'),
                description: e.description,
                processed: e.processed
            }) as IHours));
        client.release();
        return results;
    }

    async setProcessed(id: number) {
        const client = await this._pool.connect();
        await client.query('UPDATE hours SET processed = true WHERE id = $1', [id]);
        client.release();
    }
}
