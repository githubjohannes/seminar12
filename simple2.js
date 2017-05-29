var express = require('express');
var app = express();

const hostname = process.env.IP;
const port = process.env.PORT || 8080;

app.get('/', function (req, res) {
    res.send('Hallo express Welt !');
});

console.log('start listening',port,hostname);
app.listen(port, hostname);