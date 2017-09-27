'use-strict';

const showdown  = require('showdown');
const dirTree = require('directory-tree');
const express = require('express');
const fs = require('fs');

const converter = new showdown.Converter();
const app = express();
const path = 'md';

app.use(express.static('public'));

app.get('/' + path + '/*', function(req, res) {
    fs.readFile(req.url.substr(1), 'utf8', function(err, data) {
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
            res.send(html);
        });
    });
});

app.get('/data', function(req, res) {
    res.send(dirTree(path, {extensions:/\.md/}));
});

app.get('/', function(req, res) {
    fs.readFile('public/index.html', 'utf8', function(err, data) {
        if (err)
            return console.log(err);
        res.send(data);
    });
});

app.get('*', function(req, res) {
    res.status(404).send('Are you a teapot ?');
});

var server = app.listen(80, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
});
