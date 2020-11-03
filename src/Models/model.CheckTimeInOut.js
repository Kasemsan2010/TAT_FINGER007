const query = require('./query');
const adodb = require('node-adodb');
const C_CheckTimeInOut = require('../Contorllers/Contorllers.CheckTimeInOut')
adodb.debug = true;
const connection = adodb.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=D:\\NodeProject\\TAT_OLD_1\\Event.mdb;Persist Security Info=False;');
'use strict';

checktimeinout = () => {
    const result = connection.query(query.select.select_time_userinfo_depart).then(data => {
        return data;
    }).catch(err => {
        console.error(`ERROR : userinfo_bytableview : ${err}`);
    });
    return result;
}
module.exports.checktimeinout = checktimeinout;


checkinout_update_sts = async (_val) => {
    // console.log(_val);
    const date_ob = new Date();
    const result = await connection.execute(`${query.update.update_checkinout_sts2} '${_val}'`)
        .then(data => {
            // console.log('INFO : checkinout_update_sts success');
            return 'SUCCESS';
        })
        .catch(err => {
            console.error(err);
            C_CheckTimeInOut.LogFile({ header_sts: 'checkinout_update_sts', heckinout: err }, date_ob, 'processlog/processlog');
            return err;
        });
    return result;
}
module.exports.checkinout_update_sts = checkinout_update_sts;