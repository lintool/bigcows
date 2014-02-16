// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var request = require('request');
var cheerio = require('cheerio');

people = {
  'Jimmy Lin' : 'http://scholar.google.com/citations?user=0EWw1z8AAAAJ&hl=en',
}

var data = [];

for (person in people) {
  var url = people[person];

  request(url, (function(person) { return function(err, resp, body) {
    $ = cheerio.load(body);
    console.log(person);

    var raw = $('#stats tr');
    var stats = {
      'citations' : [raw[1].children[1].children[0].data, raw[1].children[2].children[0].data],
      'hindex' : [raw[2].children[1].children[0].data, raw[2].children[2].children[0].data],
      'i10index' : [raw[3].children[1].children[0].data, raw[3].children[2].children[0].data]
    };

    console.log(stats);

    data.push({ 'name' : person, 'stats' : stats});
  }})(person));
}
