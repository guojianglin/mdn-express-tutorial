const { Schema, model } = require('mongoose')
var moment = require('moment');

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 10 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }
})

AuthorSchema.virtual('name').get(function () {
  return `${this.first_name}, ${this.family_name}`
})

AuthorSchema.virtual('lifespan').get(function () {
  const death = this.date_of_death ? this.date_of_death : new Date()
  const birth = this.date_of_birth ? this.date_of_birth : new Date() 
  return (death.getYear() - birth.getYear()).toString()
})

AuthorSchema
.virtual('birth_formatted')
.get(function () {
  return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : ''
})

AuthorSchema
.virtual('death_formatted')
.get(function () {
  return this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : ''
})

AuthorSchema
.virtual('form_birth')
.get(function () {
  return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : ''
})

AuthorSchema
.virtual('form_death')
.get(function () {
  return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : ''
})

AuthorSchema.virtual('url').get(function () {
  return `/catalog/author/${this._id}`
})

module.exports = model('Author', AuthorSchema)
