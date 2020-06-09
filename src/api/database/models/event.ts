import { Schema, model } from 'mongoose'

const EventSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    },
    contractID: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    }
});

export default model('EventModel', EventSchema);
