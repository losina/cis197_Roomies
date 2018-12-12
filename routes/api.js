var express = require('express')
var router = express.Router();
var Post = require('../models/posts.js')
var User = require('../models/users.js')
var Group = require('../models/groups.js')

router.get('/getPosts', function (req, res, next) {
    posts = Post.find({group: req.session.group}, function (err, result) {
        if (err) next(err)
        res.json(result);
    })
})

router.post('/addTodos', function (req, res, next) {
    var newTodo = {todoText: req.body.todoText}
    var groupName = req.session.group;
    Group.findOneAndUpdate(
        {groupName : groupName},
        {$push: {todos: newTodo}}, function (err, result) {
            if (err) next(err)
            res.json({success:'OK'})
        }
    )
})

router.get('/getTodos', function (req, res, next) {
    Group.findOne({groupName: req.session.group}, function (err, result) {
        if (err) next(err) 
        res.json(result)
    })
})
router.post('/addPosts', function (req, res, next) {
    var postTitle = req.body.postTitle
    var postText = req.body.postText
    var author = req.session.user
    var group = req.session.group
    var comments = []
    var  q = new Post({ postTitle, postText, author, comments, group }) // ES6 shorthand
    q.save(function (err, result) {
      if (err) next(err);
      res.json({status: 'OK'})
    })
})

router.post('/answerPosts', function (req, res, next) {
    var newComment = req.body.comment
    var id = req.body.pid
    Post.findOneAndUpdate(
        {_id: id},
        { $push: {comments: newComment}}, function (err, result) {
            if (err) next(err)
            res.json({success: 'OK'})
        })
    
})

router.post('/deletePosts', function (req, res, next) {
    var id = req.body.pid
    Post.findOneAndDelete({_id : id, author: req.session.user}, function (err, result) {
        if (err) next(err)
        res.json({status: 'OK'})
    })
})


router.get('/getRequests', function (req, res, next) {
    User.findOne({username: req.session.user}, function (err, result) {
        if (err) next(err)
        if (result == null) {
            res.json(null);
        } else {
            res.json(result.requests);
        }
        
    })
})

router.post('/acceptRequests', function (req, res, next) {
    var id = req.body.rid;
    var groupName = req.body.groupName;
    var userName = req.session.user;
    Group.findOneAndUpdate( {groupName: groupName}, 
        {$push : {members: userName}}, function (err, result) {
            if (err) next(err)
            User.findOneAndUpdate({username: userName}, 
                {$pull: {requests: {$elemMatch: {_id: id}}}}, function (err, result){
                    if (err) next(err)
                    res.json({success:'OK'})
                })
        })
})

router.post('/rejectRequests', function (req, res, next) {
    var id = req.body.rid;
    User.findOneAndUpdate({username: req.session.user},
        {$pull: {requests: {$elemMatch: {_id: id}}}}, function (err, result){
            if (err) next(err)
            res.json({success:'OK'})
        })
})


module.exports = router;
