// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var people = require(process.argv[2]);

var scrapeEntry = function(person, doneCallback) {
  var url = people[person];
  var data = {};

  request(url, function(err, resp, body) {
    $ = cheerio.load(body);

    try {
      var affiliation = $('.gsc_prf_il', '#gsc_prf_i')[0].children[0].data;

      var rawStats = $('#gsc_rsb_st');
      var stats = {
        'citations' : [ rawStats[0].children[1].children[1].children[0].data,
                        rawStats[0].children[1].children[2].children[0].data],
        'hindex' : [ rawStats[0].children[2].children[1].children[0].data,
                     rawStats[0].children[2].children[2].children[0].data],
        'i10index' : [ rawStats[0].children[3].children[1].children[0].data,
                       rawStats[0].children[3].children[2].children[0].data]
      };

      data = {
        'name' : person,
        'affiliation' : affiliation,
        'url': url,
        'stats' : stats
      };

    } catch (ex) {
      throw new Error(person);
    }

    doneCallback(null, data);
  });
};

var scrapeYear = function(entry, doneCallback) {
  var histUrl = entry['url'] + "&view_op=citations_histogram";

  request(histUrl, function(err, resp, body) {
    $ = cheerio.load(body);

    try {
      year = $('.gsc_g_t')[0].children[0].data;
    } catch(ex) {
      throw new Error(entry['url']);
    }

    entry['year'] = year;

    doneCallback(null, entry);
  });
};

// http://javascriptplayground.com/blog/2013/06/think-async/
async.mapSeries(Object.keys(people), scrapeEntry, function (err, results) {
  async.mapSeries(results, scrapeYear, function (err, results) {
    var date = new Date();
    console.log('var date = "' + date + '"');
    console.log('var data = ' + JSON.stringify(results, null, 2) + ';');
  });
});
