var http = require('http');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGOLAB_URI;

var url = {
  findByID: function (id) {
    MongoClient.connect(mongoURI, function (err, db) {
      if (!err) {
        console.log("We are connected");
        console.log('looking for ' + JSON.stringify(url));
        var collection = db.collection('shorts');
        var stream = collection.find({ id: id }).stream();
        var itemFound = stream.on("data", function (item) {
          console.log('streaming on "data"\n' + JSON.stringify(item, '', '  '));
          return item;
        });
        stream.on("end", function () {

          console.log('streaming on "end"');
          if (itemFound) {
            console.log('itemFound');
          } else {
            console.log('itemFound not truthy');
          }
        });
      } else {
        console.error('FindRecord Error: ' + err);
      }
    });
  },
  findByURL: function (requestedUrl) {
    // Connect to the db
    var obj = {};
    MongoClient.connect(mongoURI, function (err, db) {
      if (!err) {
        console.log("We are connected");
        console.log('looking for ' + JSON.stringify(requestedUrl));
        var collection = db.collection('shorts');
        var stream = collection.find({ original_url: requestedUrl }).stream();
        var itemFound = null;
        var item = stream.on("data", function (item) {
          console.log('streaming on "data"\n' + JSON.stringify(item, '', '  '));
          url.item = item;
        });
        stream.on("end", function () {
          console.log('streaming on "end"');
        });
        if(url.item){
          return url.item;
        } else {
          return url.insert(requestedUrl);
        }
      } else {
        console.error('FindRecord Error: ' + err);
      }
    });
  },
  insert: function (requestedUrl) {
    // Connect to the db
    MongoClient.connect(mongoURI, function (err, db) {
      if (!err) {
        console.log('Inserting url: ' + requestedUrl);
        var id = db.collection('shorts').count({}, function (error, numOfDocs) {
          if (error) {
            console.error(error);
          }
          if (numOfDocs === null) {
            numOfDocs = 0;
          }
          console.log('numOfDocs: ' + numOfDocs);
          db.collection('shorts').insert({ original_url: requestedUrl, id: numOfDocs });
          return { original_url: requestedUrl, id: numOfDocs };
          //return numOfDocs;
        });
      } else {
        console.error('Error on insert: ' + err);
      }
    });
  }
};
function handleRequest(request, response) {
  var returnObj = {};
  var input = request.url.toString().split('/')[1];
  console.log('input: ' + input);
  if (input === 'new') {
    var requestedUrl = request.url.toString().replace(/^.+new\//, '');
    //create new entry
    //first look for existing entry
    //if not found insert it, return object with ...
    //{ "original_url":"http://foo.com:80", "short_url":"https://myurl.com/8170" }
    //if found, return object with ...
    //{ "original_url":"http://foo.com:80", "short_url":"https://myurl.com/8170" }
    returnObj = url.findByURL(requestedUrl);
  } else {
    console.log('looking for id: ' + input)
    //returnObj = url.findByID(id);
    //lookup entry
    //if found, redirect to original_url
    //if not found, error
  }
  /*  var returnObj = {
      requested_input: input,
      url: url
    };
    */
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(returnObj, '', '    '));
}

var server = http.createServer(handleRequest);
server.listen(PORT, function () {
  console.log("Server listening on: http://localhost:%s", PORT);
});