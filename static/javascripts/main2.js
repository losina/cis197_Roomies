$(document).ready(function () {
    
    var data = [];
    var activeIdx = -1; 

    // kick off getting the questions
    getRequests();
    // now do it  every 2.5 seconds
    setInterval(getRequests, 2500);
  
    function getRequests() {
      // TODO: make an ajax request to /api/getQuestions. on success
      //       set  the data variable equal to the response and render
      //       out the question previews (by callingrenderPreviews())
      //       Later on in the writeup, also render the active question 
      //       (to update it) with renderactive()
      $.ajax({
        url: '/api/getRequests',
        success: function (res) {
            if (data != null) {
                data = res; 
            }
          renderPreviews();
        }
      })
    }


    // makes a list  of questions which all have the question text and a data-qid attribute
    // that allows you to access their _id by doing $whateverjQueryObjectYouHave.data('qid')
    function renderPreviews() {
      $('#show-request').html(
          data.map((i) => i.groupName + ' by ' + i.friendName + '<button class ="acceptBtn" type="submit" id="accept" data-qid="' + i._id + '"> accept </button> <button class ="rejectBtn" type="submit" id="reject" data-qid="' + i._id + '"> Reject </button>').join('<br/>')
      )
    }

    $('#show-request').on('click', '#accept', function() {
        var _id = $(this).data('qid');
      data.forEach(function(post, index) {
        if (post._id === _id) {
          activeIdx = index
        } 
      })
        var requestEx = data[activeIdx]
        $.ajax({
            url:'/api/acceptRequests',
            type:'POST',
            data: {rid: requestEx._id, groupName: data[activeIdx].groupName},
            success: function (res) {
                console.log(res)
            }
        })
    })
    
    $('#show-request').on('click', '#reject', function() {
        var _id = $(this).data('qid');

        data.forEach(function(request, index) {
          if (request._id === _id) {
            activeIdx = index
          } 
        })
        var requestEx = data[activeIdx]
          $.ajax({
              url:'/api/rejectRequests',
              type:'POST',
              data: {rid: requestEx._id},
              success: function (res) {
                  console.log(res)
              }
          })
    })



})