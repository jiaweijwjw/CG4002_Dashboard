const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const path = require('path'); // for temporary html view

require('dotenv').config(); // use .env file for ATLAS details
const Team = require('./models/team_model'); // require('./models/user_model'); require('./models/session_model');

const app = express();
const port = process.env.PORT || 5000;

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//const indexRouter = require('./routes/index');
// app.use('/', indexRouter);
const mainRouter = require('./routes/main_route');
app.use('/main', mainRouter);

// add the middleware libraries into the request handling chain.
app.use(cors());
app.use(express.json()); // allows us to parse JSON as our server will be receiving JSON
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const uri = process.env.ATLAS_URI; // uri can be changed if we using localhost.
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
// const local = 'mongodb://localhost:27017/test';
// mongoose.connect(local, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log("MongoDB database connection established successfully.");
})

// Socket.io
const server = require('http').createServer(app); // combined require with instantiation
const io = require('socket.io')(server);
server.listen(port, () => {console.log(`Server is running on port: ${port}`);}); // Also make sure to call .listen() on the server, not the app. 

io.on('connect', socket => { // socket here is communication channel to the client. 'connection' event returns a socket object.
  console.log('app connected');
  socket.on('initialGet', team_name => {
    console.log('server received initialGet');
    Team.find({ teamname: team_name }).then(docs => {
      io.emit('initialSend', docs);
      console.log('server sent out initialSend');
      console.log(docs);
    });

    // socket.emit('initialSend', 'fuck this shit');
    
    // console.log(team);
  })
  /* socket.emit('initialSend', () => {
    var team = Team.find({teamname : 'B14'});
    console.log(team);
    return team;
  }) */
  /* socket.on('initialGet', team_name => {
    console.log('received initialGet');
    
  }); */
  socket.on('disconnect', () => { // when the client side sends a disconnect event.
    console.log('app disconnected');
  });
})


// .watch(pipeline, options) returns a cursor (A pointer to the result set of a query.) 
// that remains open as long as a connection to the MongoDB deployment remains open 
// and the collection exists.
/* const pipeline = [
  { $match: { 'fullDocument.username': 'alice' } },
  { $addFields: { newField: 'this is an added field!' } }
]; */

// const collection = db.collection('team');
// const changeStream = collection.watch({ fullDocument: 'updateLookup' }); // cos we are doing update 
const changeStream = Team.watch({ fullDocument: 'updateLookup' }); // can watch entire db also but we dont need.
changeStream.on('change', next => { // this listener is a callback function. Function is executed everytime an event occurs.
  // process the 'next' document
  console.log('changes happened');
  // console.log(next); // view the change event response document on terminal.
  io.sockets.emit('changes_in_db', next.fullDocument) // or isit io.emit()???? 
});

/* app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}); */

module.exports = app;

/*
socket.emit('message', "this is a test"); //sending to sender-client only
socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender
socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender
socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)
socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid
io.emit('message', "this is a test"); //sending to all clients, include sender
io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender
io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender
socket.emit(); //send to all connected clients
socket.broadcast.emit(); //send to all connected clients except the one that sent the message
socket.on(); //event listener, can be called on client to execute on server
io.sockets.socket(); //for emiting to specific clients
io.sockets.emit(); //send to all connected clients (same as socket.emit)
io.sockets.on() ; //initial connection from a client.
*/

/* temporary HTML view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); */