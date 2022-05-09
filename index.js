const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const localtunnel = require('localtunnel');
// const websocket = require('websocket');
//
const host = 'localhost';
const port = 8080;

const contentTypeMap = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
};

(async() => {
    const tunnel = await localtunnel({ port });
    timestampLog(`Tunnel on ${tunnel.url}`);
})()

const server = http.createServer((request, response) => {
    timestampLog(`${request.socket.remoteAddress} requested ${request.url}`);

    request.on('data', chunk => {
        timestampLog(`${request.socket.remoteAddress} posted ${JSON.parse(chunk.toString())}`);
    });

    response.setHeader('Access-Control-Allow_Origin', '*');

    let filePath = `.${request.url}`;
    if (filePath == './') { filePath = './index.html' }
    let extension = path.extname(filePath);
    let contentType = contentTypeMap[extension];

    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error(err);
            response.writeHead(500);
            response.end('Internal error. Please reload page.');
            return false;
        }

        response.writeHead(200, { contentType });
        response.end(content, 'utf-8');

    });

});

//
server.listen(port, host, () => {
    timestampLog(`Server on http://${host}:${port}`);
});

// const websocketServer = new websocket.server({
//     httpServer: server,
//     autoAcceptConnections: false
// });

// websocketServer.on('request', request => {
//     if (!originIsAllowed(request.origin)) {
//         request.reject();
//         return;
//     }

//     //
//     let connection = request.accept('echo-protocol', request.origin);
//     connection.on('message', message => {
//         console.log(message);
//     });
// });

// function originIsAllowed(origin) {
//     return true;
// }

function timestampLog(content) {
    let date = new Date();
    console.log(`${(date.getDate() + 100).toString().substring(1)}/${(date.getMonth() + 100).toString().substring(1)}/${date.getFullYear()} ${(date.getHours() + 100).toString().substring(1)}:${(date.getMinutes() + 100).toString().substring(1)}:${(date.getSeconds() + 100).toString().substring(1)}.${(date.getMilliseconds() + 1000).toString().substring(1)} | ${content}`);
    return;
}