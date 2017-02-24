'use strict';
/**
 * 占いに関するサービス
 */
const _ = require('lodash');

const fortuneClient = require('../client/fortune');

const fortuneCache = {};

const fortuneService = exports;


/**
 * 指定した星座の今日の運勢を取得する
 * @param sign
 * @param time
 * @param callback
 */
fortuneService.getHoroscope = function(sign, time, callback) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const data = {
        year: year,
        month: month,
        day: day,
    };

    const dayKey = getDayKey_(data);

    // キャッシュにある場合はキャッシュから返却する
    if (fortuneCache[dayKey] && fortuneCache[dayKey][sign]) {
        callback(null, {
            result: fortuneCache[dayKey][sign],
            dayKey: dayKey
        });
        return;
    }

    // APIの実行
    fortuneClient.execute(data, (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        const horoscopes = result.horoscope[dayKey];

        clearAndSetDayCache_(dayKey, horoscopes);

        // 一致する星座の結果を返す
        callback(null, {
            result: fortuneCache[dayKey][sign],
            dayKey: dayKey,
        });
    });
};


/**
 * キャッシュデータをセットする
 * @param dayKey
 * @param horoscopes
 * @private
 */
function clearAndSetDayCache_(dayKey, horoscopes) {
    Object.keys(fortuneCache).forEach((key) => {
        delete fortuneCache[key];
    });

    fortuneCache[dayKey] = horoscopes.reduce((result, horo) => {
        result[horo.sign] = horo;
        return result;
    }, {});
}


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


/**
 * 占いの結果を文字列にして返す
 * @param horoscope
 * @returns {*}
 */
fortuneService.convertFortuneResult = function(horoscope) {
    // ランキング
    const rank = `【${horoscope.rank}位】`;

    // 占いの内容
    const content = horoscope.content;

    // 金運（5段階評価）
    const money = `　金運: ${getStarEvaluation_(horoscope.money)}`;

    // 仕事運（5段階評価）
    const job = `仕事運: ${getStarEvaluation_(horoscope.job)}`;

    // 恋愛運（5段階評価）
    const love = `恋愛運: ${getStarEvaluation_(horoscope.love)}`;

    // 総合運（5段階評価）
    const total = `総合運: ${getStarEvaluation_(horoscope.total)}`;

    // ラッキーアイテム
    const item = `ラッキーアイテム: ${horoscope.item}`;

    // ラッキーカラー
    const color = `ラッキーカラー: ${horoscope.color}`;

    // 星座名
    // const sign = horoscope.sign;

    return `${rank}\n${content}\n${money}\n${job}\n${love}\n${total}\n${item}\n${color}`;
};


/**
 * 5段階評価を星マークの表示で取得する
 * @param value
 * @returns {string}
 * @private
 */
function getStarEvaluation_(value) {
    let evaluation = '';

    _.times(5, (index) => {
        if (index < value) {
            evaluation += '★';
        } else {
            evaluation += '☆';
        }
    });

    return evaluation;
}