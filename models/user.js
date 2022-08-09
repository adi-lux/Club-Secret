const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
    membership: Boolean,
    admin: Boolean,
    creationDate: Date
})

UserSchema.virtual('url')
          .get(function () {return `users/${this.id}`})

module.exports = mongoose.model('User', UserSchema)