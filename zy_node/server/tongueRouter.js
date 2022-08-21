const express = require("express")
//创建路由对象，来管理路由
const tongueRouter = express.Router()

var multiparty = require('multiparty')
var fs = require('fs');
var path = require('path');
var mysql = require('mysql')
var sd = require('silly-datetime')
var axios = require('axios');
//db
var db = require('../DB/db');
var tongueSql = require('../DB/tongueSql');

const app = express();
//统一格式化返回值
function formatReq(code, msg, data) {
    return {
        code: code,
        data: data,
        message: msg
    }
}

//定义全局tongueData对象
var tongueId = "";
var tongueData = {};


var tongueTopUpload = tongueRouter.post('/upload/tongueTop', (req, res) => {
    //利用multiparty中间件获取文件数据
    let uploadDir = '../picture/tongueTops' //作为中间目录，待会要重命名文件到指定目录的
    console.log('进入到舌诊top上传接口')
    let form = new multiparty.Form()
    form.uploadDir = uploadDir
    form.keepExtensions = true; //是否保留后缀
    form.parse(req, function(err, fields, files) { //fields提交的表单数据对象，files表示你提交的文件对象
        console.log("上传文件", fields)
        console.log("files", files)
        //这里是save_path 就是前端传回来的 path 字段，这个字段会被 multiparty 中间件解析到 fields 里面 ，这里的 fields 相当于 req.body 的意思
        let save_path = '/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node/picture/tongueTops/'
        tongueId = parseInt(fields.id);
        console.log("上传数据库id", tongueId);
        if (err) {
            console.log(err)
            res.send(formatReq(0, "上传失败"))
        } else {
            console.log('Im here')
            let file_list = []
            if (!files.file) res.send(formatReq(0, "上传失败"))
            else {
                //所有文件重命名，（因为不重名的话是随机文件名）
                files.file.forEach((file) => {
                    fs.rename(file.path, save_path + fields.id +  '-' + file.originalFilename, function(err) {
                        if (err) {
                            console.log("重命名失败")
                        } else {
                            console.log("舌头上部重命名成功")
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

var tongueBottomUpload = tongueRouter.post('/upload/tongueBottom', (req, res) => {
    //利用multiparty中间件获取文件数据
    let uploadDir = '../picture/tongueBottoms' //作为中间目录，待会要重命名文件到指定目录的
    console.log('进入到upload')
    let form = new multiparty.Form()
    form.uploadDir = uploadDir
    form.keepExtensions = true; //是否保留后缀
    form.parse(req, function(err, fields, files) { //fields提交的表单数据对象，files表示你提交的文件对象
        console.log("上传文件", fields)
        console.log("files", files)
        //这里是save_path 就是前端传回来的 path 字段，这个字段会被 multiparty 中间件解析到 fields 里面 ，这里的 fields 相当于 req.body 的意思
        let save_path = '/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node/picture/tongueBottoms/'
        if (err) {
            console.log(err)
            res.send(formatReq(0, "上传失败"))
        } else {
            console.log('Im here')
            let file_list = []
            if (!files.file) res.send(formatReq(0, "上传失败"))
            else {
                //所有文件重命名，（因为不重名的话是随机文件名）
                files.file.forEach((file) => {
                    fs.rename(file.path, save_path + fields.id +  '-' + file.originalFilename, function(err) {
                        if (err) {
                            console.log("重命名失败")
                        } else {
                            console.log("舌头下部重命名成功")
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

var resTongueAccept = tongueRouter.post('/resTongue', function (req, res){
    //进行结果确认响应
    res.send({result: "SUCCESS"});
    //将问诊结果存入全局变量tongueData
    tongueData = req.body.data;
    console.log('结果确认响应结果为',tongueData);
    //数据库上传
    var tongueTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    var tongueDataStr = JSON.stringify(tongueData);
    //动态参数
    const sqlParams = [tongueId, tongueTime, tongueDataStr];
    //sql操作
    db.query(tongueSql.insert, sqlParams, (err, res) => {
        if(err){
            console.log('出错了', err)
        } else {
            console.log(res)
            console.log('插入成功')
        }
    })
})

//用户问诊记录结果显示接口
var resTongueShow = tongueRouter.get('/resTongue', function (req, res){
    res.send({data: tongueData})
    console.log(tongueData)
})

//传图片到网络地址
var tongueTopShow = tongueRouter.get('/picture/tongueTops/*', function(req, res){
    res.sendFile( "/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node" + "/" + req.url );
    console.log(req.url);
})

var tongueBottomShow = tongueRouter.get('/picture/tongueBottoms/*', function(req, res){
    res.sendFile( "/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node" + "/" + req.url );
    console.log(req.url);
})

//查询用户的问诊历史记录
var resTongueHistory = tongueRouter.get('/resTongueHistory', function(req, res){
    //查询用户id
    console.log("用户的id:", tongueId);
    const sqlParams = [tongueId];
    db.query(tongueSql.getHistoryById, sqlParams, (error, results) => {
        if(error){
            console.log(error)
        } else {
            results = JSON.parse(JSON.stringify(results))
            res.send(results)
            console.log("这里是results:", results)
        }
    })
})

module.exports = tongueTopShow, tongueTopUpload, tongueBottomShow, tongueBottomUpload, resTongueAccept, resTongueShow, resTongueHistory