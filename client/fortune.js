'use strict';
/**
 * 星座占いを実行する
 */
const request = require('request');

const fortuneClient = exports;


/**
 * 占いAPIを実行する
 * ドキュメントは以下
 * http://jugemkey.jp/api/waf/api_free.php
 * @param date
 * @param callback
 */
fortuneClient.execute = function(date, callback) {
    const year = date.year;
    const month = date.month;
    const day = date.day;

    const url = `http://api.jugemkey.jp/api/horoscope/free/${year}/${month}/${day}`;

    const options = {
        url: url,
        json: true,
    };

    request.get(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.log(error);
            console.log(response.statusCode);
            console.log(body);
            callback('error');
            return;
        }

        callback(null, body);
    });
};
