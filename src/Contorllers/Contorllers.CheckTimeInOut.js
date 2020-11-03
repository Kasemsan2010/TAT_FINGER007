const M_ChecktimeInOut = require('../Models/model.CheckTimeInOut');
const url = require('../Config/url');
const axios = require('axios');
const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

read_json_file = () => {
    let config = require('../../dept.json');
    return config;
}

ChecktimeInOut = async (req, res) => {
    try {
        setInterval(async (res) => {
            const result = await M_ChecktimeInOut.checktimeinout();
            const date_ob = new Date();

            const full_format_date = (date_ob.getFullYear()) + ("0" + (date_ob.getMonth() + 1)).slice(-2) + ("0" + date_ob.getDate()).slice(-2);

            const time = (date_ob) => {
                let HH = (date_ob.getHours() < 10 ? '0' : '') + date_ob.getHours();
                let MM = (date_ob.getMinutes() < 10 ? '0' : '') + date_ob.getMinutes();
                let SS = (date_ob.getSeconds() < 10 ? '0' : '') + date_ob.getSeconds();
                return `${HH}${MM}${SS}`;
            }

            const fulldata = {
                DATETIME_SEND: full_format_date + time(date_ob),
                SITEID: read_json_file().dept,
                SITENAME: read_json_file().deptnme,
                SCANLAST: result
            }
            if (result.length > 0) {
                if (res) { res.json(fulldata); }
                axios.post(url.url_IP, fulldata).then(async (res) => {
                    const chk = await checkinout_update_sts(result);
                    LogFile(fulldata, date_ob, 'datalog/log');
                    LogFile({ header_sts: 'SendDataSuccess', axios_sts: 'SUCCESS', statusCode: res.config.data }, date_ob, 'processlog/processlog');
                }).catch((error) => {
                    LogFile({ header_sts: 'SendDataError', axios_sts: error.code }, date_ob, 'processlog/processlog');
                    // console.error(error);
                });

                // const chk = await checkinout_update_sts(result, date_ob);
                // LogFile(fulldata, date_ob, 'datalog/log');
                // LogFile({ header_sts: 'SendDataSuccess', axios_sts: 'SUCCESS' }, date_ob, 'processlog/processlog');
            };
        }, 15000);
    } catch (err) {
        console.log(`ERROR : ChecktimeInOut  : ${err}`);
    }
}
module.exports.ChecktimeInOut = ChecktimeInOut;

async function checkinout_update_sts(_obj, date_ob) {
    let re = '';
    try {
        for (const i of _obj) {
            re = await M_ChecktimeInOut.checkinout_update_sts(i.EDATE + i.ETIME);
        }
    } catch (error) {
        await LogFile({ header_sts: 'checkinout_update_sts', heckinout: err }, date_ob, 'processlog/processlog');
    }

}

function LogFile(_obj, date_ob, nme) {
    let HH = (date_ob.getHours() < 10 ? '0' : '') + date_ob.getHours();
    let MM = (date_ob.getMinutes() < 10 ? '0' : '') + date_ob.getMinutes();
    let SS = (date_ob.getSeconds() < 10 ? '0' : '') + date_ob.getSeconds();
    let transport = new (winston.transports.DailyRotateFile)({
        filename: `${nme}-%DATE%.json`,
        datePattern: 'DD-MM-YYYY',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d'
    });

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { date: `${(date_ob.getFullYear())}/${("0" + (date_ob.getMonth() + 1)).slice(-2)}/${("0" + date_ob.getDate()).slice(-2)} ${HH}:${MM}:${SS}` },
        transports: [
            transport
        ],
    });
    logger.log('info', _obj, 'my string');
}
module.exports.LogFile = LogFile;