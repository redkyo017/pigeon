const net = require('net');
const client = new net.Socket();
const port = 8080;
const host = '127.0.0.1';

client.connect(port, host, function() {
    client.write(`1%0
        1+1
        10*5
        101/10
        99%10
        0-1
        0/0
        0.1+0.2
        1 + 1
        5+a
        0 + 4294967296
        hello world`);
});

client.on('data', function(data) {
    console.log(`${data}`);
});

client.on('close', function() {
    console.log('Connection closed');
});