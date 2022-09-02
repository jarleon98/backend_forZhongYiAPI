var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '',
    user: 'root',
    password: '',
    database: 'zyInf'
});

function query(sql, values, callback) {
    console.log("数据库连接池");
    pool.getConnection(function (err, connection) {
        if(err) throw err;
        console.log("获取连接 ");
        connection.query(sql, values,function (err, results, fields) {
            console.log('接收的写入数据库结果为', results)
            console.log('---', JSON.stringify(results));
            //每次查询都会 回调
            callback(err, results);
            //只是释放链接，在缓冲池了，没有被销毁
            connection.release();
            if(err) throw error;
        });
    });
}

exports.query = query;
