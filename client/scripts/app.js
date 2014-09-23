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

  $('#addRoom').on('click',function(e) {
      e.preventDefault();
      var $roomNameValue = $('#addRoomName').val();
      app.addRoom($roomNameValue);
  });

  $('#roomSelect').on('change',function(e) {
      e.preventDefault();
      // var selectedValue = $('#roomSelect').val();
      var roomValue = $('select option:selected').text();
      app.fetch(roomValue);
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

app.fetch = function (room) {
  var parameters = JSON.stringify({'roomname': room});

  $.ajax({
    url: this.server + '?order=-createdAt&limit=50', // we fetch the most recent 50 messages for now
    data: 'where='+parameters,
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

  $user.addClass('username');

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
