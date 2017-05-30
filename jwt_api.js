"use strict"
var express = require('express');
var nJwt = require('njwt');
var app = express();

var supergeheimesPasswort = 'geheim'; // Könnte von einem geschütztem File kommen, das eingelesen wird als Private Key

// *************************************************************************
// Middleware für Logging
// *************************************************************************

var myLogger = function (req, res, next) {
  console.log('log:', req.method, req.originalUrl);
  next();
};

app.use(myLogger);

// *************************************************************************
// Middleware, für Route /secret
// *************************************************************************
app.get('/secret', function (req,res) {
  console.log('Anfrage bei /secret')
  let token = req.get('bearer')
  console.log('Anfrage mit token', token)

  res.setHeader('Content-Type', 'text/html')
  
  if (!token) {
    res.status(401).end('Das darfst Du nicht') // 401 Unauthorized
  }

  try {
    let verifiedJWT = nJwt.verify(token,supergeheimesPasswort, 'HS256')
    console.log('verifiedJWT:', verifiedJWT)
    if (verifiedJWT.body.admin) {
      res.end('Chuck Norris')
    } else {
      res.status(403).end('Richtiges Token aber Du bist kein Admin!')
    }
  } catch (e) {
    console.log('Error')
    console.log(e)
    res.status(403).end(e.userMessage) // 403 Forbidden
  }

});

// *************************************************************************
// Middleware für die normale Seite
// *************************************************************************
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/jwt_page.html');
});

// *************************************************************************
// Jetzt wird gehorcht
// *************************************************************************
const hostname = process.env.IP;
const port = process.env.PORT || 8080;

console.log('start listening',port,hostname);

app.listen(port, hostname);