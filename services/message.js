'use strict';
/**
 * メッセージングサービス
 */
const _ = require('lodash');
const async = require('async');

const constant = require('../constant');
const fortuneService = require('./fortune');
const messageClient = require('../client/message');

const messageService = exports;

const APP_URL = process.env.APP_URL;


/**
 * API実行後の処理
 * @param err
 * @param res
 * @private
 */
function afterFunc_(err, res) {
    if (err) {
        console.log(err);
        res.status(500).json({
            message: err,
        });
        return;
    }

    res.status(200).json({});
}


/**
 * 占いを実行して返信する
 * @param req
 * @param res
 */
messageService.reply = function(req, res) {
    const event = req.body.events[0] || {};
    const replyToken = event.replyToken;
    const timestamp = event.timestamp || Date.now();
    const text = event.message && event.message.text || '';

    // 星座名以外のテキストが送られてきた場合
    if (!~_.values(constant.SIGN).indexOf(text)) {
        const messages = [
            {
                type: 'text',
                text: '占いたい星座を選んでください'
            },
            {
                type: 'template',
                altText: '星座を送信してください',
                template: {
                    type: 'carousel',
                    columns: getSignColumns_(),
                }
            }
        ];

        // 星座の選択肢を返信する
        messageClient.replyMessage(messages, replyToken, (err) => {
            afterFunc_(err, res);
        });
        return;
    }

    async.waterfall([
        (next) => {
            // 占い結果の取得
            fortuneService.getHoroscope(text, timestamp, next);
        },
        (horoscope, next) => {
            const messages = [
                {
                    type: 'text',
                    text: `今日 ${horoscope.dayKey} の${text}の運勢は...`,
                },
                {
                    type: 'text',
                    text: fortuneService.convertFortuneResult(horoscope.result)
                }
            ];

            // 占い結果を返信
            messageClient.replyMessage(messages, replyToken, next);
        }
    ], (err) => {
        afterFunc_(err, res)
    });
};


/**
 * 星座リストをAPI実行に必要な形式で取得します
 * @returns {Array}
 * @private
 */
function getSignColumns_() {
    const columns = [];
    _.times(4, (index) => {
        // 星座を3つずつ取得
        const startNum = index * 3;
        const signs = _.values(constant.SIGN).slice(startNum, startNum + 3);
        const actions = signs.map((sign) => {
            return {
                type: 'message',
                label: sign,
                text: sign,
            }
        });

        const column = {
            thumbnailImageUrl: `${APP_URL}/content/seiza0${index + 1}.jpg`,
            text: '星座を選んでね',
            actions: actions,
        };

        columns.push(column);
    });

    return columns;
}
