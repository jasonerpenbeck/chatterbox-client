var app = {};

app.defaultRoom = 'chatterbox';
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.init = function () {};
app.send = function () {
  var message = {};
  message.roomname = this.defaultRoom;
  message.text = $('#messageBox').val();
  message.username = this.username || 'Anonymous';

  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.fetch();
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

      // Empty out everything in the content div before reloading fetched messages
      $('#content').empty();

      var results = data.results;
      var contentList = $('#content').append('<ul>');

      for(var i =0; i < results.length; i++) {
        console.log(results[i].roomname);

        var message = $('<li>');
        message.text(results[i].text);
        contentList.append(message);
      }

    },
    error: function(xhr, status, errorThrown) {
      console.log('Sorry, but we could not fetch any messages.');
    }

  });

};
