/**
 * Created by xiaochuanzhi on 2017/6/13.
 */


let Market=require('./index').Market;


let market=new Market();


market.getPairTicker('btc_cny').then(resp=>{
    console.log(resp)
},err=>{
    console.log(err);
});