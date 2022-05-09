const url = document.URL;

const data = { message: 'this is the request message' };

function post(data) {
    let request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(data));
}