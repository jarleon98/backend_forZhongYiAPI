const express = require("express")
//创建路由对象，来管理路由
const handRouter = express.Router()

var multiparty = require('multiparty')
var fs = require('fs');
var path = require('path');
var mysql = require('mysql')
var sd = require('silly-datetime')
var axios = require('axios');

const app = express();
//统一格式化返回值
function formatReq(code, msg, data) {
    return {
        code: code,
        data: data,
        message: msg
    }
}

//定义handData空对象，用来承载结果对象
var handId = "";
var handData = {};

//数据库
var db = require('../DB/db');
var handleSql = require('../DB/handleSql');

var leftHandUpload = handRouter.post('/upload/leftHand', (req, res) => {
    //利用multiparty中间件获取文件数据
    let uploadDir = '../picture/leftHands' //作为中间目录，待会要重命名文件到指定目录的
    console.log('进入到upload')
    let form = new multiparty.Form()
    form.uploadDir = uploadDir
    form.keepExtensions = true; //是否保留后缀
    form.parse(req, function(err, fields, files) { //fields 就是formData提交的表单数据对象，files表示你提交的文件对象
        console.log("上传文件", fields)
        //fields.file[0]是 [object Object]
        console.log("上传文件的files", files)
        //这里是save_path 就是前端传回来的 path 字段，这个字段会被 multiparty 中间件解析到 fields 里面 ，这里的 fields 相当于 req.body 的意思
        let save_path = '/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node/picture/leftHands/'
        handId = parseInt(fields.id)
        console.log("上传数据库id", handId)
        if (err) {
            console.log(err)
            res.send(formatReq(0, "上传失败"))
        } else {
            console.log('Im here')
            let file_list = []
            if (!files.file){
                console.log('!files.file')
                res.send(formatReq(0, "上传失败"))
            }
            else {
                //所有文件重命名，（因为不重名的话是随机文件名）
                files.file.forEach((file) => {
                    fs.rename(file.path, save_path + fields.id +  '-' + file.originalFilename, function(err) {
                        if (err) {
                            console.log("重命名失败")
                        } else {
                            console.log("左手图片重命名成功")
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

var rightHandUpload = handRouter.post('/upload/rightHand', (req, res) => {
    //利用multiparty中间件获取文件数据
    let uploadDir = '../picture/rightHands' //作为中间目录，待会要重命名文件到指定目录的
    let form = new multiparty.Form()
    form.uploadDir = uploadDir
    form.keepExtensions = true; //是否保留后缀
    form.parse(req, function(err, fields, files) { //fields提交的表单数据对象，files表示你提交的文件对象
        console.log("上传文件", fields)
        console.log("files", files)
        //这里是save_path 就是前端传回来的 path 字段，这个字段会被 multiparty 中间件解析到 fields 里面 ，这里的 fields 相当于 req.body 的意思
        let save_path = '/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node/picture/rightHands/'
        if (err) {
            console.log(err)
            res.send(formatReq(0, "上传失败"))
        } else {
            let file_list = []
            if (!files.file) res.send(formatReq(0, "上传失败"))
            else {
                //所有文件重命名，（因为不重名的话是随机文件名）
                files.file.forEach((file) => {
                    fs.rename(file.path, save_path + fields.id +  '-' + file.originalFilename, function(err) {
                        if (err) {
                            // console.log("重命名失败")
                        } else {
                            console.log("右手图片重命名成功")
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



var resHandAccept = handRouter.post('/resHand', function (req, res){
    //进行结果确认响应
    res.send({result: "SUCCESS"})
    //将问诊结果存入全局变量handData
    handData = req.body.data
    console.log(handData)
    //数据库上传操作
    var handTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    var handDataStr = JSON.stringify(handData)
    //动态参数
    const sqlParams = [handId, handTime, handDataStr]
    //sql操作
    db.query(handleSql.insert, sqlParams,  (err, res) =>{
        if(err){
            console.log(err)
        } else {
            console.log(res)
            console.log('插入成功')
        }
    })

})

var resHandShow = handRouter.get('/resHand', function (req, res){
    //将当前handId用户的问诊记录显示出来
    res.send({data: handData})
    console.log(handData)
})


var leftHandShow = handRouter.get('/picture/leftHands/*', function(req, res){
    res.sendFile( "/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node" + "/" + req.url );
    console.log(req.url);
})

var rightHandShow = handRouter.get('/picture/rightHands/*', function(req, res){
    res.sendFile( "/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node" + "/" + req.url );
    console.log(req.url);
})

var resHandHistory = handRouter.get('/resHandHistory', function (req, res){
    //查询指定id的用户历史问诊
    console.log("用户的id:", handId)
    //数据库操作
    const sqlParams = [handId]
    db.query(handleSql.getHistoryById, sqlParams, (error, results) =>{
        if(error){
            console.log(error)
        } else {
            results = JSON.parse(JSON.stringify(results))
            res.send(results)
            console.log("这里是results:", results)
        }
    })

})

module.exports = leftHandShow, leftHandUpload, rightHandShow, rightHandUpload, resHandAccept, resHandShow, resHandHistory



