var returnObj = {};
var http = require('http');
var validUrl = require('valid-url');
mongoURI = require('./.env').uri;//has exports.uri = 'mongodb://..:..@url'
mongodb = require('mongodb');
MongoClient = mongodb.MongoClient;
var port = process.env.PORT || 5000;
function insert(requestedUrl, response) {
  MongoClient.connect(mongoURI, function (err, db) {
    if (err) throw err;
    console.log('Inserting url: ' + requestedUrl);
    var id = db.collection('shorts').count({}, function (error, numOfDocs) {
      if (err) throw err;
      if (numOfDocs === null) {
        numOfDocs = 0;
      }
      item = { original_url: requestedUrl, id: numOfDocs };
      db.collection('shorts').insert(item);
      response.end(JSON.stringify(item, '', '   '));
      db.close();
    });
  });
}
function findByID(input, response) {
  MongoClient.connect(mongoURI, function (err, db) {
    if (err) throw err;
    db.collection('shorts').findOne({ id: parseInt(input, 10) }, function (err, item) {
      //db.collection('shorts').findOne({ id: '"' + input + '"' }, function (err, item) {
      if (item) {
        //response.end(JSON.stringify(item, '', '   '));
        response.writeHead(302, {
          'Location': item.original_url
        });
        response.end();
      } else {
        response.end(JSON.stringify({ error: 'Could not find record.' }, '', '   '));
      }
    });
    db.close();
  });
}

function findByURL(requestedUrl, response) {
  //verify url is valid;
  if (validUrl.isWebUri(requestedUrl)) {
    var resultFound = { id: false };
    MongoClient.connect(mongoURI, function (err, db) {
      if (err) throw err;
      db.collection('shorts').findOne({ original_url: requestedUrl }, function (err, item) {
        console.log(typeof item);
        console.log(JSON.stringify(item));
        if (item) {
          response.end(JSON.stringify(item, '', '   '));
        } else {
          insert(requestedUrl, response);
        }
      });
      db.close();
    });
  } else {
    response.end(JSON.stringify({error: "Not valid URL."}, '', '   '));
  }
}
function handleRequest(request, response) {
  response.setHeader('Content-Type', 'application/json');
  var input = request.url.toString().split('/')[1];
  var requestedUrl = request.url.toString().replace(/^.+new\//, '');
  returnObj._input = input;
  returnObj._requesetdUrl = requestedUrl;
  if (input === 'new') {
    //create new entry
    //first look for existing entry
    //if not found insert it, return object with ...
    //if found, return object with ...
    console.log('looking for url ' + requestedUrl);
    findByURL(requestedUrl, response);
  } else {
    //lookup entry
    //if found, redirect to original_url
    //if not found, error
    console.log('looking for record# ' + input);
    findByID(input, response);
  }
}

var server = http.createServer(handleRequest);
server.listen(port, function () {
  console.log("Server listening on: http://localhost:%s", port);
});