// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var people = require(process.argv[2]);

var scrape = function(person, doneCallback) {
  var url = people[person][1];
  var year = people[person][0];
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
        'year': year,
        'stats' : stats
      };

    } catch (ex) {
      throw new Error(person);
    }

    doneCallback(null, data);
  });
};

// http://javascriptplayground.com/blog/2013/06/think-async/
async.mapSeries(Object.keys(people), scrape, function (err, results) {
  var date = new Date();
  console.log('var date = "' + date + '"');
  console.log('var data = ' + JSON.stringify(results, null, 2) + ';');
});
