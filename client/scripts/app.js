var app = {};
app.defaultRoom = 'HR18_19';
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function () {

  $('#refreshButton').on('click',function(e) {
      e.preventDefault();
      app.fetch();
  });

  $('#main').on('click','a.username',function(e) {
    e.preventDefault();
    app.addFriend();
  });

  $('input.submit').on('click',function(e) {
    e.preventDefault();
    app.handleSubmit();
  });

  // Retrieve most recent messages every 30 seconds
  app.fetch();
  setInterval(function() {
    app.clearMessages();
    app.fetch();
  }, 30000);
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
    url: this.server + '?order=-createdAt&limit=50', // we fetch the most recent 50 messages for now
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
  // console.log(message);
  var $chats = $('#chats');
  var $message = $('<div/>');
  var $user = $('<a/>', {
    href: '#',
    html: _.escape(message.username)
  });

  $message.append($user)
    .append(' (' + $.timeago(message.createdAt) + ') ' + _.escape(message.text));

  $chats.append($message);
};

app.addRoom = function(room) {


  var $option = $('<option>' + room + '</option>');
  $option.attr('value',room);
  $('#roomSelect').append($option);
};

app.addFriend = function() {
  // Todo: implement addFriend method
};

app.handleSubmit = function() {
    var message = {};
    message.username = app.username || 'Anonymous';
    message.text = $('#message').val();
    message.roomname = app.defaultRoom;

    app.send(message);
    app.fetch();
};
