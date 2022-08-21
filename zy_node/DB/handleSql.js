var handleSql = {
    insert: "insert into handInf(handId, handTime, handData) values(?,?,?)",
    getHistoryById: "select * from handInf where handId=?"
};

module.exports = handleSql;