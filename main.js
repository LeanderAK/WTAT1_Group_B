const router = require('./router'),
    layouts = require("express-ejs-layouts"),
    port = 3000, express = require("express"),
    app = express(), path = require("path"),
    errorController = require("./controllers/errorController"),
    bodyParser = require('body-parser');

const mongoose = require("mongoose");
mongoose.connect(
    "mongodb://127.0.0.1:27017/creape_db",
    {useNewUrlParser: true}
);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("view engine", "ejs")
app.use(layouts)
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());
app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(port, () => {
    console.log(`The Express.js server has started and is listening on port number: ${port}`);
});

