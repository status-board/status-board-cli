function getSalesData(days) {
  // generates some random numbers
  var results = [];
  for (var i = 0; i < days; i++) {
    results[i] = 100 + (-30 + Math.floor(Math.random() * 60));
  }
  return results;
}

module.exports = {
  onRun: function (config, dependencies, jobCallback) {
    //To generate a line graph, simply create an array of numbers and send it through to the linegraph widget
    var salesData = getSalesData(15);
    jobCallback(null, {linegraph: salesData, title: config.widgetTitle, dataDisplay: "soldThisMonth"});
  }
};