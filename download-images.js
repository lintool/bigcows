// From http://stackoverflow.com/questions/12740659/downloading-images-with-node-js

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');

filedata = fs.readFileSync(process.argv[2], 'utf8');
eval(filedata);

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

/*
download('http://scholar.google.com/citations?view_op=view_photo&user=0EWw1z8AAAAJ&citpid=1', 'images/jimmy.png', function(){
  console.log('done');
});
*/

var scrapeImage = function(entry, doneCallback) {
  var url = entry.photo;
  if (url !=  'http://scholar.google.com/citations/images/avatar_scholar_128.png')
    url = url.replace(/^(http:\/\/scholar.google.com)/,"")
  var regex = /user=([^&]+)/;
  var match = regex.exec(entry.url);
  var user = match[1];

  download(url, 'images/' + user + '.png', function(){
    console.log('Downloading image for ' + entry.name + ': ' + url);

    // Adding a timeout to regulate scraping speed.
    setTimeout(function() {
      doneCallback(null, entry);
    }, 1000);
  });

};

async.mapSeries(data, scrapeImage, function (err, results) {
  console.log('Done!');
});
