const Team = require('../models/team_model');
const User = require('../models/user_model');
const Session = require('../models/session_model');

const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { countDocuments } = require('../models/session_model');


exports.team_get = function (req, res) {
    var team_name = req.params.teamname; // B14
    Team.find({ teamname: team_name })
        .then(team => res.send(team))
        .catch(error => res.status(400).res.json('Error: ${err}'));
    /* async.parallel({
        teamname: function(callback) {
            Team.find().where('teamname').equals(team_name).select('teamname').exec(callback);
        },
        users: function(callback) {
            Team.find().where('teamname').equals(team_name).select('users').exec(callback);
        },
        sessions: function(callback) {
            Team.find().where('teamname').equals(team_name).select('sessions').exec(callback);
        },
        /* test: function(callback) {
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
    }); */
};


/*
what data will come from eval server?

How to entire team?
teamname = B14
users = [user1, user2, user3 ...]
for each user in users, 
    current_dance_move = ?
    position = ?
    iteration_score = ?


1 dancer by 1 dancer
teamname = ? <string>
username = ? <string>
current_dance_move = ? <string>
position = ? <number>
iteration_score = ? <number>

*/

exports.team_update = function (req, res) {
    var team_name = req.params.teamname;
    var user_name = req.params.username;

    Team.update(
        { "teamname": team_name, "users.username": user_name }, // update(query, update, options)
        {
            "$set": {
                "users.$.current_dance_move": req.body.current_dance_move,
                "users.$.current_position": req.body.current_position
            }
        },
        function (err, doc) {
            if (err) throw err;
            res.send('successfully updated'); // can just console.log()
        }
    );

};

exports.team_update_whole = function (req, res) {
    var team_name = req.params.teamname;
    // var team = Team.find({ "teamname": team_name });

    for (i = 0; i < req.body.length; i++) {
        Team.update(
            { "teamname": team_name, "users.username": req.body[i].username }, // update(query, update, options)
            {
                "$set": {
                    "users.$.current_dance_move": req.body[i].current_dance_move,
                    "users.$.current_position": req.body[i].current_position,
                    "users.$.iteration_score": req.body[i].iteration_score
                },
                "$push": {
                    "users.$.user_session_graph": req.body[i].iteration_score
                }
            },
            function (err, doc) {
                if (err) throw err;
                // res.send('successfully updated'); // can just console.log()
            }
        )
    };
    res.send('updated'); // not required
    /* for (i = 0; i < team.users.length; i++) { 
    if (req.body[1].username === team.users.username) {
        team.users.current_dance_move = req.body[1].current_dance_move;
        team.users.current_position = req.body[1].current_position;
        team.save();
    }
} */
};

exports.team_clear_array = function (req, res) {
    var team_name = req.params.teamname;
    for (i = 0; i < req.body.length; i++) {
        Team.update(
            { "teamname": team_name, "users.username": req.body[i].username }, // update(query, update, options)
            {
                "$set": {
                    "users.$.user_session_graph": [],
                },
            },
            function (err, doc) {
                if (err) throw err;
                // res.send('successfully updated'); // can just console.log()
            }
        )
    };
    res.send('cleared array'); // not required
};


exports.team_create = function (req, res) {
    // var team = req.body.teamname;

    // Validate fields.
    body('teamname', 'teamname must not be empty').trim().isLength({ min: 1 }),
        // body('username', 'username must not be empty.').trim().isLength({ min: 1 }),
        // body('current_dance_move', 'current_dance_move must not be empty.').trim().isLength({ min: 1 }),
        // body('position', 'position must not be empty').isNumeric(),
        // body('iteration_score', 'iteration_score must not be empty').
        sanitizeBody('teamname').escape()

    const team = new Team();
    // team.teamname = JSON.stringify(req.body.teamname);
    team.teamname = req.body.teamname;
    team.save().then(team => {
        res.status(200).json({ 'team': 'team added successfully' });
    })
        .catch(err => {
            res.status(400).send('failedd');
        });

};



/* exports.team_create = [

    // Convert the users to an array
    (req, res, next) => {
        if(!(req.body.users instanceof Array)){
            if(typeof req.body.users==='undefined')
            req.body.users=[];
            else
            req.body.users=new Array(req.body.users);
        }
        next();
    },

    // Validate fields.
    body('teamname', 'teamname must not be empty').trim().isLength({ min: 1 }),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var team = new Team(
          { teamname: req.body.teamname,
            // users: [{ username: req.body.users[0]}, { username: req.body.users[1]}, {username}]
           });

            // Get all authors and genres for form.
            async.parallel({
                team: function(callback) {
                    Team.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Update Book',authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
            return;


    }
]; */







/* exports.index = function(req, res) {

    async.parallel({
        team_count: function(callback) {
            Team.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        user_count: function(callback) {
            User.countDocuments({}, callback);
        },
        session_count: function(callback) {
            Session.countDocuments({}, callback);
        }
    }, function(err, results) {
        // specifying a view (template) named 'index' and an
        // object containing the data that is to be inserted into it
        res.render('index', { title: 'Home Page', error: err, data: results });
    });
}; */

/* exports.user_get = function(req, res) {
    async.parallel({
        teamname: function(callback) {
            Team.findOne({teamname: 'B14'}, callback);
        },
        function(err, results) {
            res.status(200).send(results);
        }
    })
} */

/* exports.team_details = function(req, res) {
    res.send('NOT IMPLEMENTED: Team detail: ' + req.params.id);
};

// Display book create form on GET.
exports.team_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Team create GET');
};

// Handle book create on POST.
exports.team_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Team create POST');
};

// Display book delete form on GET.
exports.team_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Team delete GET');
};

// Handle book delete on POST.
exports.team_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Team delete POST');
};

// Display book update form on GET.
exports.team_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Team update GET');
};

// Handle book update on POST.
exports.team_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Team update POST');
}; */

/* // Display list of all books.
exports.book_list = function(req, res, next) {

  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });

}; */