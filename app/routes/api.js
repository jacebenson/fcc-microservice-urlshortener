'use strict';
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

    app.route('/new/:url')
        .get(function (req, res) {
            var term = encodeURIComponent(req.query.term);
            var offset = parseInt(req.query.offset, 10) || 0;
            res.set('Content-Type', 'text/html');
            res.send(content);
            //start mongodb insert call
            var d = new Date();
            var dateString = d.toDateString();
            console.log(mongoURI);
            MongoClient.connect(mongoURI, function (err, db) {
                if (err) throw err;
                var id = db.collection('imagesearches').count({}, function (error, numOfDocs) {
                    if (err) throw err;
                    //console.log('numOfDocs: ' + numOfDocs);
                    if (numOfDocs !== null) {
                        if (numOfDocs > 5) {
                            //console.log('numOfDocs > 5 deleting one where, dateString: ' + dateString);
                            db.collection('imagesearches').remove({ created: { $ne: dateString } });
                        }
                    }
                    var item = {
                        query: term,
                        created: dateString
                    };
                    db.collection('imagesearches').insert(item);
                    db.close();
                });
            });
            //end mongodb call
        });
    app.route('/api/history')
        .get(function (req, res) {
            try {
                console.log('getting recent queries');
                MongoClient.connect(mongoURI, function (err, db) {
                    if (err) throw err;
                    var cursor = db.collection('imagesearches').find().toArray(function (err, docs) {
                        if (docs.length === 0) {
                            res.set('Content-Type', 'application/json');
                            res.send(JSON.stringify({ message: 'No recent queries.' }, '', '    '));
                        } else {
                            res.set('Content-Type', 'application/json');
                            res.send(JSON.stringify(docs, '', '    '));
                        }
                    });
                });

            } catch (error) {
                error.source = 'historyCall';
                console.error(error);
                //res.set('Content-Type', 'application/json');
                //res.send(JSON.stringify(error));
            }
        });
};