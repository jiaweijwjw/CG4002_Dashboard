/* Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection 
and defines the shape of the documents within that collection. */
const mongoose = require('mongoose');
const sessionSubSchema = require("./session_model").schema;
const SubSchema = mongoose.Schema;

const userSubSchema = new SubSchema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  }, 
  current_dance_move: { // can be integer also.
    type: String,
    enum: ['stationary', 'zigzag', 'pushback', 'hair', 'rocket', 'elbowlock', 'scarecrow', 'windows', 'shouldershrug'],
    required: true
  },
  current_position: {
    type: Number,
    required: true,
    min: 1, max: 3, default: 2
  },
  iteration_score: {
    type: Number,
    // required: true,
    min: 0, max: 100, default: 0
  },
  session: { // have to use populate here
    type: mongoose.Schema.Types.ObjectId, ref: 'sessionSubSchema'
  }
});

/* userSubSchema.query.byUsername = function(username) {
  return this.find({ user: username });
}; */

// instance of documents already have their own built in instance methods too.
// any instance / static methods to add?

// ADD QUERY HELPERS / CHAINABLE QUERY BUILDER API

const User = mongoose.model('User', userSubSchema);

module.exports = User;


