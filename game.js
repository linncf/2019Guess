const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MAX = 100;
const MIN = 1;

let pickedNumber = null

// GET, POST, PUT, DELETE

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());



app.get("/number",function(req,respons,next){
    pickANumber()
    console.log("Number is " + pickedNumber);
    respons.json({code:"ok", min:MIN, max:MAX});
})

// Anything that follows /guess/ is a variable
app.post("/guess/:number", (request,res) =>{
    if(pickedNumber){
        let guess = request.params.number;
        let responsObj = (guess === pickedNumber) ? {code:"winner"}:{code:"nope"}
        //return
        res.json(responsObj);
    }else{
        res.status(404).json({code:404, msg:"Stuff happend.."})
    }
    
})


function pickANumber(){
    if(!pickedNumber){
        pickedNumber = Math.round(Math.random() * (MAX-MIN))+MIN;
    }
}


















app.listen(app.get('port'), function () { console.log('server running', app.get('port'));});