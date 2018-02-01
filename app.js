'use-strict';

const fs = require('fs');
const dirTree = require('directory-tree');
const express = require('express');

const path = 'md';
const app = express();

process.on('uncaughtException', err => {
  console.error('[' + new Date() + '] > ' + 'Error - ' + err);
});

const report = require('vfile-reporter');

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

const inspect = require('unist-util-inspect');

const useLandScript = ' <script> mermaid.contentLoaded(); </script>';
const userSide_Button = '<button class="raw_button" ><div><div>Raw</div></div></button></form>';

function to_HTML(data, fnc) {
  unified()
      .use(remark)
      .use(lineInput)
      .use(textInput)
      .use(select)
      .use(multiChoice)
      .use(math)
      .use(kbd)
      .use(sb)
      .use(highlight)
      .use(html, {allowDangerousHTML: true})
      .use(rehypeKatex)
      .use(raw)
      .use(rehypeStringify)

      .process(data, fnc);
}

app.use(express.static('public'));

app.get('/' + path + '/*', (req, res) => {
  const url = decodeURI(req._parsedUrl.pathname);
  const query = req.query;

  console.log('[' + new Date() + '] > ' + '200 - ' + url);
  if (query && query.raw == 'true') {
    res.sendFile(url, {root: '.',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true}}, err => {
          if (err) {
            next(err);
          } else {
            console.log('Sent : ', url);
          }
        });
    return;
  }
  fs.readFile(url.substr(1), 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

//    Remark()
      /*  Debbug comment
      const a = unified()
      .use(remark)
      .use(mermaid)
      .use(lineInput)
      .use(textInput)
      .use(html, {allowDangerousHTML: true})
      .use(raw)
        .parse(data)
      console.log(inspect(a));
      */

    to_HTML(data, (err, file) => {
      res.send(String(file) + useLandScript +
          '<a href="' + url + '?raw=true" class="no-style">' + userSide_Button + '</a>');
      console.error(report(err || file));
    });
  });
});

app.get('/data', (req, res) => {
  console.log('[' + new Date() + '] > ' + '200 - ' + req.url);
  res.send(dirTree(path, {extensions: /\.md/}));
});

app.get('/img/*', (req, res) => {
  console.log('[' + new Date() + '] > ' + '200 - ' + req.url);
  if (path == '/img/ic_info_black_48px.svg' ||
        path == '/imr/ic_error_black_48px.svg' ||
        path == '/imr/ic_good_black_48px.svg' ||
        path == '/imr/ic_bad_black_48px.svg' ||
        path == '/imr/ic_comment_black_48px.svg' ||
        path == '/imr/ic_help_black_48px.svg') {
    const img = fs.readFileSync(path);
    res.writeHead(200, {'Content-Type': 'image/svg'});
    res.end(img, 'binary');
  } else {
    const img = fs.readFileSync(req.url.replace('/img', path));
    res.writeHead(200, {'Content-Type': 'image/gif'});
    res.end(img, 'binary');
  }
});

app.get('/', (req, res) => {
  console.log('[' + new Date() + '] > ' + '200 - ' + req.url);
  fs.readFile('public/index.html', 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.send(data);
  });
});

app.get('*', (req, res) => {
  console.error('[' + new Date() + '] > ' + '404 - ' + req.url);
  fs.readFile('public/404.md', 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    fs.readFile('public/css/style.css', 'utf8', (err, style) => {
      to_HTML(data, (err, file) => {
        let html = '<html>';
        html += '<head>';
        html += '<style>' + style + '</style>';
        html += '</head>';
        html += '<body class=\'markdown-preview\' data-use-github-style>';
        html += String(file);
        html += '</body>';
        html += '</html>';
        res.status(404).send(html);
      });
    });
  });
});

var server = app.listen(8090, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('[' + new Date() + '] > ' + 'App listening at http://%s:%s', host, port);
});
