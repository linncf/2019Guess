const express = require('express');
const bodyParser = require('body-parser');
const languageSelector = require("./language")
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
    OK: 2000,
    WIN: 2000,
    LOWER: 2010,
    BIGGER: 2020,
    OVER: 2030
};




let pickedNumber = null;
let isOver = false;



app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(languageSelector())


app.get("/start", function (req, response) {
    if (isOver) {
        pickedNumber = Math.floor(Math.random() * (MAX - MIN)) + MIN;
        isOver = false;
    }
    response.json({code: HTTP_CODES.OK, min: MIN, max: MAX});
});

app.post("/guess/:number", (req, res) => {

    let responseObj = {code: GAME_CODES.ERROR, msg: req.language(NOT_STARTED)};
    if (pickedNumber) {
        if (!isOver) {
            let guess = parseInt(req.params.number);

            if (guess === pickedNumber) {
                isOver = true;
                responseObj = {code: GAME_CODES.WIN, msg: req.language.WIN};
            } else if (guess < pickedNumber) {
                responseObj = {code: GAME_CODES.LOWER, msg: req.language.LOWER};
            } else {
                responseObj = {code: GAME_CODES.BIGGER, msg: req.language.BIGGER};
            }
        } else {
            responseObj = {code: GAME_CODES.OVER, msg: req.language.OVER};
        }
        res.json(responseObj);
    } else {
        res.status(HTTP_CODES.NOT_FOUND).json(responseObj);
    }
});


function getClientLang(req,res,next){

    let language = req.headers["accept-language"] || DEFAULT_LANGUAGE;

    language = language.split(",")[0].split(";")[0]; //["fr;q0.9", "en;0.8"] --> ["fr","q09"]

    let languages = Object.keys(TEXTS); // ["en","no"]
    if (!languages.indexOf(language)){
        language = DEFAULT_LANGUAGE
    } 
    //language=  Object.keys(TEXTS).indexOf(language) ? language:DEFAULT_LANGUAGE;

    req.language = TEXTS[language];

    next();
}

app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});