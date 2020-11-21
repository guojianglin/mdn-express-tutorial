const { Schema, model } = require('mongoose')

const GenreSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 }
})

GenreSchema.virtual('url').get(function () {
  return `/catalog/genre/${this._id}`
})

module.exports = model('Genre', GenreSchema)
