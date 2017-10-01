'use-strict';

const showdown  = require('showdown');
const dirTree = require('directory-tree');
const express = require('express');
const fs = require('fs');

const converter = new showdown.Converter();
const app = express();
const path = 'md';

const access = fs.createWriteStream('node.access.log', {flags: 'a'});
const error  = fs.createWriteStream('node.error.log',  {flags: 'a'});

process.stdout.write = access.write.bind(access);
process.stderr.write = error.write.bind(error);

converter.setOption('parseImgDimensions', 'true');
converter.setOption('literalMidWordUnderscores', 'true');
converter.setOption('literalMidWordAsterisks', 'true');
converter.setOption('strikethrough', 'true');
converter.setOption('tables', 'true');
converter.setOption('tasklists', 'true');

app.use(express.static('public'));

app.get('/' + path + '/*', function(req, res) {
    console.log("200 - " + req.url);
    fs.readFile(req.url.substr(1), 'utf8', function(err, data) {
        if (err)
            return console.log(err);
        res.send(converter.makeHtml(data));
    });
});

app.get('/data', function(req, res) {
    console.log("200 - " + req.url);
    res.send(dirTree(path, {extensions:/\.md/}));
});

app.get('/img/*', function (req, res) {
    console.log("200 - " + req.url);
    var img = fs.readFileSync(req.url.replace('/img', path));
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
});

app.get('/', function(req, res) {
    console.log("200 - " + req.url);
    fs.readFile('public/index.html', 'utf8', function(err, data) {
        if (err)
            return console.log(err);
        res.send(data);
    });
});

app.get('*', function(req, res) {
    console.error("404 - " + req.url);
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

var server = app.listen(80, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
});
