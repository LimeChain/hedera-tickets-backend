import { connect } from 'mongoose'

export class DBConfig {

    static connect () {
        connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true
        });
    }
}
