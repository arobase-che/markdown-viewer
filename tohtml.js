'use-strict';

/* TODO : Send the result of guide :
  const guide = require('remark-preset-lint-markdown-style-guide');
*/

const html = require('remark-rehype');
const kbd = require('remark-kbd');
const math = require('remark-math');
const highlight = require('remark-highlight.js');
const sb = require('remark-special-box');
const multiChoice = require('remark-multiple-choice');
const lineInput = require('remark-line-input');
const select = require('remark-select');
const textInput = require('remark-text-input');
const raw = require('rehype-raw');
const rehypeKatex = require('rehype-katex');
const rehypeStringify = require('rehype-stringify');
const unified = require('unified');
const remark = require('remark-parse');
const customBlocks = require('remark-custom-blocks');

function toHTML(data, fnc) {
  unified()
    .use(remark)
    .use(lineInput)
    .use(textInput)
    .use(select)
    .use(multiChoice)
    .use(math)
    .use(kbd)
    .use(sb)
    .use(customBlocks, {
      information: {
        classes: 'special-box information',
        title: 'optional',
      },
      comment: {
        classes: 'special-box comment',
        title: 'optional',
      },
      attention: {
        classes: 'special-box attention',
        title: 'optional',
      },
      question: {
        classes: 'special-box question',
        title: 'optional',
      },
      good: {
        classes: 'special-box good',
      },
      secret: {
        classes: 'special-box secret',
        title: 'optional',
      },
      bad: {
        classes: 'special-box bad',
      }})
    .use(highlight)
    .use(html, {allowDangerousHTML: true})
    .use(rehypeKatex)
    .use(raw)
    .use(rehypeStringify)

    .process(data, fnc);
}

module.exports = toHTML;
