"use strict"
var express = require('express');
var app = express();

// *************************************************************************
// Middleware, zum parsen des Post-Bodies, der angeliefert wird
// *************************************************************************

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// *************************************************************************
// Simple Passwortprüffunktion, Daten wären sonst irgendwo abgelegt
// *************************************************************************

var users = [
    { 
      username: 'test1',
      password: '5a105e8b9d40e1329780d62ea2265d8a' // md5: test1
    },
    { 
      username: 'test2',
      password: 'ad0234829205b9033196ba818f7a872b' // md5: test2
    }
  ]

var md5 = require('md5') // sicherer ist bcrypt aber das ist mir zu langsam

function validateUser (input) {
  if (!input.username) {
    return 'Fehler: Benutzername nicht eingegeben'
  }  
  if (!input.password) {
    return 'Fehler: Passwort nicht eingegeben'
  }  

  let user = users.find(x => x.username === input.username)

  if (!user) {
    return 'Fehler: Username nicht bekannt'
  }

  if (md5(input.password) === user.password) {
    return 'OK'
  }
  else {
    return 'Falsches Passwort'
  }
}


// *************************************************************************
// Middleware, für post auf "https:/0.0.0.0:8080/login"
// *************************************************************************
app.post('/login', function (req,res) {
  res.setHeader('Content-Type', 'text/html')

  res.write(validateUser(req.body))
  
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