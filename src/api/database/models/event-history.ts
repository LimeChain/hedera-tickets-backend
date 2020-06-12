import { Schema, model } from 'mongoose'

const EventHistorySchema = new Schema({
    id: Schema.Types.ObjectId,
    group: {
        number: Number,
        history: [
            {
                type: String
            }
        ],
        historyTime: [
            {
                type: String
            }
        ]
    }
});

export default model('EventHistoryModel', EventHistorySchema);
