import http from 'node:http';
const PORT = 3000;

const serever = http.createServer ((requestAnimationFrame, res) => {
    console.log(req)

    res.writeHead(200);
    res.end("hi~"); 
});

serever.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});