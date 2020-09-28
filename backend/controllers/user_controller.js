const Team = require('../models/team_model');
const User = require('../models/user_model');
const Session = require('../models/session_model');

const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.user_get = function(req, res) {
    var team_name = req.params.teamname; // B14
    async.parallel({
        teamname: function(callback) {
            Team.find().where('teamname').equals(team_name).select(/* 'teamname' */).exec(callback)
        },
        /* test: function(callback) {
            Team.find({'users': {$elemMatch : {'username' : 'user2' }}}).select().exec(callback)
            // Team.find({teamname: team_name}).select('users.username').exec(callback)
        }, */
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.teamname==null) { // No results.
            var err = new Error('Team not found');
            err.status = 404;
            return next(err);
        }
        // var parsedBody = JSON.parse(results);
        var user1 = results['teamname']['users'];
        // Successful, so render.
        res.status(200).send({user1});
        //res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
    });
};

/* exports.user_get = function(req, res) {
    var team_name = req.params.teamname; // B14
    var user_name = req.params.username; // test with user2
    async.parallel({
        teamname: function(callback) {
            Team.find().where('teamname').equals(team_name).select('teamname').exec(callback)
        },
        test: function(callback) {
            Team.find({'users': {$elemMatch : {'username' : 'user2' }}}).select().exec(callback)
            // Team.find({teamname: team_name}).select('users.username').exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.teamname==null) { // No results.
            var err = new Error('Team not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.status(200).json(results);
        //res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
    });
}; */

exports.user_zxc = function(req, res) {
    var team_name = req.params.teamname;
    var user_name = req.params.username;
    async.parallel({
        username: function(callback) {
            Team.aggregate({$match: {users: {$elemMatch: {username: user_name}}}}).exec(callback)
        },
        username: function(callback) {
            /* Team.find().where('teamname').equals(team_name)
            .aggregate({$match: {users: {$elemMatch: {username: user_name}}}})
            .exec(callback) */

            Team.find().where('teamname').equals(team_name)
            .then(
                (team) => {user = team.users.find({username: user_name});
                user.set(req.body);
                return user.save();}
            ).exec(callback)
            }
        /* username: function(callback) {
            Team.find().where('teamname').equals(team_name)
            .select('users')
            .exec(callback)
        },
        username: function(callback) {
            Team.find().where('teamname').equals(team_name)
            .find({'users.username': user_name}).select('username')
            .exec(callback)
        }, 
        current_dance_move: function(callback) {
            Team.find().where('teamname').equals(team_name)
            .find({'users.username': user_name}).select('current_dance_move')
            .exec(callback)
        },
        current_position: function(callback) {
            Team.find().where('teamname').equals(team_name)
            .find({'users.username': user_name}).select('current_position')
            .exec(callback)
        }, 
        iteration_score: function(callback) {
            Team.find().where('teamname').equals(team_name)
            .find({'users.username': user_name}).select('iteration_score')
            .exec(callback)
        } */
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.username==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        } 
        res.status(200).send(results);
    });

}; 


/* exports.user_details = function(req, res) {
    res.send('NOT IMPLEMENTED: User details: ' + req.params.id);
};

exports.user_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User create GET');
};

exports.user_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User create POST');
};

exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete GET');
};

exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
}; */

/* 
// Display list of all Authors.
exports.author_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Author list');
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
}; */