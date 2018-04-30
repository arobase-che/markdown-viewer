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
const iframes = require('remark-iframes');

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
    .use(iframes, {
      // this key corresponds to the hostname: !(http://hostname/foo)
      // the config associated to this hostname will apply to any iframe
      // with a matching hostname
      'www.youtube.com': {
        tag: 'IFRAME',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          ['watch?v=', 'embed/'],
          ['http://', 'https://'],
        ],
        thumbnail: {
          format: 'http://img.youtube.com/vi/{id}/0.jpg',
          id: '.+/(.+)$'
        },
        removeAfter: '&'
      }
    })
    .use(html, {allowDangerousHTML: true})
    .use(rehypeKatex)
    .use(raw)
    .use(rehypeStringify)

    .process(data, fnc);
}

module.exports = toHTML;
