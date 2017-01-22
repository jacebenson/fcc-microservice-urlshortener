mongoURI = require('./.env').uri;//has exports.uri = 'mongodb://..:..@url'
mongodb = require('mongodb');
MongoClient = mongodb.MongoClient;
exports.returnObj = {};
exports.findByID = function (id) {
    MongoClient.connect(mongoURI, function (err, db) {        
        if (err) throw err;
        console.log('looking for id: ' + id);
        var results = db.collection('shorts').findOne({ id: id }, function (err, item) {
            console.log(item);
            exports.returnObj = item;
        });
    });
    console.log('findByID return: ' + JSON.stringify(exports.returnObj));
    return exports.returnObj;
};

exports.findByURL = function (requestedUrl) {
    var resultFound = { id: false };
    MongoClient.connect(mongoURI, function (err, db) {
        if (err) throw err;

        console.log('looking for url: ' + requestedUrl);
        var results = db.collection('shorts').findOne({ original_url: requestedUrl }, function (err, item) {
            console.log(item);
            exports.returnObj = item;
        });
    });

};

exports.insert = function (requestedUrl) {
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
                exports.returnObj = { original_url: requestedUrl, id: numOfDocs };
                //return numOfDocs;
            });
        } else {
            console.error('Error on insert: ' + err);
        }
    });
    return exports.returnObj;
}