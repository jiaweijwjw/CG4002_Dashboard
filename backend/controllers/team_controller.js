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

exports.team_update_whole = async function (req, res) {
    var team_name = req.params.teamname;
    var session_num = req.params.sessionnumber;

    // var first_timing = 0; // the smallest. will it always be 0?
    var last_timing = 0; // the largest
    // let dance_moves = [];
    let dance_moves_map = new Map();
    let dance_move_done = 'stationary'

    const team = await Team.findOne({ "teamname": team_name });
    //team.current_session_number = 1;


    for (i = 0; i < req.body.length; i++) {

        team.users[i].current_dance_move = req.body[i].current_dance_move;
        team.users[i].current_position = req.body[i].current_position;
        // team.users[i].iteration_score = req.body[i].iteration_score;
        team.users[i].time_started = req.body[i].time_started;
        // team.users[i].user_session_graph.push(req.body[i].iteration_score);

        if (req.body[i].time_started > last_timing) {
            last_timing = req.body[i].time_started;
        };
        if (dance_moves_map.has(req.body[i].current_dance_move)) {
            dance_moves_map.set(req.body[i].current_dance_move, dance_moves_map.get(req.body[i].current_dance_move) + 1);
        } else {
            dance_moves_map.set(req.body[i].current_dance_move, 1);
        }
        console.log(dance_moves_map);

    };

    for (let [key, value] of dance_moves_map) {
        if (value >= 2) {
            dance_move_done = key;
        } else if (Math.max(...dance_moves_map.values()) == 1) {
            dance_move_done = 'unknown'
        }
    }
    console.log(dance_move_done);

    team.timing_difference_graph.push(last_timing);
    team.list_of_dance_moves.push(dance_move_done);

    await team.save();
    console.log(team);

    /* Session.updateOne({"sessionNumber": session_num},
        { $push: {list_of_dance_moves_done: dance_move}},
        function (err, doc) {
            if (err) throw err;
        }
    ); */

    res.send(JSON.stringify(last_timing));

};

exports.new_session = async function (req, res) {
    var team_name = req.params.teamname;

    const team = await Team.findOne({ "teamname": team_name });
    var teamSize = team.users.length;
    var len = team.timing_difference_graph.length;
    const thisSession = new Session();
    thisSession.sessionNumber = team.current_session_number;
    console.log(thisSession);
    // const session = await Session.findOne({ "sessionNumber": team.current_session_number });
    thisSession.list_of_dance_moves_done = team.list_of_dance_moves;
    thisSession.averageDelay = (len) => {
        let num_of_moves = len
        let count = 0;
        for (let i = 0; i < num_of_moves; i++) {
            count += team.timing_difference_graph[i];
        }
        console.log(count);
        console.log(num_of_moves);
        return count / num_of_moves;
    }
    console.log(thisSession.averageDelay);
    for (i = 0; i < teamSize; i++) {
        team.users[i].current_dance_move = 'stationary';
        team.users[i].current_position = 2;
        team.users[i].iteration_score = 0;
        team.users[i].time_started = 0;
        team.users[i].user_session_graph = [];
    };

    team.timing_difference_graph = [];
    team.list_of_dance_moves = [];
    team.current_session_number += 1;

     // how to guarantee it is the updated value?
    await thisSession.save().then(thisSession => {
        res.status(200).json({ 'session': 'session added successfully' });
    })
        .catch(err => {
            res.status(400).send('failed');
        });

    await team.save();
    // res.send('cleared array'); // not required
};


exports.create_session = function (req, res) {
    var session_num = req.params.sessionnumber;

    const session = new Session();
    // team.teamname = JSON.stringify(req.body.teamname);
    session.sessionNumber = session_num;
    session.save().then(session => {
        res.status(200).json({ 'session': 'session added successfully' });
    })
        .catch(err => {
            res.status(400).send('failed');
        });

};


exports.team_update_whole_original = function (req, res) {
    var team_name = req.params.teamname;
    var session_num = req.params.sessionnumber;

    // var first_timing = 0; // the smallest. will it always be 0?
    var last_timing = 0; // the largest
    // let dance_moves = [];
    let dance_moves_map = new Map();
    let dance_move_done = 'stationary'

    for (i = 0; i < req.body.length; i++) {
        if (req.body[i].time_started > last_timing) {
            last_timing = req.body[i].time_started;
        };
        if (dance_moves_map.has(req.body[i].current_dance_move)) {
            dance_moves_map.set(req.body[i].current_dance_move, dance_moves_map.get(req.body[i].current_dance_move) + 1);
        } else {
            dance_moves_map.set(req.body[i].current_dance_move, 1);
        }
        console.log(dance_moves_map);
        // var obj = {"move_name": '', "count": 0};
        // obj["move_name"] = req.body[i].current_dance_move;
        // obj["count"] += 1;
        // dance_moves.push(obj);

        Team.update(
            { "teamname": team_name, "users.username": req.body[i].username }, // update(query, update, options)
            {
                "$set": {
                    "users.$.current_dance_move": req.body[i].current_dance_move,
                    "users.$.current_position": req.body[i].current_position,
                    "users.$.iteration_score": req.body[i].iteration_score,
                    "users.$.time_started": req.body[i].time_started
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
    for (let [key, value] of dance_moves_map) {
        if (value >= 2) {
            dance_move_done = key;
        } else if (Math.max(...dance_moves_map.values()) == 1) {
            dance_move_done = 'unknown'
        }
    }
    console.log(dance_move_done);
    Team.updateOne({ "teamname": team_name },
        { $push: { timing_difference_graph: last_timing, list_of_dance_moves: dance_move_done } },
        function (err, doc) {
            if (err) throw err;
        }
    );
    /* Session.updateOne({"sessionNumber": session_num},
        { $push: {list_of_dance_moves_done: dance_move}},
        function (err, doc) {
            if (err) throw err;
        }
    ); */

    res.send(JSON.stringify(last_timing));
    // res.send('updated');
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
    Team.updateOne({ "teamname": team_name },
        {
            "$set": {
                "timing_difference_graph": [],
                "list_of_dance_moves": []
            }
        },
        function (err, doc) {
            if (err) throw err;
        }
    );
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
            res.status(400).send('failed');
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