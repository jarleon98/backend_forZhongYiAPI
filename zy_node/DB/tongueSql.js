var tongueSql = {
    insert: "insert into tongueInf(tongueId, tongueTime, tongueData) values(?,?,?)",
    getHistoryById: "select * from tongueInf where tongueId=?"
};

module.exports = tongueSql;