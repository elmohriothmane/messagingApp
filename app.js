require("dotenv").config();
const faker = require('faker')
var createError = require("http-errors");
const SSEManager = require('./SSEManager')
var express = require("express");
var path = require("path");
const compression = require('compression')
const SSEClient = require('./SSEClient')
var cookieParser = require("cookie-parser");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");
const WebSocket = require("ws");
var SSE = require("express-sse");
var sse = new SSE(["array", "containing", "initial", "content", "(optional)"], { isSerialized: false, initialEvent: 'message' });
const { sequelize } = require("./models");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var conseillerRouter = require("./routes/conseiller");
var utilisateurRouter = require("./routes/utlisateur");
var administeurRouter = require("./routes/administrateur");
var app = express();

const server = http.createServer(app);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.get("/stream", (req, res, next) => {
  res.flush = () => {}; 
  next();
},sse.init);
app.use("/administrateur", administeurRouter);
app.use("/utilisateur", utilisateurRouter);
app.use("/conseiller", conseillerRouter);
app.get("/events", events);
app.post("/send-event", sendEvent);
app.use("/", indexRouter);
app.use(compression());
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

sequelize.sync({ alter:false, force:false});
const {
  Utilisateur,
  Administrateur,
  Conseiller,
  Salon,
  Demande,
  Notification,
  MessageSalon,
  MessageChat,
} = require("./models")
Conseiller.create({
  email: faker.internet.email(),
  password: "12345678",
});
Administrateur.create({
  email: faker.internet.email(),
  password: "password",
}),
  Utilisateur.create({
    email: faker.internet.email(),
    password: "password",
  }).then((user1) => {
    Utilisateur.create({
      email: faker.internet.email(),
      password: "password",
    }).then((user2) => {
      Salon.create({
        nom: faker.internet.userName(),
        max: 200,
      }).then((salon1) => {
        Salon.create({
          nom: faker.internet.userName(),
          max: 202,
        }).then((salon2) => {
          user1.addSalon(salon1);
          user2.addSalon(salon1);
          user2.addSalon(salon2);
        });
      });
    });
  });
const wss = new WebSocket.Server({ server: server });
// initialize the WebSocket server instance
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
console.log(data)
    var toSend = {
      message: data,
      salon: data.idSalon,
    };
    console.log(data.toString("utf8"));
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data.toString("utf8"));
      }
    })
  })
})
let subscribers = [];
function events(request, response, next) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);
  const subscriberId = uuid.v4();
  const data = `data: ${JSON.stringify({ id: subscriberId })}\n\n`;
  response.write(data);
  const subscriber = {
    id: subscriberId,
    response,
  };
  subscribers.push(subscriber);
  request.on("close", () => {
    console.log(`${subscriberId} Connection closed`);
    subscribers = subscribers.filter((sub) => sub.id !== subscriberId);
  });
}
async function sendEvent(request, response, next) {
  const data = request.body;
  console.log()
  console.log(data)
  subscribers.forEach((subscriber) =>
    subscriber.response.write(`data: ${JSON.stringify(data)}\n\n`)
  );
  return null
}
const PORT = process.env.NODE_DOCKER_PORT || 3000;
console.log(PORT)
server.listen(PORT)
module.exports = {app,sse};