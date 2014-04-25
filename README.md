Scholar Scraper
===============

I wrote this simple utility to scrape citation statistics of various IR researchers from from [Google Scholar](http://scholar.google.com/), using it as an opportunity to learn [node.js](http://nodejs.org/). 

The results are [here](http://lintool.github.io/scholar-scraper/). Sincerest apologies if I've missed your profile, but that's what pull requests are for!

Rerunning the Scraper
---------------------

Assuming you have [node.js](http://nodejs.org/) installed, rerun the scraper as follows:

```
$ npm install request cheerio async
$ node scrape.js ./people-ir.json > stats-ir.js
``` 

Then open up `index.html` and it should display the new statistics.
