widget = {

  onData: function (el, data) {

    if (data.title) {
      $('h2', el).text(data.title);
    }

    // Display sparkline of month-by-month new sales
    $('.left', el).append($('.graph', el).html(data.linegraph.join(",")));
    $('.graph', el).peity("line", {
      width: 300,
      height: 200,
      strokeColour: '#1796d1',
      strokeWidth: 6
    });

    // Work out percentage (Current month/previous month *100) -100 to get the percent difference to previous month.
    var percent = (((data.linegraph[data.linegraph.length - 1] / data.linegraph[data.linegraph.length - 2]) * 100) - 100).toFixed(1);

    // Display percent difference
    var salesText = " SOLD";
    if (data.dataDisplay == "soldThisMonth") {
      salesText = " SOLD THIS MONTH";
    } else if (data.dataDisplay == "soldToday") {
      salesText = " SOLD TODAY";
    }

    $('.right', el).empty();
    if (percent <= 0) {
      $('.right', el).append("<span class=\"trend down\">" + percent + "% </span>");
    } else {
      $('.right', el).append("<span class=\"trend up\">" + percent + "% </span>");
    }
    $('.right', el).append("<div>" + data.linegraph[data.linegraph.length - 1] + salesText + "</div>");
  }
};


