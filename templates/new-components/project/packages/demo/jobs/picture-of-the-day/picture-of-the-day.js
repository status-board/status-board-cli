module.exports = {
  onRun: function (config, dependencies, jobCallback) {
    dependencies.easyRequest.JSON(config.url, function (err, jsonBody, response) {
      if (err) {
        var errMsg = err || "ERROR: Couldn't access the web page at " + config.url;
        jobCallback(errMsg);
      } else {
        var result = jsonBody.items[0];
        jobCallback(null, { imageSrc: result.url, title: config.widgetTitle });
      }
    });
  }
};
