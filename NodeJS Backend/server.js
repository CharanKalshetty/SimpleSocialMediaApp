const http = require('http');
const app = require('./backend/app');

app.set('port', 3000);
const server = http.createServer(app);

server.listen(3000, (req, res) => {
    console.log("Listening on port 3000...");
});
