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
// Etwas zusätzliche Middleware um aus dem Header die Cookies zu lesen und sie zu setzen
// *************************************************************************
var cookieParser = require('cookie-parser')
app.use(cookieParser('xyz')) // Parameter ist der String zum signieren der Signed Cookies. Viel zu kurz, aber ist ja nur eine Demo

// Nur zur info. Statt xyz könnte man sich eine Zufallszahl generieren:
// Jedenfalls macht es das dem Hacker schwieriger den signierten Cookie zu fälschen
// also sich selbst einen zu signieren und so tun als hätte man sich angemeldet
// crypto = require('crypto')
// var token = crypto.randomBytes(64).toString('hex');

// *************************************************************************
// Middleware, für post auf "https://0.0.0.0:8080/login"
// *************************************************************************
app.post('/login', function (req,res) {
  res.setHeader('Content-Type', 'text/html')

  let ret = validateUser(req.body)
  if (ret === 'OK') {
     let options = {
        maxAge: 1000 * 60 * 0.75, // 45 Sekunden nur, rein zu Demo
        httpOnly: true,           // Verhindert, dass der Cookie von Skripten ausgelesen wird
        signed: true              // Digitales signieren des Cookies
    }

    // Set cookie
    res.cookie(
      'SessionCookie',    // Cookie Name, damit wir ihn wieder finden
      req.body.username,  // Hier speichern wir mal den Benutzernamen ab, den können wir später dann auch gebrauchen
      options             // Optionen von oben
    ) 
    res.write(ret + "<br><br><a href='/secret'>Weiter zu /secret</a>")
  } 
  else {
    res.write(ret + "<br><br><a href='/'>Erneut versuchen</a>")
  }
  
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
// Middleware, für get auf standard Pfad /secret
// *************************************************************************
app.get('/secret', function (req, res) {
  console.log('Zugriff auf /secret')
  console.log('Signed cookies auslesen:', req.signedCookies)
  if (!req.signedCookies.SessionCookie) {
    res.send(`
      <h1>Geheimer Bereich</h1>
      <h2>Nur angemeldete Benutzer dürfen diesen Bereich sehen</h2>
    `);
  }
  else {
    res.send(`
      <h1>Hallo ${req.signedCookies.SessionCookie}</h1>
      <h2>Du bist angemeldet. Darum siehst Du den geheimen Bereich!</h2>
    `);
  }
});

// *************************************************************************
// Jetzt wird gehorcht
// *************************************************************************
const hostname = process.env.IP;
const port = process.env.PORT || 8080;

console.log('start listening',port,hostname);

app.listen(port, hostname);