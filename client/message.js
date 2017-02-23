'use strict';
/**
 * LINE Messaging API にリクエストを送信する
 */

const request = require('request');

const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;

const API_URL = 'https://api.line.me/v2/bot/message/reply';

// ヘッダー
const headers = {
    'Content-Type' : 'application/json; charset=UTF-8',
    'Authorization' : `Bearer ${channelAccessToken}`,
};

const messageClient = exports;


/**
 * Reply message API を利用する
 * @param messages
 * @param replyToken
 * @param callback
 */
messageClient.replyMessage = function(messages, replyToken, callback) {
    const options = {
        url: API_URL,
        headers: headers,
        json: true,
        body: {
            replyToken: replyToken,
            messages: messages,
        }
    };

    request.post(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.log(error);
            console.log(response.statusCode);
            console.log(body);
            callback('error');
            return;
        }

        callback();
    });
};


///**
// * テンプレートに従ったメッセージを送信する
// * @param columns
// * @param altText 非対応端末で表示される代替テキスト
// * @param replyToken
// * @param callback
// */
//messageClient.templateMessage = function(columns, altText, replyToken, callback) {
//    const options = {
//        url: API_URL,
//        headers: headers,
//        json: true,
//        body: {
//            replyToken: replyToken,
//            messages: [
//                {
//                    type: 'template',
//                    altText: altText,
//                    template: {
//                        type: 'carousel',
//                        columns: columns,
//                    }
//                }
//            ]
//        }
//    };
//
//    request.post(options, (error, response, body) => {
//        if (error || response.statusCode !== 200) {
//            console.log(error);
//            console.log(response.statusCode);
//            console.log(body);
//            callback('error');
//            return;
//        }
//
//        callback();
//    });
//};
