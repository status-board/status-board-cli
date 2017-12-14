var ical = require('ical');

module.exports = {

  onInit: function(config, dependencies) {
    dependencies.logger.info('Google calendar job started!'); // I am a log line!
  },

  onRun: function (config, dependencies, jobCallback) {
    var _ = dependencies.underscore;
    var maxEntries = config.maxEntries || 10;

    var formatDate = function (date) {
      var d = date.getDate();
      var m = date.getMonth() + 1;
      return '' + (m <= 9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d);
    };

    ical.fromURL(config.calendarUrl, {}, function (err, data) {

      if (err) {
        return jobCallback(err);
      }

      var events = _.sortBy(data, function (event) {
        return event.start;
      });
      events = _.filter(events, function (event) {
        return event.end >= new Date();
      });

      var result = [];
      _.first(events, maxEntries).forEach(function (event) {
          result.push({startDate: formatDate(event.start), endDate: formatDate(event.end), summary: event.summary});
      });

      jobCallback(null, {events: result, title: config.widgetTitle});
    });
  }
};