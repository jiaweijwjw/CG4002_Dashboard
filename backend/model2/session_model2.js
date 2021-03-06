const mongoose = require('mongoose');

const SubSchema = mongoose.Schema;

const sessionSubSchema = new SubSchema({
    sessionNumber: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }, 
    list_of_moves_done: {
        type: [String],
        default: {}
    },
    user_individual_overall_grade: {
        type: Map, // how to ensure the user names are unique?
        of: Number
    },
    overall_team_grade: {
        type: Number,
        // required: true,
        min: 0,
        max: 100,
        default: 0
    }
});

/* sessionSubSchema.query.bySessionNumber = function(sessionNumber) {
    return this.find({ session: sessionNumber });
}; */

const Session = mongoose.model('Session', sessionSubSchema);

module.exports = Session;