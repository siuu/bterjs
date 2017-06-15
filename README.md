# bterjs

>[bter.com](https://bter.com) 的非官方库


### Install
    
    npm install bterjs -save
    
### Market
    
    const Market=require('bterjs').Market;
    
[Market](./lib/Market.js)包含的静态方法用于获取交易所行情

- 返回所有系统支持的交易对:`Maket.getPairs()`
- 交易市场订单参数:`Maket.getMarketInfo()`
- 交易市场详细行情:`Maket.getMarketList()`
- 所有交易行情:`Maket.getTickers()`
- 所有市场深度:`Maket.getOrderBooks()`
- 根据交易对获取交易行情:`Maket.getPairTicker(pair)`
- 根据交易对获取市场深度:`Maket.getPairOrderBook(pair)`
- 根据交易对获取历史成交记录:`Maket.getPairHistory(pair)`

### Trade
    
    const Trade=require('bterjs').Trade;
    const trade = new Trade('YOUR_API_KEY', 'YOUR_API_SECRET');
    
[Trade](./lib/Trade.js)可以进行账号资金查询，下单交易，取消挂单。 

- 获取帐号资金余额:`trade.getBalance()`
- 获取充值地址:`trade.getDepositAddress(currency)`
- 获取充值提现历史:`trade.getDepositsAndWithdrawalsHistory()`
- 下单交易买入:`trade.orderBuy(currencyPair, rate, amount)`
- 下单交易卖出:`trade.orderSell(currencyPair, rate, amount)`
- 取消下单:`trade.cancelOrder(currencyPair, orderNumber)`
- 取消多个下单:`trade.cancelOrders(ordersArray)`
- 取消所有下单:`trade.cancelAllOrder(type, currencyPair)`
- 获取下单状态:`trade.getOrderStatus(currencyPair, orderNumber)`
- 获取我的当前挂单列表:`trade.getOrdersList()`
- 获取我的24小时内成交记录:`trade.getTradeHistory(currencyPair, orderNumber = null)`
- 提现:`trade.withdraw(currency, amount, address)`
    

    
    
### Example

获取账户余额并且计算出当前资金估值;


    const Trade=require('bterjs').Trade;
    const Market=require('bterjs').Market;
    
    const trade = new Trade('YOUR_API_KEY', 'YOUR_API_SECRET');
    let amount = 0;
    console.time('request');
    Market.getTickers().then(tickerList => {
        trade.getBalance().then(resp => {
            console.timeEnd('request');
            const available = resp.available;
            for (const key in available) {
                if (!available.hasOwnProperty(key)) {
                    continue;
                }
                if (key === 'CNY') {
                    amount += parseFloat(available[key]);
                    continue;
                }
                const tickerKey = (`${key}_cny`).toLowerCase();
                if (!tickerList.hasOwnProperty(tickerKey)) {
                    console.error(`Can not find pair ${tickerKey}`);
                    continue;
                }
                amount += parseFloat(tickerList[tickerKey].last) * parseFloat(available[key]);
            }
            console.log(amount);
        }, err => {
            console.log(err);
        });
    }, err => {
        console.log(err);
    });
    
    
