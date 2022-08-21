var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var multiparty = require('multiparty')

//app对象 网站服务器对象
var app = express();

//处理请求头、跨域问题
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    next();
});

// 读取当前文件夹下的所有文件
function walk(currentDirPath, callback) {
    var list = []
    var fs = require('fs'),
        path = require('path');
    fs.readdir(currentDirPath, function(err, files) {
        if (err) {
            callback()
        } else {
            for (let i = 0; i < files.length; i++) {
                var filePath = path.join(currentDirPath, files[i]);
                var stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    //添加文件信息
                    list.push({
                        file_name: files[i],
                        file_stat: stat,
                        file_path: filePath.replace(/\\/g, "/"),
                        is_file: true	//是否为文件
                    });

                } else if (stat.isDirectory()) {
                    list.push({
                        file_name: files[i],
                        file_stat: stat,
                        file_path: filePath.replace(/\\/g, "/"),
                        is_file: false
                    });
                }
            }
            callback(list)
        }
    });
}

//统一格式化返回值
function formatReq(code, msg, data) {
    return {
        code: code,
        data: data,
        message: msg
    }
}

app.get('/', (req, res) =>{
    res.end("hi")
})


app.post('/upload', (req, res) => {
    //利用multiparty中间件获取文件数据
    let uploadDir = '../picture/leftHands' //作为中间目录，待会要重命名文件到指定目录的
    console.log('进入upload页面')
    let form = new multiparty.Form()

    form.uploadDir = uploadDir
    form.keepExtensions = true; //是否保留后缀
    form.parse(req, function(err, fields, files) { //fields提交的表单数据对象，files表示你提交的文件对象
        console.log("上传文件", fields)
        console.log("files", files)
        //这里是save_path 就是前端传回来的 path 字段，这个字段会被 multiparty 中间件解析到 fields 里面 ，这里的 fields 相当于 req.body 的意思
        // let save_path = fields.path
        let save_path = '/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node/picture/leftHands/'
        if (err) {
            console.log(err)
            res.send(formatReq(0, "上传失败"))
        } else {
            //能进到这里
            let file_list = []
            if (!files.file) res.send(formatReq(0, "上传失败"))
            else {
                //所有文件重命名，（因为不重名的话是随机文件名）
                files.file.forEach(file => {
                    /*
                     * file.path 文件路径
                     * save_path+originalFilename   指定上传的路径 + 原来的名字
                     */
                    fs.rename(file.path, save_path + '-' +file.id + '-' +file.originalFilename, function(err) {
                        if (err) {
                            // console.log("重命名失败")
                        } else {
                            // console.log("重命名成功")
                        }
                    });

                })
                if (err) {
                    console.log(err)
                    res.send(formatReq(0, "上传失败"))
                } else {
                    //返回所有上传的文件信息

                    res.send(formatReq(1, "上传成功"))
                }
            }

        }
    })

})

app.get('/picture/leftHands/*', function(req, res){
    res.sendFile( __dirname + "/" + req.url );
    console.log("Request for " + req.url + " received.");
})

app.listen(3001);