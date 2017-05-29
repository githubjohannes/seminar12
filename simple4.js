var express = require('express');
var app = express();

// *************************************************************************
// Middleware. Ist immer ein Stück Code der durclaufen wird mit 3 Parametern
// Siehe auch http://expressjs.com/de/guide/writing-middleware.html
// Hier ist eine Beispielfunktion und mit use wird sie jedesmal durchlaufen
// *************************************************************************

var myLogger = function (req, res, next) {
  console.log('Logger Method', req.method, req.originalUrl);
  next();
};

app.use(myLogger);

// *************************************************************************
// Middleware, zum parsen des Post-Bodies, der angeliefert wird
// *************************************************************************

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
// Es gibt verschiedene Arten wie der Body übertragen wird. Hiermit wird
// festgelegt, dass es das URL Encoding ist, das wir erhalten. Das machen
// Browser normalerweise so. 
// Der zusätzliche Parameter "extended" sagt nur aus, dass Library 
// "querystring" statt Library "qs" benutzt wird. Eigentlich Internas.

// Alles beschrieben auf https://github.com/expressjs/body-parser#bodyparsertextoptions

app.use(bodyParser.urlencoded({ extended: false }))

// Das ist der eigentliche Body Parser, der dann den Body als Javascript 
// Objekt zurück gibt JSON = Javascript Object Notation

app.use(bodyParser.json());

// *************************************************************************
// Middleware, für post auf "https:/0.0.0.0:8080/login"
// *************************************************************************
app.post('/login', function (req,res) {
  // req.body steht nur zur Verfügung wegen app.use(bodyParser.json()
  console.log('req.body', req.body); 
  res.setHeader('Content-Type', 'text/plain')
  
  // JSON ist standard Javascript Library. Stringify macht string daraus. 
  // Parameter 1: Javascript Objekt
  // Paramater 2: Funktion die den String verändert (hier keine)
  // Parameter 3: Anzahl der Leerstellen, macht es etwas schöner
  res.write('Die Eingabe war:\n' + JSON.stringify(req.body, null, 2))
  
  res.end()    

});

// *************************************************************************
// Middleware, für get auf standard Pfad: Das Login Formular
// *************************************************************************
app.get('/', function (req, res) {
  // Bemerke die "Backticks" !
  res.send(`
    <form action="/login" method="post">
	    <div>
        <label>Username:</label>
        <input type="text" name="username"/><br/>
	    </div>
	    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
	    </div>
	    <div>
        <input type="submit" value="Submit"/>
	    </div>
    </form>
  `);
});

// *************************************************************************
// Jetzt wird gehorcht
// *************************************************************************
const hostname = process.env.IP;
const port = process.env.PORT || 8080;

console.log('start listening',port,hostname);

app.listen(port, hostname);