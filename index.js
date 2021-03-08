const { expect } = require('chai');
const walkSync = require('walk-sync');
const { extname } = require('path');
const { inspect } = require('util');

const {
  findMarkdownLinks,
  getBadRelativeUrlsForFile,
  getBadLineBreaks,
  getBadImageUrls,
} = require('./helpers');

function printBadLinks(badLinks) {
  return inspect(badLinks, { depth: null });
}


module.exports = () => {
  const paths = walkSync('guides')
    .filter(filePath => extname(filePath) === '.md')
    .map(filePath => `guides/${filePath}`);

  /**
   * Autogenerate some mocha tests
   */
  paths.forEach((filepath) => {
    it(`processing ${filepath}`, function () {
      const links = findMarkdownLinks(filepath);
      const badLinks = getBadRelativeUrlsForFile({
        filepath,
        links,
      });

      expect(badLinks, printBadLinks(badLinks)).to.be.empty;

      const badLineBreaks = getBadLineBreaks(filepath);
      expect(badLineBreaks, printBadLinks(badLineBreaks)).to.be.empty;

      const badImageLinks = getBadImageUrls({
        filepath,
        links,
      });

      expect(badImageLinks, printBadLinks(badImageLinks)).to.be.empty;
    });
  });
};
