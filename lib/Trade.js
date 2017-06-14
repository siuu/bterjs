/**
 * Created by xiaochuanzhi on 2017/6/14.
 */
const http = require("https");
const util = require('util');
const crypto = require('crypto');
const qs = require("querystring");


const POST_METHOD = 'POST';

const HOST_NAME = 'api.bter.com';

const API_BALANCE = '/api2/1/private/balances';
const API_DEPOSIT_ADDRESS = '/api2/1/private/depositAddress';
const API_DEPOSITS_WITHDRAWALS_HISTORY = '/api2/1/private/depositsWithdrawals';
const API_ORDER_BUY = '/api2/1/private/buy';
const API_ORDER_SELL = '/api2/1/private/sell';
const API_CANCEL_ORDER = '/api2/1/private/cancelOrder';
const API_CANCEL_ORDERS = '/api2/1/private/cancelOrders';
const API_CANCEL_ALL_ORDERS = '/api2/1/private/cancelAllOrders';
const API_ORDER_STATUS = '/api2/1/private/getOrder';
const API_ORDERS_LIST = '/api2/1/private/openOrders';
const API_TRADE_HISTORY = '/api2/1/private/tradeHistory';
const API_WITHDRAW = '/api2/1/private/withdraw';


class Trade {

    constructor(key, secret) {
        this._key = key;
        this._secret = secret;
    }

    _request(method, path, data = {}) {
        data.nonce = Math.round((new Date()).getTime() / 1000);
        let form = qs.stringify(data);
        return new Promise((resolve, reject) => {
            let options = {
                method: method,
                hostname: HOST_NAME,
                path: path,
                port: null,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Sign': this._signMsg(form),
                    'Key': this._key,
                }
            };
            let req = http.request(options, function (res) {
                let body = '';
                res.on('data', function (d) {
                    body += d;
                });

                res.on('end', function () {
                    try {
                        if (!body) reject(null);
                        let parsed = JSON.parse(body);
                        if (parsed.result === 'false') reject(parsed);
                        resolve(parsed);
                    } catch (e) {
                        reject(e.toString());
                    }
                });
            });
            req.write(form);
            req.end();

            req.on('error', function (e) {
                    reject(e.message);
                }
            );
        })
    }

    _signMsg(form) {
        return crypto.createHmac('sha512', this._secret).update(new Buffer(form)).digest('hex').toString();
    }


    /**
     * 获取帐号资金余额
     * @returns Promise<Object>
     */
    getBalance() {
        return this._request(POST_METHOD, API_BALANCE);
    }

    /**
     * 获取充值地址
     * @param currency String 币种 示例:BTC
     * @returns Promise<Object>
     */
    getDepositAddress(currency) {
        return this._request(POST_METHOD, API_DEPOSIT_ADDRESS, {currency: currency});
    }

    /**
     * 获取充值提现历史
     * @param start Number 起始UNIX时间    示例:1469092370
     * @param end Number   终止UNIX时间    示例:1469713981
     * @returns Promise<Object>
     */
    getDepositsAndWithdrawalsHistory(start = null, end = null) {
        let data = {};
        if (start) data.start = start;
        if (end) data.end = end;
        return this._request(POST_METHOD, API_DEPOSITS_WITHDRAWALS_HISTORY, data);
    }


    /**
     * 下单交易买入
     * @param currencyPair String 交易币种对 示例:ltc_btc
     * @param rate Number 价格 示例:0.023
     * @param amount Number 交易量 示例:100
     * @returns Promise<Object>
     */
    orderBuy(currencyPair, rate, amount) {
        let data = {
            currencyPair: currencyPair,
            rate: rate,
            amount: amount
        };
        return this._request(POST_METHOD, API_ORDER_BUY, data);
    }

    /**
     * 下单交易卖出
     * @param currencyPair String 交易币种对 示例:ltc_btc
     * @param rate Number 价格 示例:0.023
     * @param amount Number 交易量 示例:100
     * @returns Promise<Object>
     */
    orderSell(currencyPair, rate, amount) {
        let data = {
            currencyPair: currencyPair,
            rate: rate,
            amount: amount
        };
        return this._request(POST_METHOD, API_ORDER_SELL, data);
    }


    /**
     * 取消下单
     * @param currencyPair String 价格 示例:ltc_btc
     * @param orderNumber Number 交易币种对 示例:123456
     * @returns Promise<Object>
     */
    cancelOrder(currencyPair, orderNumber) {
        let data = {
            orderNumber: orderNumber,
            currencyPair: currencyPair,
        };
        return this._request(POST_METHOD, API_CANCEL_ORDER, data);
    }

    /**
     * 取消多个下单
     * @param ordersArray Array 下单单号和pair的数组 示例:[{"orderNumber":"7942422","currencyPair":"ltc_btc"},{"orderNumber":"7942422","currencyPair":"ltc_btc" }]
     * @returns Promise<Object>
     */
    cancelOrders(ordersArray) {
        let data = {
            orders_json: JSON.stringify(ordersArray),
        };
        return this._request(POST_METHOD, API_CANCEL_ORDERS, data);
    }

    /**
     * 取消所有下单
     * @param type Number 下单类型(0:卖出,1:买入,-1:不限制) 示例:0
     * @param currencyPair String 价格 示例:ltc_btc
     * @returns Promise<Object>
     */
    cancelAllOrder(type, currencyPair) {
        let data = {
            type: type,
            currencyPair: currencyPair,
        };
        return this._request(POST_METHOD, API_CANCEL_ALL_ORDERS, data);
    }

    /**
     * 获取下单状态
     * @param currencyPair String 价格 示例:ltc_btc
     * @param orderNumber Number 下单单号 示例:123456
     * @returns Promise<Object>
     */
    getOrderStatus(currencyPair, orderNumber) {
        let data = {
            orderNumber: orderNumber,
            currencyPair: currencyPair,
        };
        return this._request(POST_METHOD, API_ORDER_STATUS, data);
    }

    /**
     * 获取我的当前挂单列表
     * @returns Promise<Object>
     */
    getOrdersList() {
        return this._request(POST_METHOD, API_ORDERS_LIST);
    }

    /**
     * 获取我的24小时内成交记录
     * @param currencyPair String 价格 示例:ltc_btc
     * @param orderNumber Number 下单单号（可选项） 示例:123456
     * @returns Promise<Object>
     */
    getTradeHistory(currencyPair, orderNumber = null) {
        let data = {
            currencyPair: currencyPair,
        };
        if (orderNumber) data.orderNumber = orderNumber;
        return this._request(POST_METHOD, API_TRADE_HISTORY, data);
    }

    /**
     * 获取我的24小时内成交记录
     * @param currency String 提现币种 示例:btc
     * @param amount Number 提现数量 示例:0.01
     * @param address 提现地址 提现数量 示例:1HkxtBAMrA3tP5ENnYY2CZortjZvFDH5Cs
     * @returns Promise<Object>
     */
    withdraw(currency, amount, address) {
        let data = {
            currency: currency,
            amount: amount,
            address: address,
        };
        return this._request(POST_METHOD, API_WITHDRAW, data);
    }

}


module.exports = Trade;