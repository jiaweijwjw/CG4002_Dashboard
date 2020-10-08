const express = require('express');
const router = express.Router();

// Require controller modules.
const team_controller = require('../controllers/team_controller');
const user_controller = require('../controllers/user_controller');
const session_controller = require('../controllers/session_controller');
// const { route } = require('../server');

// router.get('/', team_controller.index);

router.get('/team/:teamname', team_controller.team_get);

// router.get('/session/:teamname/:username', session_controller.session_get_current);
// router.get('/session', session_controller.session_get_current);

router.get('/user/:teamname/:username', user_controller.user_get);

//router.post('/update/:teamname', team_controller.team_update_whole); // THIS HAS TO BE BEFORE THE OTHER TEAM_UPDATE.
router.post('/update/:teamname/:sessionnumber', team_controller.team_update_whole); // THIS HAS TO BE BEFORE THE OTHER TEAM_UPDATE.
// for data input from eval server
// router.post('/update/:teamname/:username/:sessionNumber', team_controller.team_update);

router.post('/cleararray/:teamname', team_controller.team_clear_array);
// creating a team with 3 users and 1 default session.
router.put('/team/create', team_controller.team_create);

router.post('/newsession/:teamname', team_controller.new_session);

router.put('/create/session/:sessionnumber', team_controller.create_session);



module.exports = router;







/* router.get('/team/create', team_controller.team_create_get);
// GET request forreating a Team. NOTE This must come before routes that display Team (uses id).

// POST request for creating Team.
router.post('/team/create', team_controller.team_create_post);

// GET request to delete Team.
router.get('/team/:id/delete', team_controller.team_delete_get);

// POST request to delete Team.
router.post('/team/:id/delete', team_controller.team_delete_post);

// GET request to update Team.
router.get('/team/:id/update', team_controller.team_update_get);

// POST request to update Team.
router.post('/team/:id/update', team_controller.team_update_post);

// GET request for one Team.
router.get('/team/:id', team_controller.team_details);  */

/* // GET request for list of all Book items.
router.get('/team', book_controller.book_list); */

/// SESSION ROUTES ///

// GET request for creating Session. NOTE This must come before route for id (i.e. display session).


// POST request for creating Session.
/* router.post('/session/create', session_controller.session_create_post);

// GET request to delete Session.
router.get('/session/:id/delete', session_controller.session_delete_get);

// POST request to delete Session.
router.post('/session/:id/delete', session_controller.session_delete_post);

// GET request to update Session.
router.get('/session/:id/update', session_controller.session_update_get);

// POST request to update Session.
router.post('/session/:id/update', session_controller.session_update_post);

// GET request for one Session.
router.get('/session/:id', session_controller.session_details); */

/* // GET request for list of all Sessions.
router.get('/authors', author_controller.author_list); */

/// USER ROUTES ///

// GET request for creating a User. NOTE This must come before route that displays Users (uses id).
/* router.get('/user/create', user_controller.user_create_get);

//POST request for creating User.
router.post('/user/create', user_controller.user_create_post);

// GET request to delete User.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete User.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/user/:id', user_controller.user_details); */

/* // GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list); */

/* /// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance. 
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);  */

