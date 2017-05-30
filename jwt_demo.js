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
