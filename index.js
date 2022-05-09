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
const filePathMap = {
    'properties': './server/app/properties.json',
};

(async() => {
    const tunnel = await localtunnel({ port });
    timestampLog(`Tunnel on ${tunnel.url}`);
})()

const server = http.createServer((request, response) => {
    timestampLog(`${request.socket.remoteAddress} requested ${request.url}`);
    // response.setHeader('Access-Control-Allow_Origin', '*');

    if (request.method == 'POST') {
        var body = ''
        request.on('data', data => { body += data; });
        request.on('end', () => {
            timestampLog(`${request.socket.remoteAddress} posted ${body}`);
            switch (body) {
                case 'properties':
                    sendFile(response, filePathMap['properties']);
                    return;
                default:
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end('Post received');
                    return;
            }
        });
        return;
    }
    if (request.method == 'GET') {
        sendFile(response, `.${request.url}`);
        return;
    }


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

function sendFile(response, filePath) {
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
        return;
    });
}