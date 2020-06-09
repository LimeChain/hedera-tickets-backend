import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    id: Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    hederaAccount: {
        name: String,
        key: String
    }
});

UserSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

export default model('UserModel', UserSchema);
