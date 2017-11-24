'use-strict';

const dirTree = require('directory-tree');
const express = require('express');
const fs = require('fs');


const app = express();
const path = 'md';

process.on('uncaughtException', function(err) {
    console.error("[" + new Date() + "] > " + "Error - " + err);
});


const report = require('vfile-reporter');

const remark = require('remark');
const guide = require('remark-preset-lint-markdown-style-guide');
const html = require('remark-html');
const kbd = require('remark-kbd');
const math = require('remark-math');
const mermaid = require('remark-mermaid-simple');
const highlight = require('remark-highlight.js');


const useLandScript = " <script> mermaid.contentLoaded(); </script>"

app.use(express.static('public'));

app.get('/' + path + '/*', function(req, res) {
    var url = decodeURI(req.url);
    console.log("[" + new Date() + "] > " + "200 - " + url);
    fs.readFile(url.substr(1), 'utf8', function(err, data) {
        if (err)
            return console.log(err);
    remark()
      .use(guide)
      .use(kbd)
      .use(math)
      .use(mermaid)
      .use(highlight)
      .use(html)
      .process(data, function (err, file) {
        //    console.log(head + String(file) + foot);
        res.send(String(file) + useLandScript);
        console.error(report(err || file));
      });
    });
});

app.get('/data', function(req, res) {
    console.log("[" + new Date() + "] > " + "200 - " + req.url);
    res.send(dirTree(path, {extensions:/\.md/}));
});

app.get('/img/*', function (req, res) {
    console.log("[" + new Date() + "] > " + "200 - " + req.url);
    var img = fs.readFileSync(req.url.replace('/img', path));
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
});

app.get('/', function(req, res) {
    console.log("[" + new Date() + "] > " + "200 - " + req.url);
    fs.readFile('public/index.html', 'utf8', function(err, data) {
        if (err)
            return console.log(err);
        res.send(data);
    });
});

app.get('*', function(req, res) {
    console.error("[" + new Date() + "] > " + "404 - " + req.url);
    fs.readFile('public/404.md', 'utf8', function(err, data) {
        if (err)
            return console.log(err);
        fs.readFile('public/css/style.css', 'utf8', function(err, style) {
            var html = '<html>';
            html += '<head>';
            html += '<style>' + style + '</style>';
            html += '</head>';
            html += '<body class=\'markdown-preview\' data-use-github-style>';
            html += converter.makeHtml(data);
            html += '</body>';
            html += '</html>';
            res.status(404).send(html);
        });
    });
});

var server = app.listen(8090, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("[" + new Date() + "] > " + "App listening at http://%s:%s", host, port);
});
