var express = require('express');
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated.js');
var User = require('../models/users.js')
var Post = require('../models/posts.js')
var Group = require('../models/groups.js')

router.get('/', function (req, res, next) {
    groups = Group.find({}, function (err, result) {
        if (err) next(err)
        res.render('groups', {
            groups: result, 
            user: req.session.user
        })
    })
});

router.post('/findRoommates', function (req, res, next) {
    res.render('findRoommates')
})
router.get('/findRoommates', function (req, res, next) {
    res.render('findRoommates')
})

router.post('/', function (req, res, next) {
    var groupName = req.body.groupName;
    var members = [req.session.user]
    var description = req.body.description;
    var g = new Group({groupName: groupName, members: members, description: description})
    Group.findOne({groupName: groupName}, function (err, result){
        if (err) next(err)
        if (result != null) {
          next(new Error('groupName taken -- try another one'))
        } else {
            User.findOne({username: req.session.user}, function (err, result) {
                if (err) next(err)
                result.set({group: groupName})
                req.session.group = groupName
                result.save(function (err, result) {
                    if (err) next (err)
                    g.save(function (err, result) { 
                        if (err) {
                          next(err)
                        }
                        if (!err) {
                          res.redirect('/groups/' + groupName)
                        }
                      })
                })
                
            })

        }
    })
})


router.post('/:groupName/sendRequests', function (req, res, next) {
    var groupName = req.params.groupName;
    var friend = req.body.reciever;
    var sender = req.session.user;
    User.findOne({username: friend}, function (err, result){
        if (err) next(err)
        if (result == null) {
            next(new Error('No such user'))
        } else {
            var newRequest = {friendName: sender, groupName: groupName}
            User.findOneAndUpdate({username: friend}, 
                {$push: {requests: newRequest}}, function (err, result) {
                    if (err) next(err)
                    res.redirect('/groups/' + groupName)
                })
        }

    })
})

router.get('/:groupName', function (req, res, next) {
    var groupName = req.params.groupName;
    var userName = req.session.user;
    req.session.group = groupName; 
    console.log(groupName)
    Group.findOne({groupName: groupName}, function (err, result) {
        if (err) next(err)
        if (result == null) {
            next(new Error('invalid call - no such group'))
        } else {

            if (result.members.indexOf(userName) > -1) {
                Post.find({group: groupName}, function (err, result) {
                    if (err) next (err)
                    res.render('group_single', {
                        posts: result,
                        groupName: groupName,
                        members: result.members,
                        user: req.session.user,
                        description: result.description,
                        todos: result.todos
                    })
                })
            } else {
                next(new Error('not a member'))
            }
            
        }
    })
})

module.exports = router;