const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {DateTime} = require('luxon')

const MessageSchema = new Schema({
    title: String,
    content: String,
    timestamp: Date,
    creator: {type: Schema.Types.ObjectId, ref: 'User'}
})

MessageSchema.virtual('url')
             .get(function () {return `/messages/${this.id}`})
MessageSchema.virtual('date')
             .get(function () {return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED); })

module.exports = mongoose.model('Message', MessageSchema)