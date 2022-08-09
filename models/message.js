const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    title: String,
    content: String,
    timestamp: Date,
    creator: {type: Schema.Types.ObjectId, ref: 'User'}
})

MessageSchema.virtual('url')
          .get(function () {return `messages/${this.id}`})

module.exports = mongoose.model('Message', MessageSchema)