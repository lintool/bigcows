Scholar Scraper
===============

I wrote this simple utility to scrape citation statistics of researcher profiles on [Google Scholar](http://scholar.google.com/), using it as an opportunity to learn [node.js](http://nodejs.org/). I began with a list of information retrieval researchers, but have since expanded to include a separate list of researchers in human-computer interaction. The results are [here](http://lintool.github.io/scholar-scraper/).

**Editorial note**: This list contains only researchers who have a Google Scholar profile; names were identified by snowball sampling and various other *ad hoc* techniques. If you wish to see a name added, please email me or send a pull request. I will endeavor to periodically run the crawl to gather updated statistics. Of course, scholarly achievement is only partially measured by citation counts, which are known to be flawed in many ways. Evaluations of scholars should include comprehensive examination of their research contributions.

Rerunning the Scraper
---------------------

Assuming you have [node.js](http://nodejs.org/) installed, rerun the scraper as follows:

```
$ npm install request cheerio async
$ node scrape.js ./people-ir.json > stats-ir.js
$ node scrape.js ./people-db.json > stats-db.js
$ node scrape.js ./people-nlp.json > stats-nlp.js
$ node scrape.js ./people-hci.json > stats-hci.js
$ node scrape.js ./people-stratosphere.json > stats-stratosphere.js
```

To scrape the images:

```
$ node download-images.js ./stats-ir.js
$ node download-images.js ./stats-db.js
$ node download-images.js ./stats-nlp.js
$ node download-images.js ./stats-hci.js
$ node download-images.js ./stats-stratosphere.js
```

Then open up `index.html` and it should display the new statistics.


