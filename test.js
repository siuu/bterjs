/**
 * Created by xiaochuanzhi on 2017/6/13.
 */


let Market = require('./index').Market;
let Trade = require('./index').Trade;

getCnyBalance = () => {
    const trade = new Trade('','');
    let amount = 0;
    console.time('request');
    Market.getTickers().then(tickerList => {
        trade.getBalance().then(resp => {
            console.timeEnd('request');
            let available = resp.available;
            for (let key in available) {
                if (!available.hasOwnProperty(key)) {
                    continue;
                }
                if (key === 'CNY') {
                    amount += parseFloat(available[key]);
                    continue;
                }
                let tickerKey = (`${key}_cny`).toLowerCase();
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