var http = require('http');
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.mongoURI;
function handleRequest(request, response) {
  var input = request.url.toString().split('/')[1];
  if(input == 'new'){
    //create new entry
    //first look for existing entry
    //if not found insert it, return object with ...
    //{ "original_url":"http://foo.com:80", "short_url":"https://myurl.com/8170" }
    //if found, return object with ...
    //{ "original_url":"http://foo.com:80", "short_url":"https://myurl.com/8170" }
  } else {
    //lookup entry
    //if found, redirect to original_url
    //if not found, error
  }
  var returnObj = {
    requested_input: input
  };
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(returnObj, '', '  '));
}

var server = http.createServer(handleRequest);
server.listen(PORT, function () {
  console.log("Server listening on: http://localhost:%s", PORT);
});