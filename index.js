var http = require('http');
const PORT = process.env.PORT || 5000;
function handleRequest(request, response) {
  var returnObj = {
    //headers: JSON.stringify(request.headers,'','  '),
    language: request.headers['accept-language'].split(',')[0],
    os: request.headers['user-agent'].split('(')[1].split(')')[0],
    ip: request.headers['x-forwarded-for']
  };
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(returnObj, '', '  '));
}

var server = http.createServer(handleRequest);
server.listen(PORT, function () {
  console.log("Server listening on: http://localhost:%s", PORT);
});