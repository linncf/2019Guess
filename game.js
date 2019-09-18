const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const DEFAULT_PORT = 8080;

const MAX = 100;
const MIN = 1;

const OK = 200;
const WIN = 200;
const LOWER = 201;
const BIGGER = 202;
const OVER = 203;
const OUT_OF_BOUNDS = 204;
const ERROR = 404;

let pickedNumber = null;
let winner = false;

app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get("/start", function (req, response) {
    if (!pickedNumber) {
        pickedNumber = Math.floor(Math.random() * (MAX - MIN)) + MIN;
    }

    response.json({code: OK, min: MIN, max: MAX});
});

app.post("/guess/:number", (request, res) => {
    let responseObj = {code: ERROR, msg: "Game not started. Go to /start"};
    if (pickedNumber) {
        if (!winner) {
            let guess = parseInt(request.params.number);

            if (guess < MIN || guess > MAX) {
                responseObj = {code: OUT_OF_BOUNDS, msg: "You are out of bounds! Check on /start"};
            } else if (guess === pickedNumber) {
                winner = true;
                responseObj = {code: WIN, msg: "You guessed correctly ! Game over."};
            } else if (guess < pickedNumber) {
                responseObj = {code: LOWER, msg: "The number is bigger, try again!"};
            } else {
                responseObj = {code: BIGGER, msg: "The number is lower, try again!"};
            }
        } else {
            responseObj = {code: OVER, msg: "The game is already over, too bad."};
        }
        res.json(responseObj);
    } else {
        res.status(ERROR).json(responseObj);
    }
});


app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});