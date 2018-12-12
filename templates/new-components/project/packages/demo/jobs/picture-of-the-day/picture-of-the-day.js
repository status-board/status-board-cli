var $ = require('cheerio');

module.exports = {
  onRun: function (config, dependencies, jobCallback) {
    dependencies.easyRequest.HTML(config.url, function (err, body) {
      if (err) {
        var errMsg = err || "ERROR: Couldn't access the web page at " + config.url;
        jobCallback(errMsg);
      } else {
        var result = $('.primary_photo img', body).attr('src');
        jobCallback(null, {imageSrc: result, title: config.widgetTitle});
      }
    });
  }
};
