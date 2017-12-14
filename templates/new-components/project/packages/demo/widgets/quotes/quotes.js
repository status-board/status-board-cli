widget = {

  onData: function (el, data) {
    if (data.title) {
      $('h2', el).text(data.title);
    }

    var $content = $('.content', el);
    $content.empty();

    if (data.quotes.length > 0) {
      data.quotes.forEach(function (quote) {
        $content.append(
            "<blockquote>" + quote.quote + "<cite>" + quote.author + "</cite></blockquote>"
        );
      });

    } else {
      $content.append(
          "<blockquote>NO QUOTES FOUND<blockquote>"
      );
    }
  }
};