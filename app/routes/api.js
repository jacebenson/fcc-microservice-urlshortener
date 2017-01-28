'use strict';
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoURI = process.env.MONGOLAB_URI || require('./.env').uri;
function findByURL(requestedUrl, response) {
    //verify url is valid;
    var validUrl = require('valid-url');
    if (validUrl.isWebUri(requestedUrl)) {
        var resultFound = { id: false };
        MongoClient.connect(mongoURI, function (err, db) {
            if (err) throw err;
            db.collection('shorts').findOne({ original_url: requestedUrl }, function (err, item) {
                console.log(typeof item);
                console.log(JSON.stringify(item));
                if (item) {
                    response.send(JSON.stringify(item, '', '   '));
                } else {
                    insert(requestedUrl, response);
                }
            });
            db.close();
        });
    } else {
        response.send(JSON.stringify({ error: "Not valid URL." }, '', '   '));
    }
}
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
    console.log('looking for ' + input);
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
module.exports = function (app) {
    var client_id = process.env.CLIENT_ID || require('./.env').client_id;
    var mongoURI = process.env.MONGOLAB_URI || require('./.env').uri;
    var http = require('http');
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    /**
     * @api {get} /new/:url
     * @apiName Insert URL
     * @apiVersion 1.0.0
     * @apiGroup New
     * 
     * @apiExample {curl} Example usage:
     * curl http://url-svc.herokuapp.com/new/https://google.com
     * 
     * @apiParam {String} url URL to add.
     *      
     * @apiSuccess {Object} shortURL information
     * @apiSuccess {String} shortURL._id mongoDB id
     * @apiSuccess {String} shortURL.original_url Original URL
     * @apiSuccess {String} shortURL.id ID used for short URL
     * 
     * @apiSuccessExample Success-response
     *      HTTP/1.1 200 OK
     *      {
     *          "_id": "588464016d933500047cb0f6",
     *          "original_url": "http://google.com",
     *          "id": 5
     *      }
     */

    /**
     * @api {get} /:number
     * @apiName GetURL
     * @apiVersion 1.0.0
     * @apiGroup Get
     * 
     *  
     * @apiExample {curl} Example usage:
     * curl http://url-svc.herokuapp.com/5
     * 
     * @apiSuccessExample Success-response
     *      HTTP/1.1 200 OK
     *      Connection: keep-alive
     *      Content-Type: application/json
     *      Date: Wed, 25 Jan 2017 17:48:28 GMT
     *      Location: http://google.com
     *      Server: Cowboy
     *      Transfer-Encoding: chuncked
     *      Via: 1.1 vegur
     */

    app.route('/new/*')
        .get(function (req, res) {
            //console.log(req.path);
            res.set('Content-Type', 'application/json');
            var term = encodeURIComponent(req.query.term);
            //start mongodb insert call
            var requestedUrl = req.path.replace(/^\/new\//, '');
            findByURL(requestedUrl,res);
        });
    app.route('/:num')
        .get(function (req, res) {
            console.log(req.path);
            findByID(req.path.replace(/\//,''),res);
        });
};