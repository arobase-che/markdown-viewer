'use-strict';

const fs = require('fs');
const dirTree = require('directory-tree');
const express = require('express');

const hmd = require('./tohtml');

const path = 'md';
const app = express();

process.on('uncaughtException', err => {
  console.error(`[${new Date()}] > Error - ${err}`);
});

const report = require('vfile-reporter');

const useLandScript = '';
const rawButton = '<button class="raw_button" ><div><div>Raw</div></div></button></form>';



app.use(express.static('public'));

app.get(`/${path}/*`, (req, res) => {
  const url = decodeURI(req._parsedUrl.pathname);
  const query = req.query;

  console.log(`[${new Date()}] > ${200} - ${url}`);
  if (query && query.raw === 'true') {
    res.sendFile(url, {
      root: '.',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
      },
    }, err => {
      if (err) {
        console.log('Error : ', err);
      } else {
        console.log('Sent : ', url);
      }
    }
    );
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
      .use(lineInput)
      .use(textInput)
      .use(html, {allowDangerousHTML: true})
      .use(raw)
        .parse(data)
      console.log(inspect(a));
      */

    hmd(data, (err, file) => {
      res.send(`${String(file) + useLandScript
      }<a href="${url}?raw=true" class="no-style">${rawButton}</a>`);
      console.error(report(err || file));
    });
  });
});

app.get('/data', (req, res) => {
  console.log(`[${new Date()}] > ${200} - ${req.url}`);
  res.send(dirTree(path, {extensions: /\.md/}));
});

app.get('/img/*', (req, res) => {
  console.log(`[${new Date()}] > ${200} - ${req.url}`);
  if (path === '/img/ic_info_black_48px.svg' ||
        path === '/imr/ic_error_black_48px.svg' ||
        path === '/imr/ic_good_black_48px.svg' ||
        path === '/imr/ic_bad_black_48px.svg' ||
        path === '/imr/ic_comment_black_48px.svg' ||
        path === '/imr/ic_help_black_48px.svg') {
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
  console.log(`[${new Date()}] > ${200} - ${req.url}`);
  fs.readFile('public/index.html', 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.send(data);
  });
});
app.get('/edit', (req, res) => {
  console.log(`[${new Date()}] > ${200} - ${req.url}`);
  fs.readFile('public/edit.html', 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.send(data);
  });
});
app.get('*', (req, res) => {
  console.error(`[${new Date()}] > ${404} - ${req.url}`);
  fs.readFile('public/404.md', 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    fs.readFile('public/css/style.css', 'utf8', (err, style) => {
      if (err) {
        let html = '<html>';
        html += '<body>';
        html += '<h1>500 - Internal Server Error</h1>';
        html += `Debug : ${err}`;
        html += '</body>';
        html += '</html>';
        res.status(500).send(html);
        return;
      }
      hmd(data, (err, file) => {
        if (err) {
          let html = '<html>';
          html += '<body>';
          html += '<h1>500 - Internal Server Error</h1>';
          html += 'Debug : 404 page can\'t be converted to HTML<br>';
          html += `Debug : ${err}`;
          html += '</body>';
          html += '</html>';
          res.status(404).send(html);
        }
        let html = '<html>';
        html += '<head>';
        html += `<style>${style}</style>`;
        html += '</head>';
        html += '<body class=\'markdown-preview\'>';
        html += String(file);
        html += '</body>';
        html += '</html>';
        res.status(404).send(html);
      });
    });
  });
});

const server = app.listen(8090, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`[${new Date()}] > App listening at http://%s:%s`, host, port);
});
