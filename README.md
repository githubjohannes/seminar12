# Seminar 12

In diesem Seminar gehe ich darauf ein, wie man Seiten mit Passwort schützen kann.

## Schlüsselbegriffe

Einige wichtige Begriffe in diesem Zusammenhang sind

### Authentification

Authentifizierung im deutschen: "Bist Du wirklich der, der Du sagst, der Du bist".
Eine übliche Methode die Authentifizierung ist die Passwortprüfung, da man
davon ausgeht, dass nur die wirkliche Person das Passwort kennt. 

### Authorization

Darf die Person, die man authentifiziert hat, das tun was sie zu tun wünscht. 
Also ist sie authorisiert.

### Encryption

Verschlüsseln von Daten

### Decryption

Entschlüsseln von Daten

### Cipher

Deutsch: Verschlüsselungsverfahren. Manchmal auch Cypher oder Cypher Algorithm.

### Private Key

Sollte geheim bleiben. Private Key erlaubt das entschlüsseln von Daten, die
mit einem zugehörigen Public Key verschlüsselt wurden.

### Public Key

Darf jeder haben. Public Key verschlüsselt Daten auf eine Art und Weise, dass
man sie nur noch mit dem zugehörigen Private Key entschlüsseln kann.

### Asymmetrische Verschlüsselung

Man kann nur verschlüsseln mit einem Key aber nicht mehr entschlüsseln. Wie
bei Private/Public Key.

### Symmetrische Verschlüsselung

Man kann mit einem Key verschlüsseln und entschlüsseln.

### SSL / TLS

SSL = Secure Sockets Layer -  Vorgänger von TLS = Transport Layer Security.
Verschlüsselungssystem zum sicheren übertragen von Daten. 

### HTTPS

Verwendung von TLS beim Übertragen von Daten mit HTTP. Ein gutes Schaubild
hierzu auf https://comodosslstore.com/blog/how-do-ssl-certificates-works.html

1) Browser an Server: Bitte SSL Verbindung
2) Server an Browser: Hier mein Zertifikat (enthält Public Key und Informationen
über die Webseite. Zertifikat ist signiert von jemand dem man vertraut)
3) Browser an Server: Hier ist der mit deinem Public Key verschlüsselte
Verschlüsselungskey für diese Sitzung. Server entschlüsselt mit dem Private
Key den Verschlüsselungskey.
4) Server an Browser: Hier sind die mit dem Verschlüsselungskey verschlüsselten
Daten.
Welches Symmetrische Verschlüsselungsverfahren benutzt wird wählt der Server
anhand eine Liste von Verfahren aus, die der Browser vorschlägt: Welche 
Dein Browser benutzt kannst Du hier abfragen: https://cc.dcsec.uni-hannover.de/

Sicher ist also auf jeden Fall die Verbindung nur mit HTTPS. Dann wird aber
alles verschlüsselt. Sehen kann man im Browser die URL und die Daten, aber
über die Leitung geht nichts davon unverschlüsselt.

### Cookie

Bei jedem HTTP Request geht auch ein Header zum Browser und ein Header vom 
Browser zum Server. Alle Cookies gehen immer hin und her im Header, sofern
der Cookie noch gültig ist. Es sind einfach ein klein wenig Daten die 
beim Browser gespeichert werden können.

### REST

Abkürzung für Representational State Transfer. Im Grunde geht es darum Daten
über HTTP mit GET und POST und weiteren solchen Verben auszutauschen, die 
aber eben nicht HTML Seiten sind.

### JSON 

Javascript Object Notation. Daten im Format 

```JS
 {
  "Herausgeber": "Xema",
  "Nummer": "1234-5678-9012-3456",
  "Deckung": 2e+6,
  "Waehrung": "EURO",
  "Inhaber":
  {
    "Name": "Mustermann",
    "Vorname": "Max",
    "maennlich": true,
    "Hobbys": [ "Reiten", "Golfen", "Lesen" ],
    "Alter": 42,
    "Kinder": [],
    "Partner": null
  }
}
```
Quelle: Wikipedia

### JWT

Digital signierter String, der aufgrund der Signatur ganz sicher nur von einem
bestimmten Server kommen konnte und damit den Sender des JWT berechtigt
auf bestimmte Daten auf dem Server zuzugreifen bzw. zu weiteren Operationen
berechtigt. Zu was der Sender des JWT berechtigt ist, muss sich der Server
nicht merken, weil es steht alles im JWT drin. Vorteil ist, das Systeme 
sehr skalierbar sind.

Beispiel eines JWT (3 Teile, durch Punkte getrennt):
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0.
yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw`

Im Klartext:

```JS
{
  “alg”: “HS256”,
  “typ”: “JWT”
}
{
  “iss”: “toptal.com”,
  “exp”: 1426420800,
  “https://www.toptal.com/jwt_claims/is_admin”: true,
  “company”: “Toptal”,
  “awesome”: true
}
(Teil 3 ist die Signatur über Teil 1 und 2)
```
Quelle: https://www.toptal.com/web/cookie-free-authentication-with-json-web-tokens-an-example-in-laravel-and-angularjs

### payload

Hat nicht mit Zahlungsverkehr zu tun. Das sind die eigentlichen Daten 
nicht das darum herum, wie Header oder Signatur usw. Im JWT bezeichnet man
den mittleren Teil als "payload".


## Teil 1 - Eigene Prüfung

Im ersten Teil werden wir mit einem Session Cookie arbeiten, der gesetzt wird
nachdem sich der Benutzer erfolgreich angemeldet hat. Für eine REST Daten 
Schnittstelle würde/könnte man eine JWT benutzen. Aber Cookie wird schon seit
Jahren erfolgreich benutzt. Das Beispiel erlaubt uns auch etwas in 
die Grundlagen von HTTP und HTTP Headern usw. einzugehen.

Ich gehe hierzu durch die 5 Sourcedateien `simple.js` bis `simple6.js`

### Vorbereitung

Folgende Schritte zur Vorbereitung durchführen

- Neuen Workspace in Cloud 9 anlegen. Am besten mit "Blank", dann muss nicht viel 
weggelöscht werden.
- Als zu clonendes Repository https://github.com/juergen-hollfelder/seminar12.git
angeben
- Oder später `git clone https://github.com/juergen-hollfelder/seminar12.git` 
in der Kommandozeile eingeben
- Node auf neueste Version updaten: `nvm install stable`
- Sicherstellen, dass sie benutzt wird `nvm ls` 
- Eventuell muss `nvm use stable` eingegeben werden
- Jetzt müssen noch die node_modules installiert werden mit `npm install`

### Schritt 1: simple.js
Folgendes ist jetzt die allereinfachste Art mit node auf HTTP requests zu
hören und sie zu beantworten.

```JS
const http = require('http');

const hostname = process.env.IP;
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    console.log('serving request');
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hallo Welt\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Das Programm erklärt sich fast von alleine. Es wird das Paket `http` benutzt
um die Variable `server` mit dem Objekt zu befüllen, dass den HTTP Listener
enthält. Bei jedem HTTP Request wird der übergebene Request Header befüllt.

Einfach mal kurz bisschen mit den HTTP Headerfeldern auseinandersetzen. Hier 
sind diese erklärt. 

https://de.wikipedia.org/wiki/Liste_der_HTTP-Headerfelder

Es gibt Headerfelder bei der Anfrage und dann wieder Headerfelder bei der
Antwort. Wir setzen in der Antwort den Header `Content-Type` auf `text/plain`.
Üblicher ist hier `text/html`. Der Browser behandelt es dann in der Darstellung
anders. 

### Schritt 2: simple2.js

Da aber die Library `http` etwas kompliziert werden kann, gibt es ein Paket, 
dass darauf aufsetzt und dieses nennt sicher `express`. Es wird wie folgt
verwendet:

```JS
var express = require('express');
var app = express();

const hostname = process.env.IP;
const port = process.env.PORT || 8080;

app.get('/', function (req, res) {
    res.send('Hallo express Welt !');
});

console.log('start listening',port,hostname);
app.listen(port, hostname);
```

Auch das ist wieder selbsterklärend. Einfach mal kurz Zeile für Zeile durchgehen.
Damit wir es in Cloud9 gut verwenden können werden die Umgebungsvariablen `IP`
und `PORT` benutzt, die man mit `process.env` in Javascript erhält.

### Schritt 3: simple3.js

Jetzt wollen wir ein Anmeldeschirm schicken. Um es einfach zu halten, habe
ich den HTML Code "Inline" codiert. Der Browser ist so freundlich
und setzt die fehlenden Tags drum herum. Das kann man gut mit den Chrome
Developer Tools sehen. Im Kontext-Menü "Seitenquelltext anzeigen" (Ctrl+U) 
wird man 1:1 sehen was wir unten weitergeben. Aber bei "Untersuchen" (Ctrl+Umschalt+I)
wird man sehen, dass plötzlich der Code in ein `<html><head></head><body> ... </body></hmtl>` gewrappt ist.

Hier also das Programm:

```JS
var express = require('express');
var app = express();

const hostname = process.env.IP;
const port = process.env.PORT || 8080;

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

console.log('start listening',port,hostname);
app.listen(port, hostname);
```

Im Node stehen noch nicht alle ES6 (aka ES2015) Funktionalitäten zur Verfügung.
Insbesondere fehlt das `import` Statement. Deswegen wird noch `require` benutzt.
Aber die Backticks sind möglich. Man nennt sie "Template Literals" und es ist 
auch möglich Variablen einzubinden. Man könnte mitten drin sowas wie

```JS
  <p>
    Hallo ${name}!
  </p>
```

sagen und automatisch wird dann `${name}` mit dem Variableninhalt ersetzt.

Jetzt noch kurz zur Bedeutung des HTML Codes:

- `form` ist der Wrapper für ein Formular. Es gibt an welche HTTP Methode 
benutzt wird wenn der Submit Knopf gedrückt (hier POST) und an welche URL
auf dem Server das Formular geschickt wird (hier `/login`)
- `div` verursacht in diesem Fall dass `label` und `input` zusammen bleiben
- `label` ist das Label eines Eingabefeldes
- `input` ist das Eingebefeld. `name` wird beim Senden des Feldes an den Server
wichtig. `type` gibt an wie sich das Eingabefeld verhält. `password` blendet 
die Eingabe aus.
- `input type="submit"` ist dann der Knopf mit dem man das Formular losschickt
- Ein Enter in einem Formularfeld triggered aber auch die `action`

Gemacht wird damit aber noch nichts, weil die Route `/login` wurde noch nicht 
implementiert

### Schritt 4: simple4.js

Jetzt wird es schon einiges länger, weil wir müssen jetzt etwas "Middleware" 
einsetzen. Was im Zusammenhang mit express.js als Middleware verstanden wird 
ist in folgendem Link gut beschrieben:  http://expressjs.com/de/guide/writing-middleware.html

Zur Demo habe ich unten einen Logger definiert. Einfach eine Funktion die etwas
aus dem Request Header auf der Console ausgibt. Damit dieses Stück Middleware
verwendet wird, wird es mit `app.use` eingebunden.

Aber es wird Middleware auch eingebunden bei `app.get` oder `app.post`

Um die Eingabefelder auszulesen, müssen wir den Request Body auslesen können. Dazu
benötigt es ein Paket `body-parser`, darin sind mehrere "Middleware" Funktionen
enthalten. Davon verwenden wir zwei: `urlencoded` und `json`. Beises wird in den 
Kommentaren näher erläutert.

Dann in `app.post` wird für `/login` dieser Body ausgelesen. Mehr machen wir
hier mal noch nicht. Der Rest des Programmes ist unverändert.

```JS
var express = require('express');
var app = express();

// *************************************************************************
// Middleware. Ist immer ein Stück Code der durchlaufen wird mit 3 Parametern
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
```

### Schritt 5: simple5.js

Da wir ja irgendwie rausfinden müssen ob Benutzer und Passwort richtig sind, 
wird jetzt eine Funktion eingefügt. Um es wieder einfach zu halten, wird alles
im Code gehalten, statt der Zugriff auf eine Datenbank. Folgendes kommt dazu 
bzw. wird verändert:

```JS
"use strict"

...

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
```

Kurz zu `"use strict"`: Damit werden Fehler erzeugt, wenn eine Variable nicht
deklariert ist. Aber es erlaubt auch `let` für die Definition lokaler Variablen
zu erzeugen, sonst sind mit `var` immer alle Variablen global gültig und
das kann zu anderen Problemen führen.

MD5 ist ein Hash Algorithmus. Passwörter sollten nicht im Klartext abgespeichert 
werden. Mann kann MD5 nicht zurück umwandeln. MD5 ist nicht mehr State of the Art
und es gibt verschiedene Meinungen darüber wie man es jetzt richtig macht. 

Ein guter Artikel ist dieser: https://codahale.com/how-to-safely-store-a-password/

Es wird darin ausgesagt, dass man mit "Brute Force" (alles durchprobieren) nur
40 Sekunden benötigt bei MD5. Man sollte dann doch lieber bcrypt benutzen, 
da brauch man dann 12 Jahre. Leider hat die Javascript Routine 1.2 Sekunden
zum verschlüsseln gebraucht (und damit auch zum Abgleich richtiges/falsches 
Passwort). Es gibt eine bessere bcrypt Implementierung die in C++ geschrieben
ist, aber ich hatte Probleme diese auf der Cloud9 zum laufen zu bringen. Da es
ja nur eine Demo des Prinzips ist, blieb ich dann bei MD5.

Der mystische `users.find(x => x.username === input.username)` Befehl ist das 
Suchen in einem Array in dem sich Objekte befinden. Das ist ES6 Syntax. In ES6
hat jedes Array die Methode `find`. Diese Methode erwartet als Parameter eine Funktion.
Also würde man etwas schreiben wie:

```JS
  users.find(function(x) { 
    return x.username === input.username
  }
```

x ist immer das einzelne Objekt im Array und ein belieber Variablenname.
`===` ist der Vergleich auf Inhalt und Typengleichheit, hier nicht sehr wichtig 
ob Typengleich, aber man gewöhnt es sich an. Ohne Typengleichheit mit `==` 
vergleichen.

Jedenfalls spricht man bei `=>` vom Operator für Arrow Functions oder zu 
Deutsch Pfeilfunktionen. Wenn dahinter keine geschweifte Klammern stehen, 
werden diese zugefügt inklusive `return` also `{ return <Ausdruck> }`. Macht
es kürzer. Es gibt noch andere Vorteile, aber das würde jetzt zu weit führen. 
Hier gibt es mehr dazu:
https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/Pfeilfunktionen

### Schritt 6: simple6.js

Nachdem jetzt das Passwort geprüft wurde wäre der Benutzer angemeldet. Aber 
wie wissen wir denn, dass der gleiche Benutzer wieder kommt? Nun, nichts ist
völlig sicher aber viele Jahre schon wurde das mit Cookies gelöst. Ein Cookie 
kann in einer HTTP Response mitgeschickt werden. Der Browser legt es automatisch 
ab und gibt den Cookie bei jedem Request auf der Seite wieder mit.

Hier der veränderte Code:

```JS
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

...

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
```

In den Chrome Developer Tools sich unter der Lasche "Application" den Cookie
anschauen, nach erfolgreichem anmelden. Dieser verschwindet nach 45 Sekunden. 
Wenn man darauf wartet kommt es einem länger vor.

## Teil 2 - passport.js

Im Teil 2 schauen wir uns an wie password.js verwendet. Dieses Modul baut
auf express.js auf. Es gibt verschiedene "Strategien" die password.js 
beherrscht. Z.B. kann man sich mit seinen Google Konto oder mit seinem 
Facebook Konto anmelden. Aber auch ein "Lokales" Passwort funktioniert 
auch. 

Die Source `index.js` und die Sourcen in den Verzeichnissen `db` und `views`
wurden von https://github.com/passport/express-4.x-local-example gecloned. Ich
habe ein paar `console.log` Statements eingebaut um den Code genau zu 
analysieren.

Wenn man `server.js` laufen lässt kann man es ausprobieren. Es sieht so aus:

https://seminar12-hol42.c9users.io/

Welcome! Please log in.

https://seminar12-hol42.c9users.io/login
```
Username:  
Password:  
(Submit)
``` 
https://seminar12-hol42.c9users.io/
```
Hello, jack. View your (profile). 
```

https://seminar12-hol42.c9users.io/profile
```
ID: 1
Username: jack
Name: Jack
Email: jack@example.com
(Log out)
```

Im Sourcecode `server.js` ist der kommentierte Teil zunächst am wichtigsten. 
Dort wird passport.js konfiguriert. Danach wird das Routing gemacht und nur 
dann, wenn der Benutzer angemeldet ist, kann man zum `/profile` bzw. `logout`.

Auch hier wird mit Cookies gearbeitet, das wird aber in `express-session` 
verwaltet und man hat damit nichts weiter zu tun.

Die Benutzer sind in dem Beispiel in `db/users.js` abgelegt. Zum Beispiel
der Benutzer 'jack' mit Passwort 'secret'.

Der HTML Code ist in 'views' und mit ejs (Embedded Javascript) geschrieben. Man
kann express.js dann mitteilen, dass "ejs" als "view engine" benutzt wird. Dann
ist man in der Lage einfach mit z.B.  ` res.render('profile', { user: req.user });` 
echten HTML Code zu erzeugen, der mit dem Javascript Objekt verknüpft wird. Mehr
zu ejs siehe hier: http://www.embeddedjs.com/

Was ist jetzt daran besser? Es sind erprobte Module und man kann sehr leicht
auch andere Strategien (facebook, google, etc.) einbinden.

## Teil 3 - Javascript Web Token

Web Tokens haben den Vorteil, dass darin Informationen darüber wozu der Benutzer
authorisiert ist enthalten sein können. Es kann darin auch das Verfallsdatum
gespeichert werden. Das Webtoken kann nicht verfälscht werden ohne Private Key.
Aber es kann natürlich gestohlen und verloren gehen. Dort ist der recht
sicherere Cookie Mechanismus weiterhin sinnvoll. Daher kann man Cookie nicht 
mit JWT vergleichen.

### jwt_demo.js

Hier erstellen wir ein JWT und prüfen es. Es gibt einige JWT Bibliotheken. 
nJWT ist vielleicht nicht die Beste (oder vielleicht doch), aber sie ist 
sehr einfach zu verwenden:

```JS
var nJwt = require('njwt');

var supergeheimesPasswort = 'geheim'; // Könnte von einem geschütztem File kommen, das eingelesen wird als Private Key

// Offizielle: https://www.iana.org/assignments/jwt/jwt.xhtml
// Oder eigene
var claims = {
 "iss": "https://seminar12-hol42.c9users.io/",
 "name": "Mr. X",
 "admin": true,
}

var jwt = nJwt.create(claims,supergeheimesPasswort,"HS256");
jwt.setExpiration(new Date().getTime() + (5*60*1000)); // in 5 Minuten

var token = jwt.compact();

console.log('das JWT: ', jwt)
console.log('-------------------------------------------------------------------------')
console.log('das JWT compact: ', token)
console.log('-------------------------------------------------------------------------')

try {
    nJwt.verify(token,"falsches Passwort", 'HS256')
    console.log('Korrekt mit falschem Passwort')
} catch (e) {
    console.log('Fehler mit falschem Passwort: ', e)
} 
console.log('-------------------------------------------------------------------------')

try {
    nJwt.verify(token,"geheim", 'HS256')
    console.log('Korrekt mit geheim')
} catch (e) {
    console.log('Fehler mit geheim: ', e)
}
console.log('-------------------------------------------------------------------------')
```

### jwt_api.js

Auf der Serverseite kann man es dann wie folgt verifizieren. Besonders dann
wenn es eine REST API ist:

```JS
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
```

### jwt_page.html

Auf der Frontseite kann es hiermit getestet werden. Du musst nur sehr
wahrscheinlich das neue Token verwenden, weil es auf nur 5 Minuten eingestellt
wurde.

```HTML
<!DOCTYPE html>
<html>
  <body>
    <h4>Token:</h4>
    <textarea rows="5" cols="100" id="tokenInput">...</textarea>
    <p>
    <button onclick="callAPI();">API request losschicken</button>
    <h4>Resultat:</h4>
    <p id="Resultat">
    </p>
  </body>
  <script type="text/javascript">
    var resultat = document.getElementById('Resultat');
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NlbWluYXIxMi1ob2w0Mi5jOXVzZXJzLmlvLyIsIm5hbWUiOiJNci4gWCIsImFkbWluIjp0cnVlLCJqdGkiOiJlMTRjNzRiMS02ZDAxLTRkNTUtYWZjYS0zMmRkZTg5Njc4M2IiLCJpYXQiOjE0OTYxMzQ3MzcsImV4cCI6MTQ5NjEzNTAzN30.04wNVFytghj5A3HSyJlBgxK-1VGVXkq8lJkxtVuduLI'
    var tokenInput = document.getElementById('tokenInput');
    tokenInput.value = token;
    function callAPI() {
      var http = new XMLHttpRequest();
      var url = "secret";
      http.open("GET", url, true);
      http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      http.setRequestHeader("Bearer", String(tokenInput.value).trim());
      
      http.onreadystatechange = function() {//Call a function when the state changes.
          if(http.readyState == 4 && http.status == 200) {
              resultat.innerHTML = 'Geheime Daten die empfangen wurden: ' + http.responseText;
          } else {
            if(http.readyState == 4) {
                resultat.innerHTML = 'Fehler: ' + http.status + ' ' + http.statusText + ' ' + http.responseText
            }
          }
      }
      http.send();  
    }
  </script>
</html>
```
