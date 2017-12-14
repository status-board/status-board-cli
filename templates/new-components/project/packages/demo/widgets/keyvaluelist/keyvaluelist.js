widget = {

  onData: function (el, data) {
    if (data.title) {
      $('h2', el).text(data.title);
    }

    var $content = $('.content', el);
    $content.empty();

    if (data.issues.length) {
      data.issues.forEach(function (issue) {
        $content.append(
            "<div class='item-container'>" +
              "<div class='issue'>" + issue.issueType + "</div>" +
              "<div class='count'>" + issue.frequency + "</div>" +
            "</div>"
        );
      })
    }
  }
};