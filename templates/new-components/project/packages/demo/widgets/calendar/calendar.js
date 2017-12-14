widget = {

  onData: function (el, data) {
    if (data.title) {
      $('h2', el).text(data.title);
    }

    var $content = $('.content', el);
    $content.empty();

    if (!data.events || !data.events.length) {
      $content.append($("<div>").html("No events found."));
    } else {

      this.log(data.events.length + ' calendar events found!');

      data.events.forEach(function (event) {
        var eventDiv = $("<div/>").addClass('leave-event');
        $(eventDiv).append($("<div/>").addClass('leave-dates').append(event.startDate + " - " + event.endDate));
        $(eventDiv).append($("<div/>").addClass('leave-summary').append(event.summary));

        $content.append(eventDiv);
      });
    }
  }
};