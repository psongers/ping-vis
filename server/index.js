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
    // Default High Watermark buffersize for stdout appears fine here
    ping = spawn('ping', ['-D', req.query.ip]);
    console.log(req.query.ip);

    ping.stdout.on('data', (chunk) => {
        res.write('data: ')
        res.write(chunk);
        res.write('\n\n')
    });
    ping.on('close', (code) => {
        console.log('Ping ended')
        req.destroy()
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