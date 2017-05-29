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