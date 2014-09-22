// YOUR CODE HERE:


var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';
app.init = function () {};
app.send = function () {
  return true;
};


app.fetch = function () {
  $.ajax({
    url: this.server,
    type: 'GET',
    dataType: 'json',
    success: function(data) {

      var results = data.results;
      var contentList = $('#content').append('<ul>');
      console.log(results.length);

      for(var i =0; i < results.length; i++) {
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
