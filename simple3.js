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