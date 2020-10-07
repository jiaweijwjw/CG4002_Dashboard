const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const userSubSchema = require("./user_model").schema;
const sessionSubSchema = require("./session_model").schema;

const Schema = mongoose.Schema;

const teamSchema = new Schema({
  teamname: {
    type: String,
    required: true,
    default: 'B14', // wont be used since we need a teamname to create team
    minlength: 3,
    unique: true
  },
  timing_difference_graph: {
    type: [],
    default: []
  },
  users: {
    type: [userSubSchema], // array of subdocuments
    default: [{username: 'user1'}, {username: 'user2'}, {username: 'user3'}]
  },
  sessions: {
    type: [sessionSubSchema], // array of subdocuments
    default: [{sessionNumber: 0}]
  }
});

teamSchema.plugin(uniqueValidator);

teamSchema.query.currentSession = function(teamname) { // unused
  return this.find({teamname: teamname})
  .find().where('sessions').slice(-1) // get the latest session (current session)
}

/* teamSchema.query.byTeamname = function(teamname) {
  return this.find({ teamname: teamname });
}; */

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;