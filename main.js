const router = require('./router') 
const port = 3000,
 express = require("express"),
 app = express();


app.use(express.json());
app.use('/', router);

app.listen(port, () => {
 console.log(`The Express.js server has started and is listening
➥ on port number: ${port}`);
});

