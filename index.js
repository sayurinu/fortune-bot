'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const messageService = require('./services/message');
const validateService = require('./services/validate');

const app = express();
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 静的ファイルの配信
app.use('/content', express.static('content'));

// test
app.get('/test', (req, res) => {
    res.json({
        param: 'aaa',
    });
});

// LINEからのイベントを取得
app.post('/hook', [validateService.validate], messageService.reply);

app.listen(app.get('port'), () => {
    console.log('node app is running.');
});
