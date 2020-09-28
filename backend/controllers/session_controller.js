const Team = require('../models/team_model');
const User = require('../models/user_model');
const Session = require('../models/session_model');

exports.session_get_current = function(req, res) {
    var team_name = req.params.teamname;
    var user_name = req.params.username;
    async.parallel({
        sessionNumber: function(callback) {
            Team.find().currentSession(team_name)
            .select('sessionNumber')
            .exec(callback)
        },
        /* list_of_moves_done: function(callback) {
          Team.find().where('teamname').equals('B14')
          .find().where('sessions').slice(-1)
          .select('list_of_moves_done')
          .exec(callback)
        }, */
        list_of_moves_done: function(callback) {
            Team.find().currentSession(team_name)
            .select('list_of_moves_done')
            .exec(callback)
        },
        user_individual_overall_grade: function(callback) {
            Team.find().currentSession(team_name)
            .find().where('user_individual_overall_grade').get(user_name)
            .exec(callback)
        },
        overall_team_grade: function(callback) {
            Team.find().currentSession(team_name)
            .select('overall_team_grade')
            .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.sessionNumber==null) { // No results.
            var err = new Error('Session not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.status(200).send(results);
        //res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
    });

};


/* exports.session_details = function(req, res) {
    res.send('NOT IMPLEMENTED: Session details: ' + req.params.id);
};

exports.session_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Session create GET');
};

exports.session_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Session create POST');
};

exports.session_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Session delete GET');
};

exports.session_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Session delete POST');
};

exports.session_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Session update GET');
};

exports.session_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Session update POST')
}; */
