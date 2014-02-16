// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var people = {
  'James Allan': 'http://scholar.google.com/citations?user=-bLGeg0AAAAJ&hl=en',
  'Eugene Agichtein': 'http://scholar.google.com/citations?user=3BX3vWcAAAAJ&hl=en',
  'Javed Aslam': 'http://scholar.google.com/citations?user=qSuuFsYAAAAJ&hl=en',
  'Leif Azzopardi': 'http://scholar.google.com/citations?user=8V5fIbkAAAAJ&hl=en',
  'Ricardo Baeza-Yates': 'http://scholar.google.com/citations?user=v9xULZwAAAAJ&hl=en',
  'Krisztian Balog': 'http://scholar.google.com/citations?user=1z918TYAAAAJ&hl=en',
  'Paul N. Bennett': 'http://scholar.google.com/citations?user=AIncPrIAAAAJ&hl=en',
  'Andrei Broder': 'http://scholar.google.com/citations?user=7b858c0AAAAJ&hl=en',
  'Peter Bruza': 'http://scholar.google.com/citations?user=N8QpuP8AAAAJ&hl=en',
  'David Carmel': 'http://scholar.google.com/citations?user=LI8JbiIAAAAJ&hl=en',
  'Jamie Callan': 'http://scholar.google.com/citations?user=Un5KXJ4AAAAJ&hl=en',
  'Berkant Barla Cambazoglu': 'http://scholar.google.com/citations?user=iEChWJsAAAAJ&hl=en',
  'Ben Carterette': 'http://scholar.google.com/citations?user=2Y4R04EAAAAJ&hl=en',
  'Charles L. A. Clarke': 'http://scholar.google.com/citations?user=TkVleDIAAAAJ&hl=en',
  'Kevyn Collins-Thompson': 'http://scholar.google.com/citations?user=q__pgY9AkUQJ&hl=en',
  'Nick Craswell': 'http://scholar.google.com/citations?user=NXNZbEsAAAAJ&hl=en',
  'W. Bruce Croft': 'http://scholar.google.com/citations?user=ArV74ZMAAAAJ&hl=en',
  'Brian D. Davison': 'http://scholar.google.com/citations?user=wk3PBXn5pgoJ&hl=en',
  'Fernando Diaz': 'http://scholar.google.com/citations?user=212SLn0AAAAJ&hl=en',
  'Susan Dumais': 'http://scholar.google.com/citations?user=x8dED5cAAAAJ&hl=en',
  'Norbert Fuhr': 'http://scholar.google.com/citations?user=p53Ht7UAAAAJ&hl=en',
  'Claudia Hauff': 'http://scholar.google.com/citations?user=gMUKVkkAAAAJ&hl=en',
  'David Hawking': 'http://scholar.google.com/citations?user=bqeClI0AAAAJ&hl=en',
  'Marti A. Hearst': 'http://scholar.google.com/citations?user=Yy6xbCYAAAAJ&hl=en',
  'Djoerd Hiemstra': 'http://scholar.google.com/citations?user=SN0MvYwAAAAJ&hl=en',
  'William Hersh': 'http://scholar.google.com/citations?user=xFn_7nUAAAAJ&hl=en',
  'Kal Jarvelin': 'http://scholar.google.com/citations?user=apzoDeEAAAAJ&hl=en',
  'Joemon M Jose': 'http://scholar.google.com/citations?user=ERvFJGkAAAAJ&hl=en',
  'Jaap Kamps': 'http://scholar.google.com/citations?user=bWlQ2uEAAAAJ&hl=en',
  'Diane Kelly': 'http://scholar.google.com/citations?user=sZE8jQIAAAAJ&hl=en',
  'Mounia Lalmas': 'http://scholar.google.com/citations?user=wAr9G5sAAAAJ&hl=en',
  'Birger Larsen': 'http://scholar.google.com/citations?user=fIL_MF0AAAAJ&hl=en',
  'Victor Lavrenko': 'http://scholar.google.com/citations?user=FfjKDgwAAAAJ&hl=ne',
  'Jimmy Lin' : 'http://scholar.google.com/citations?user=0EWw1z8AAAAJ&hl=en',
  'Matt Lease': 'http://scholar.google.com/citations?user=qgmiQ5IAAAAJ&hl=en',
  'Yoelle Maarek': 'http://scholar.google.com/citations?user=EeTd0CYAAAAJ&hl=en',
  'Craig Macdonald': 'http://scholar.google.com/citations?user=IBjMKHQAAAAJ&hl=en',
  'Bernardo Magnini': 'http://scholar.google.com/citations?user=jnQE-4gAAAAJ&hl=en',
  'Donald Metzler': 'http://scholar.google.com/citations?user=bmXpOd8AAAAJ&hl=en',
  'Alistair Moffat': 'http://scholar.google.com/citations?user=r3xSME0AAAAJ&hl=en',
  'Vanessa Murdock': 'http://scholar.google.com/citations?user=eZxAri4AAAAJ&hl=en',
  'Jian-Yun Nie': 'http://scholar.google.com/citations?user=W7uYg0UAAAAJ&hl=en',
  'Douglas W. Oard' : 'http://scholar.google.com/citations?user=3ctKkysAAAAJ&hl=en',
  'Iadh Ounis': 'http://scholar.google.com/citations?user=rKQMXOEAAAAJ&hl=en',
  'Berthier Ribeiro-Neto': 'http://scholar.google.com/citations?user=JMkfK0sAAAAJ&hl=en',
  'Maarten de Rijke': 'http://scholar.google.com/citations?user=AVDkgFIAAAAJ&hl=en',
  'Cornelis van Rijsbergen': 'http://scholar.google.com/citations?user=NnFpD_sAAAAJ&hl=en',
  'Mark Sanderson': 'http://scholar.google.com/citations?user=HmqvvQkAAAAJ&hl=en',
  'Fabrizio Sebastiani': 'http://scholar.google.com/citations?user=WZBcZV4AAAAJ&hl=en',
  'Falk Scholer': 'http://scholar.google.com/citations?user=qOLjlqsAAAAJ&hl=en',
  'Fabrizio Silvestri': 'http://scholar.google.com/citations?user=pi985dQAAAAJ&hl=en',
  'Alan F. Smeaton': 'http://scholar.google.com/citations?user=o7xnW2MAAAAJ&hl=en',
  'Mark D. Smucker': 'http://scholar.google.com/citations?user=BgiGGQQAAAAJ&hl=en',
  'Ian Soboroff': 'http://scholar.google.com/citations?user=TcFyZgcAAAAJ&hl=en',
  'Jaime Teevan': 'http://scholar.google.com/citations?user=F5Ik84MAAAAJ&hl=en',
  'Andrew Turpin': 'http://scholar.google.com/citations?user=lCZblDwAAAAJ&hl=en',
  'Howard Turtle': 'http://scholar.google.com/citations?user=kT1MD4wAAAAJ&hl=en',
  'Andrew Trotman': 'http://scholar.google.com/citations?user=uQ3ecLMAAAAJ&hl=en',
  'Arjen P. de Vries': 'http://scholar.google.com/citations?user=iH9TVHQAAAAJ&hl=en',
  'Ryen W. White': 'http://scholar.google.com/citations?user=U69fiZMAAAAJ&hl=en',
  'Ross Wilkinson': 'http://scholar.google.com/citations?user=XnG5SnEAAAAJ&hl=en',
  'Elad Yom-Tov': 'http://scholar.google.com/citations?user=s2YRp64AAAAJ&hl=en',
  'ChengXiang Zhai': 'http://scholar.google.com/citations?user=YU-baPIAAAAJ&hl=en',
  'Justin Zobel': 'http://scholar.google.com/citations?user=uEHvqE8AAAAJ&hl=en',
}

var process = function(person, doneCallback) {
  var url = people[person];
  var data = {};

  request(url, (function(person) { return function(err, resp, body) {
    $ = cheerio.load(body);

    var raw = $('#stats tr');
    var stats = {
      'citations' : [raw[1].children[1].children[0].data, raw[1].children[2].children[0].data],
      'hindex' : [raw[2].children[1].children[0].data, raw[2].children[2].children[0].data],
      'i10index' : [raw[3].children[1].children[0].data, raw[3].children[2].children[0].data]
    };

    data = { 'name' : person, 'stats' : stats};

    doneCallback(null, data);
  }})(person));
};

// http://javascriptplayground.com/blog/2013/06/think-async/
async.mapSeries(Object.keys(people), process, function (err, results) {
  console.log('var data = ' + JSON.stringify(results, null, 2) + ';');
});
