const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const DEFAULT_PORT = 8080;

const MAX = 100;
const MIN = 1;

const HTTP_CODES = {
    NOT_FOUND: 404,
    OK: 200
};

const GAME_CODES = {
    ERROR: -1,
    OK: 200,
    WIN: 200,
    LOWER: 201,
    BIGGER: 202,
    OVER: 203
};

const ENGLISH_TXT = {
    NOT_STARTED: "Game not started. Go to /start",
    WIN: "You guessed correctly ! Game over.",
    LOWER: "The number is bigger, try again!",
    BIGGER: "The number is lower, try again!",
    OVER: "The game is already over, too bad."
};

let pickedNumber = null;
let isOver = false;

app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get("/start", function (req, response) {
    if (isOver) {
        pickedNumber = Math.floor(Math.random() * (MAX - MIN)) + MIN;
        isOver = false;
    }
    response.json({code: HTTP_CODES.OK, min: MIN, max: MAX});
});

app.post("/guess/:number", (request, res) => {
    let responseObj = {code: GAME_CODES.ERROR, msg: ENGLISH_TXT.NOT_STARTED};
    if (pickedNumber) {
        if (!isOver) {
            let guess = parseInt(request.params.number);

            if (guess === pickedNumber) {
                isOver = true;
                responseObj = {code: GAME_CODES.WIN, msg: ENGLISH_TXT.WIN};
            } else if (guess < pickedNumber) {
                responseObj = {code: GAME_CODES.LOWER, msg: ENGLISH_TXT.LOWER};
            } else {
                responseObj = {code: GAME_CODES.BIGGER, msg: ENGLISH_TXT.BIGGER};
            }
        } else {
            responseObj = {code: GAME_CODES.OVER, msg: ENGLISH_TXT.OVER};
        }
        res.json(responseObj);
    } else {
        res.status(HTTP_CODES.ERROR).json(responseObj);
    }
});


app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});