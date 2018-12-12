$(document).ready(function () {
    
    var data = [];
    var todos = []; 
    var activeIdx = -1;
  
    // kick off getting the questions
    
    getTodos(); 
    getPost();
    // now do it  every 2.5 seconds
    setInterval(getPost, 2500);
    setInterval(getTodos, 2500);

    setInterval(renderActive, 2500);
  
    function getPost() {
      // TODO: make an ajax request to /api/getQuestions. on success
      //       set  the data variable equal to the response and render
      //       out the question previews (by callingrenderPreviews())
      //       Later on in the writeup, also render the active question 
      //       (to update it) with renderactive()
      $.ajax({
        url: '/api/getPosts',
        success: function (res) {
          if (res != null) {
            data = res; 
          }
          renderPreviews();
          renderActive();
        }
      })
    }

    function getTodos() {
      $.ajax({
        url: '/api/getTodos',
        success: function (res) {
          if (res != null) {
            todos = res.todos;
          }
          renderPreviewsTodo();
        }
      })
    }

    // makes a list  of questions which all have the question text and a data-qid attribute
    // that allows you to access their _id by doing $whateverjQueryObjectYouHave.data('qid')
    function renderPreviews() {
      $('#post').html(
          data.map((i) => '<li data-qid="' + i._id + '">' + i.postTitle + '</li>').join('')

      )

    }
    function renderPreviewsTodo() {
      $('#todo').html(
        todos.map((i) =>  '<li data-qid=' + i._id + '>' + i.todoText + '</li>').join('<br/>')
    )
     
    }

    function renderActive() {
      if (activeIdx > -1) {
        var active = data[activeIdx];
        $('#show-post').css('display', 'block');
        $('#post-title').text(active.postTitle ? active.postTitle: '');
        $('#post-text').text(active.postText ? active.postText: '');
        $('#author').text(active.author ? active.author: '');
        $('#show-comment').html(
          active.comments.map((i) => '<li>' + i + '</li>').join(''));
      } else {
        $('#show-post').css('display', 'none');
      }
    }
  
    $('#post').on('click', 'li', function () {
      var _id = $(this).data('qid');
      // TODO: When a post is clicked, set the `active` variable equal to
      //       the data of the post that is active (hint: look through the 
      //       data array. If an array entry has the same _id as the _id we just
      //       declared here, it is the active post
      data.forEach(function(post, index) {
        if (post._id === _id) {
          activeIdx = index
        } 
      })
      
     
      // we now render out the active post
      renderActive();
    })
  
    $('#todo').on('click', 'li', function () {
      var _id = $(this).data('qid');
      $('#' + _id).css("text-decoration", "line-through");
    })
    
    $('#show-post').on('click', '#submitComment', function () {
      var comment1 = $('#comment').val();
      $.ajax({
        url: '/api/answerPosts',
        type: 'POST',
        data: {comment: comment1, pid : data[activeIdx]._id},
        success: function(res) {
          console.log(res)
        }
      })
    })
    
    $('#show-post').on('click', '#deletePost', function() {
      $.ajax({
        url: '/api/deletePosts',
        type: 'POST',
        data: {pid: data[activeIdx]._id},
        success: function(res) {
          activeIdx = -1; 
          $('.modal').css('display', 'none');
          console.log(res)

        }
      })
      
    })
    // when we want to make a new post, show the modal
    $('#new-post').on('click', function () {
      $('.modal').css('display', 'block');
    })
  
    $('#close').on('click', function () {
      $('.modal').css('display', 'none');
    })

    $('#close_post').on('click', function () {
      activeIdx = -1; 
    })
    
    $('#submit-post').on('click', function () {
      // TODO: make a post request to /api/addpost with the qText as the 
      // postText attribute. On success, hide the modal
      var pTitle = $('#postTitle').val();
      var pText = $('#postText').val();
      $.ajax({
        url: '/api/addPosts',
        data: { postTitle: pTitle, postText: pText },
        type: 'POST',
        success: function(res) {
          console.log(res);
        }
      })
    })


    $('#addTodo').on('click', function() {
      var todoText = $('#todo-text').val();
      $.ajax({
        url:'/api/addTodos',
        data: {todoText: todoText},
        type:'POST',
        success: function(res) {
          console.log(res);
        }
      })
    })
})
