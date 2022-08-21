var faceSql = {
    insert: "insert into faceInf(faceId, faceTime, faceData) values(?,?,?)",
    getHistoryById: "select * from faceInf where faceId=?"
};

module.exports =faceSql;