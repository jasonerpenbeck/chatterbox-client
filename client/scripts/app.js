var app = {};
app.defaultRoom = 'chatterbox';
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function () {

  $('#refreshButton').on('click', function(e) {
    e.preventDefault;
    app.fetch();
  });

  $('#sendButton').on('click', function(e) {
    e.preventDefault;
    var message = {};
    message.username = app.username || 'Anonymous';
    message.text = $('#messageBox').val();
    message.roomname = app.defaultRoom;

    app.send(message);
    app.fetch();
  });

  $('#main').on('click','a.username',function(e) {
    e.preventDefault;
    // add username as friend
    console.log('Click Registered');
    app.addFriend();
  });

};

app.send = function (message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      return data;
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function () {
  $.ajax({
    url: this.server + '?order=-createdAt',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      app.clearMessages();
      var results = data.results;
      for(var i =0; i < results.length; i++) {
        app.addMessage(results[i]);
      }
    },
    error: function(xhr, status, errorThrown) {
      console.log('Sorry, but we could not fetch any messages.');
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
    var anchor = '<a href = "' + encodeURI(message.username) + '" class="username">'+ encodeURI(message.username)+'</a>';
    console.log(anchor);
    var div = $('div').html(anchor + message.text);
  $('#chats').append(div);
};

app.addRoom = function(room) {
  $('#roomSelect').append('<option value='+room+'>'+room+'</option>');
};

app.addFriend = function() {

};

app.handleSubmit = function() {
};
