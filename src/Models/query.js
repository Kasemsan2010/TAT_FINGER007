module.exports = {
    select: {
        select_time_userinfo_depart: `SELECT HISTORY.ETAG AS ACNO, ENAME & " " & ELNAME AS NAME, HISTORY.EDATE, HISTORY.ETIME FROM HISTORY WHERE (((HISTORY.STS) Is Null)) ORDER BY EDATE DESC `,
        select_time_userinfo_depart_bytableview: `SELECT * FROM  CheckTimeInOut`,
    },
    update: {
        update_checkinout_sts2: `UPDATE HISTORY SET STS = "Y" WHERE EDATE&""&ETIME = `, // Format(c.CHECKTIME,"yyyymmdd")
    }
};
