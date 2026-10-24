const fs = require('fs');

const escapeHtml = (str) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function updateQuote() {
  try {
    const quotes = require('./quotes.json');

    // One quote per day (UTC), so re-running the workflow the same day keeps the same quote
    const dayNumber = Math.floor(Date.now() / 86400000);
    const { quote, author } = quotes[dayNumber % quotes.length];

    const cardDesign = `<!--STARTS_HERE_QUOTE_CARD-->
<p align="center"><sub><code>QUOTE OF THE DAY</code></sub></p>
<p align="center"><i>&ldquo;${escapeHtml(quote)}&rdquo;</i></p>
<p align="center"><sub>&mdash; <b>${escapeHtml(author)}</b></sub></p>
<!--ENDS_HERE_QUOTE_CARD-->`;

    const readmePath = './README.md';
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    const pattern = /<!--STARTS_HERE_QUOTE_CARD-->[\s\S]*?<!--ENDS_HERE_QUOTE_CARD-->/;

    if (!pattern.test(readmeContent)) {
      throw new Error('Quote markers not found in README.md');
    }

    fs.writeFileSync(readmePath, readmeContent.replace(pattern, () => cardDesign));
    console.log(`Updated quote: ${quote} - ${author}`);
  } catch (error) {
    console.error('Error updating quote:', error);
    process.exit(1);
  }
}

updateQuote();
