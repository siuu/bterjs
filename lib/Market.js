/**
 * Created by xiaochuanzhi on 2017/6/13.
 */
const http = require("http");
const util = require('util');

const GET_METHOD = 'GET';

const HOST_NAME = 'data.bter.com';
const API_PAIRS = '/api2/1/pairs';
const API_MARKET_INFO = '/api2/1/marketinfo';
const API_MARKET_LIST = '/api2/1/marketlist';
const API_TICKERS = '/api2/1/tickers';
const API_ORDER_BOOKS = '/api2/1/orderBooks';

const API_PAIR_TICKER = '/api2/1/ticker/%s';
const API_PAIR_ORDER_BOOK = '/api2/1/orderBook/%s';
const API_PAIR_HISTORY = '/api2/1/tradeHistory/%s';


class Market {

    static _request(method, path, pair = null) {
        if (pair && pair.constructor === String) {
            path = util.format(path, pair)
        }
        return new Promise((resolve, reject) => {

            const options = {
                method: method,
                hostname: HOST_NAME,
                port: null,
                path: path,
            };

            const req = http.request(options, function (res) {
                let body = '';
                res.on('data', function (d) {
                    body += d;
                });
                res.on('end', function () {
                    try {
                        if (!body) {
                            reject(null);
                        }
                        const parsed = JSON.parse(body);
                        if (parsed.hasOwnProperty('code') && parsed.code > 0) {
                            reject(parsed);
                        }
                        resolve(parsed);
                    } catch (e) {
                        reject(e.toString());
                    }


                });

            });
            req.setTimeout(20000, function() {
                req.abort();
            });
            req.end();
            req.on('error', function (e) {
                reject(e.message);
            });

        })
    }

    /**
     * 返回所有系统支持的交易对
     * @returns Promise<object>
     */
    static getPairs() {
        return Market._request(GET_METHOD, API_PAIRS)
    }

    /**
     * 交易市场订单参数
     * 返回所有系统支持的交易市场的参数信息，包括交易费，最小下单量，价格精度等。
     * @returns Promise<object>
     */
    static getMarketInfo() {
        return Market._request(GET_METHOD, API_MARKET_INFO)
    }

    /**
     * 交易市场详细行情
     * 返回所有系统支持的交易市场的详细行情和币种信息，包括币种名，市值，供应量，最新价格，涨跌趋势，价格曲线等。
     * @returns Promise<object>
     */
    static getMarketList() {
        return Market._request(GET_METHOD, API_MARKET_LIST)
    }

    /**
     * 所有交易行情
     * 返回系统支持的所有交易对的 最新，最高，最低 交易行情和交易量，每10秒钟更新:
     * @returns Promise<object>
     */
    static getTickers() {
        return Market._request(GET_METHOD, API_TICKERS)
    }

    /**
     * 所有市场深度
     * 返回系统支持的所有交易对的市场深度（委托挂单），其中 asks 是委卖单, bids 是委买单。
     * @returns Promise<object>
     */
    static getOrderBooks() {
        return Market._request(GET_METHOD, API_ORDER_BOOKS)
    }


    /**
     * 单项交易行情
     * 返回最新，最高，最低 交易行情和交易量，每10秒钟更新
     * @param pair String 交易对 示例:btc_cny
     * @returns Promise<object>
     */
    static getPairTicker(pair) {
        return Market._request(GET_METHOD, API_PAIR_TICKER, pair)
    }

    /**
     * 市场深度
     * 返回最新，最高，最低 交易行情和交易量，每10秒钟更新
     * @param pair String 交易对 示例:btc_cny
     * @returns Promise<object>
     */
    static getPairOrderBook(pair) {
        return Market._request(GET_METHOD, API_PAIR_ORDER_BOOK, pair)
    }

    /**
     * 历史成交记录 API
     * 返回最新80条历史成交记录：
     * @param pair String 交易对 示例:btc_cny
     * @returns Promise<object>
     */
    static getPairHistory(pair, tid) {
        if (tid) pair = pair + '/' + tid
        return Market._request(GET_METHOD, API_PAIR_HISTORY, pair)
    }

}


module.exports = Market;
