'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var stringifyFile = void 0;

app.use(bodyParser.json());
app.use(express.static('assets'));

app.get('/', function (req, res) {
    res.sendFile('/index.html');
});

app.get('/userform', function (req, res) {
    var response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    };
    addNewUser(response);
    res.end(JSON.stringify(response));
});

app.get('/getNote', function (req, res) {
    console.log('Wyświetlanie JSON');
    fs.readFile('./test.json', 'utf8', function (err, data) {
        if (err) throw err;
        stringifyFile = data;
        res.send(data);
    });
});

function addNewUser(newUser) {
    fs.readFile('./usersForm.json', 'utf8', function (err, data) {
        if (err) throw err;
        var obj = [];
        var id = new Date().getTime().toString();
        var counter = 1;
        var item = '';
        obj = JSON.parse(data);
        for (var x in obj.users) {
            counter += 1;
        };
        item = 'user_' + counter;
        obj.users[item] = {
            "user_id": id,
            "first_name": newUser.first_name,
            "last_name": newUser.last_name
        };
        stringifyFile = JSON.stringify(obj);
        fs.writeFile('./usersForm.json', stringifyFile, function (err) {
            if (err) throw err;
        });
    });
};

var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Przykładowa aplikacja nasłuchuje na http://' + host + ':' + port);
});

app.use(function (req, res, next) {
    res.status(404).send('Wybacz, nie mogliśmy odnaleźć tego, czego żądasz!');
});
