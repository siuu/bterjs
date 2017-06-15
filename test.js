/**
 * Created by xiaochuanzhi on 2017/6/13.
 */


const Market = require('./index').Market;
const Trade = require('./index').Trade;

const getCnyBalance = () => {
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
};

getCnyBalance();