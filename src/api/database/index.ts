import * as mongoose from 'mongoose'

class DBConfig {

    static connect () {
        mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true
        });
    }
}

module.exports = DBConfig;
