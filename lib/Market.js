/**
 * Created by xiaochuanzhi on 2017/6/13.
 */
let http = require("http");
let util = require('util');

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

    constructor() {

    }

    request(method, path, pair = null) {
        if (pair && pair.constructor === String) {
            path = util.format(path, pair)
        }
        return new Promise((reslove, reject) => {

            let options = {
                method: method,
                hostname: HOST_NAME,
                path: path
            };
            let req = http.request(options, function (res) {
                let body = '';
                res.on('data', function (d) {
                    body += d;
                });
                res.on('end', function () {
                    let parsed = JSON.parse(body);
                    if (parsed.hasOwnProperty('code') && parsed.code > 0) {
                        reject(parsed);
                    }
                    reslove(parsed);
                });

            });
            req.end();
            req.on('error', function (e) {
                reject(e.message);
            });

        })
    }

    /**
     * 返回所有系统支持的交易对
     */
    getPairs() {
        return this.request(GET_METHOD, API_PAIRS)
    }

    /**
     * 交易市场订单参数 API
     * 返回所有系统支持的交易市场的参数信息，包括交易费，最小下单量，价格精度等。
     */
    getMarketInfo() {
        return this.request(GET_METHOD, API_MARKET_INFO)
    }

    /**
     * 交易市场详细行情 API
     * 返回所有系统支持的交易市场的详细行情和币种信息，包括币种名，市值，供应量，最新价格，涨跌趋势，价格曲线等。
     */
    getMarketList() {
        return this.request(GET_METHOD, API_MARKET_LIST)
    }

    /**
     * 所有交易行情 API
     * 返回系统支持的所有交易对的 最新，最高，最低 交易行情和交易量，每10秒钟更新:
     */
    getTickers() {
        return this.request(GET_METHOD, API_TICKERS)
    }

    /**
     * 所有市场深度 API
     * 返回系统支持的所有交易对的市场深度（委托挂单），其中 asks 是委卖单, bids 是委买单。
     */
    getOrderBooks() {
        return this.request(GET_METHOD, API_ORDER_BOOKS)
    }

    /**
     * 单项交易行情 API
     * 返回最新，最高，最低 交易行情和交易量，每10秒钟更新:
     */
    getPairTicker(pair) {
        return this.request(GET_METHOD, API_PAIR_TICKER, pair)
    }

    /**
     * 单项交易行情 API
     * 返回最新，最高，最低 交易行情和交易量，每10秒钟更新:
     */
    getPairOrderBook(pair) {
        return this.request(GET_METHOD, API_PAIR_ORDER_BOOK, pair)
    }

    /**
     * 历史成交记录 API
     * 返回最新80条历史成交记录：
     */
    getPairHistory(pair) {
        return this.request(GET_METHOD, API_PAIR_HISTORY, pair)
    }

}


module.exports = Market;