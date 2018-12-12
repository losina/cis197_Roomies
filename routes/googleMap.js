var express = require('express');
var router = express.Router();
var Place = require('../models/location.js')

router.post('/save', function (req, res, next) {
  var description = req.body.description;
  var contact_info = req.body.contact_info;
  var lat = req.body.lat;
  var lng = req.body.lng;
  var geo_name = req.body.geo_name;
  var locat = new Place({ description: description, contact_info : contact_info, lat: lat, lng: lng, geo_name: geo_name})
  locat.save(function(err, result) {
      if (err) {
          next (err)
      } else {
          res.json({success: "OK"})
      }
  })
})

router.get('/getPlace', function (req, res, next) {
    Place.find({}, function (err, result){
        if (err) next(err)
        res.json(result)
    })
})
module.exports = router;