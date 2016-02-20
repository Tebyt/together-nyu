var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


var activitySchema = new mongoose.Schema( {
    userid: String,
    type: String,
    loc: { type: [Number], index: '2dsphere' },
    subject: String,
    description: String,
    startTime: Date,
    endTime: Date
});

var activity = mongoose.model('activity', activitySchema);

var userSchema = new mongoose.Schema( {
    username: String,
    password: String
})

var user = mongoose.model('user', userSchema);


router.post('/user', function(req, res, next) {
    user.create(req.body, function(err, data) {
        if (err) return next(err);
        res.json(data);
    }) 
});

router.get('/user/:username/:password', function(req, res, next) {
    user.find({username: req.params.username}, function(err, data) {
        console.log(req.params.password);
        console.log(data.password);
        if (err) return next(err);
        if (data.password != req.params.password) return res.sendStatus(401);
        activity.find({userid: req.params.username}, function(err, data) {
            if (err) return next(err);
            res.json(data);
        })
    })
    
})

router.get('/activity/:loc', function(req, res) {
    var locParam = JSON.parse(req.params.loc);
    console.log(locParam);
    
    activity.find({
        "loc": {
            $near: {
                $geometry: {
                    "type": "Point",
                    "coordinates": [locParam[0], locParam[1]]
                },
                $maxDistance: locParam[2]
            }
        }
    }, function(err, data) {
        if (err) res.send(err);
      res.json(data);
    })
    
});

router.post('/activity', function (req, res, next) {
    activity.create(req.body, function(err, data) {
        if (err) return next(err);
        res.json(data);
    })  
});

router.get('/hello', function(req, res) {
    res.json({"test": "hello"});
})

module.exports = router;