// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var request = require('request');
var cheerio = require('cheerio');

pools = {
  'Jimmy Lin' : 'http://scholar.google.com/citations?user=0EWw1z8AAAAJ&hl=en',
}

for (pool in pools) {
  var url = pools[pool];
  console.log(url);

  request(url, (function(pool) { return function(err, resp, body) {
    $ = cheerio.load(body);
    console.log(pool);
    //console.log(body);
    $('#stats tr').each(function(day) {
      $(this).find('td').each(function() {
        event = $(this).text()
        console.log(event);
      });
    });
  }})(pool));
}

