const jwt = require("jwt-then");
const express = require('express'),
    path = require('path'),
    Session = require('express-session'),
    bodyParse = require('body-parser'),
    passport = require('./auth/passport'),
    mongoose = require('mongoose'),
    middleware = require('connect-ensure-login'),
    FileStore = require('session-file-store')(Session),
    config = require('./config/default'),
    flash = require('connect-flash'),
    port = config.server.port,
    app = express(),
    node_media_server = require('./media_server'),
    thumbnail_generator = require('./cron/thumbnails');
mongoose.connect('mongodb://127.0.0.1/nodeStream' , {  useUnifiedTopology: true,
useNewUrlParser: true});

require("./database/User");
require("./database/Chatroom");
require("./database/Message");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));
app.use('/thumbnails', express.static('server/thumbnails'));
app.use(flash());

app.use(require('cookie-parser')(config.server.secret));
app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());

app.use(Session({
    store: new FileStore({
        path : 'server/sessions'
    }),
    secret: config.server.secret,
    maxAge : Date().now + (60 * 1000 * 30),
    resave: false,
    saveUninitialized: true,
 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('*',require("cors")());
// Register app routes
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/settings', require('./routes/settings'));
app.use('/streams', require('./routes/streams'));
app.use('/chatroom', require('./routes/chatroom'));
app.use('/user', require('./routes/user'));
app.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/login');
});

app.get('*', middleware.ensureLoggedIn(),async (req, res,next) => {
    res.render('index');

    
    next();
});

const server = app.listen(port, () => console.log(`App listening on ${port}!`));
node_media_server.run();
thumbnail_generator.start();

const io = require("socket.io")(server);

// io.on("connection",async socket => {
//   console.log("a user connected :D");
//   socket.on("chat message", msg => {
//     console.log(msg);
//     io.emit("chat message", msg);
//   });
// });





const Message = mongoose.model("Message");
const User = mongoose.model("User");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, config.server.secret);
    socket.userId = payload.id;

    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });

      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message,
      });
      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.username,
        userId: socket.userId,
      });
      await newMessage.save();
    }
  });
});
