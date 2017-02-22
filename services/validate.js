'use strict';
/**
 * バリデーションサービス
 */

const validateService = exports;


/**
 * バリデート
 * @param req
 * @param res
 * @param callback
 */
validateService.validate = function(req, res, callback) {
    // if (!req.body.events || !req.body.events.length) {
    //     res.status(400).json({
    //         message: 'bad request'
    //     });
    //     return;
    // }

    callback();
};
