const router = require('./router')
const layouts = require("express-ejs-layouts")
const port = 3000, express = require("express"), app = express();
const path = require("path")
const errorController = require("./controllers/errorController")

app.set("view engine", "ejs")
app.use(layouts)

app.use(express.json());
app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(port, () => {
 console.log(`The Express.js server has started and is listening on port number: ${port}`);
});

