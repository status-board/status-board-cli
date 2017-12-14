widget = {
  onData: function (el, data) {
    if (data.title) {
      $('h2', el).text(data.title);
    }

    $('.content', el).html(
        "<img class='featured-image' src='" + data.imageSrc + "'/>"
    );

  }
};