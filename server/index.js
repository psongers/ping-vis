const express = require('express')
const { spawn } = require('child_process');

const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/ping', (req, res)=> {
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
    });

    ping = spawn('ping', ['-D', '192.168.0.1']);
    ping.stdout.on('data', (chunk) => {
        res.write(chunk);
    });
    ping.on('close', (code) => {
        console.log('Ping ended')
    });
    
    // When the client closes the stream (TCP connection I believe)
    // the callback will be run
    req.on('close', function() {
        ping.kill('SIGINT')
    })
})

app.get('/stop-ping', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))