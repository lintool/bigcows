// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var people = require(process.argv[2]);

var scrapeEntry = function(person, doneCallback) {
  var url = people[person];
  var data = {};

  // properly set the encoding, or we'll mangle accented characters:
  // http://stackoverflow.com/questions/8332500/module-request-how-to-properly-retrieve-accented-characters-%EF%BF%BD-%EF%BF%BD-%EF%BF%BD
  request({ encoding: 'binary', method: "GET", uri: url}, function(err, resp, body) {
    var $ = cheerio.load(body);

    try {
      // We're output to stdout, so log to stderr
      console.error("Scraping " + person + "...");

      //console.error($('<img id="gsc_prf_pup-img">'));
      //console.error($('#gsc_prf_i')[0].children[1]);
      //console.error($('#gsc_prf_i')[0].children[1].children[0].text());
      //console.error($('.gsc_prf_il', '#gsc_prf_i').first().text());

      var photo = $('#gsc_prf_pup-img')[0].attribs.src;
      var affiliation = $('.gsc_prf_il', '#gsc_prf_i').first().text();

      var keywords_root = $('#gsc_prf_int')[0].children;
      //console.error(keywords_root);
      var keywords = [];

      for (var i=0; i<keywords_root.length; i++) {
        keywords.push(keywords_root[i].children[0].data);
      //  keywords.push(keywords_root[i].children[0].data);
      }

      var rawStats = $('#gsc_rsb_st');
      //console.error(rawStats);
/*
      console.error(rawStats[0].children[1].children[0].children[1].children[0].data);
      console.error(rawStats[0].children[1].children[0].children[2].children[0].data);

      console.error(rawStats[0].children[1].children[1].children[1].children[0].data);
      console.error(rawStats[0].children[1].children[1].children[2].children[0].data);

      console.error(rawStats[0].children[1].children[2].children[1].children[0].data);
      console.error(rawStats[0].children[1].children[2].children[2].children[0].data);
*/
      //console.error('0.' + rawStats[0].data);
      //console.error('1.' + rawStats[0].children[1].data);

      var stats = {
        'citations' : [ rawStats[0].children[1].children[0].children[1].children[0].data,
                        rawStats[0].children[1].children[0].children[2].children[0].data ],
        'hindex'    : [ rawStats[0].children[1].children[1].children[1].children[0].data,
                        rawStats[0].children[1].children[1].children[2].children[0].data ],
        'i10index'  : [ rawStats[0].children[1].children[2].children[1].children[0].data,
                        rawStats[0].children[1].children[2].children[2].children[0].data ]
      };

//console.log(stats);

      var rawYear = $('.gsc_md_hist_b');
      console.error();
      //console.error(rawYear['_root'][0]);

      data = {
        'name' : person,
        'url': url,
        'photo' : 'http://scholar.google.com' + photo,
        'affiliation' : affiliation,
        'keywords' : keywords,
        'stats' : stats,
        'year' : rawYear[0].children[0].children[0].data
      };

    } catch (ex) {
      console.error(ex);
      throw new Error(person);
    }

    // Adding a timeout to regulate scraping speed.
    setTimeout(function() {
      doneCallback(null, data);
    }, 1000);
  });
};

// http://javascriptplayground.com/blog/2013/06/think-async/
async.mapSeries(Object.keys(people), scrapeEntry, function (err, results) {
  var date = new Date();
  console.log('var date = "' + date + '"');
  console.log('var data = ' + JSON.stringify(results, null, 2) + ';');
});
