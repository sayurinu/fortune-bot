'use strict';
/**
 * 占いに関するサービス
 */
const _ = require('lodash');

const fortuneClient = require('../client/fortune');

const fortuneService = exports;


/**
 * 指定した星座の今日の運勢を取得する
 * @param sign
 * @param callback
 */
fortuneService.getTodayHoroscope = function(sign, callback) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const date = {
        year: year,
        month: month,
        day: day,
    };

    // APIの実行
    fortuneClient.execute(date, (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        const dateKey = getDayKey_(date);
        const horoscopes = result.horoscope[dateKey];

        // 一致する星座の結果のみを返す
        const signData = _.find(horoscopes, (data) => {
            return data.sign === sign;
        });
        callback(null, signData);
    });
};


/**
 * 日付のキーを取得する
 * @param date
 * @returns {string}
 * @private
 */
function getDayKey_(date) {
    const year = date.year;
    const month = date.month < 10 ? `0${date.month}` : date.month;
    const day = date.day < 10 ? `0${date.day}` : date.day;

    return `${year}/${month}/${day}`;
}
