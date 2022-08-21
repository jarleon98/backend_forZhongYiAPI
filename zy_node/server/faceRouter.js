//这里也是引入express框架
const express = require("express")

//利用express框架创建路由对象，来管理路由
const faceRouter = express.Router()

var multiparty = require('multiparty')
var fs = require('fs');
var path = require('path');
//这个模块是mysql数据库模块
var mysql = require('mysql')
//这是个日期模块
var sd = require('silly-datetime')
//这是个比较重要的前后端交互的模块axios，可以上网了解，总用到
var axios = require('axios');

const app = express();

//全局方法：统一格式化返回值
function formatReq(code, msg, data) {
    return {
        code: code,
        data: data,
        message: msg
    }
}

//定义全局的空对象，用来承载结果对象
var faceId = "";
var faceData = {};

//数据库相关操作
//引入
var db = require('../DB/db');
//引入数据库操作代码
var faceSql = require('../DB/faceSql');

//这个是具体的功能路由，也就是一个后端API，在这里进行数据的处理，每一个调用这个API的方法都有两个参数req和res，request就是请求，res是response响应
var faceImgUpload = faceRouter.post('/upload/faceImg', (req, res) => {
    //利用multiparty中间件获取文件数据
    let uploadDir = '../picture/faceImgs' //作为中间目录，待会要重命名文件到指定目录的
    console.log('进入到faceImg的upload')
    let form = new multiparty.Form()
    form.uploadDir = uploadDir
    form.keepExtensions = true; //是否保留后缀
    form.parse(req, function(err, fields, files) { //fields 就是formData提交的表单数据对象，files表示你提交的文件对象
        console.log("上传文件", fields)
        //fields.file[0]是 [object Object]
        console.log("上传文件的files", files)
        //这里是save_path 就是前端传回来的 path 字段，这个字段会被 multiparty 中间件解析到 fields 里面 ，这里的 fields 相当于 req.body 的意思
        let save_path = '/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node/picture/faceImgs/'
        faceId = parseInt(fields.id)
        //进行上传数据库操作
        console.log("上传数据库id", faceId)
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
                            console.log("正脸照片重命名成功")
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

var faceLelftImgUpload = faceRouter.post('/upload/faceLeftImg', (req, res) => {
    //利用multiparty中间件获取文件数据
    let uploadDir = '../picture/faceLeftImgs' //作为中间目录，待会要重命名文件到指定目录的
    let form = new multiparty.Form()
    form.uploadDir = uploadDir
    form.keepExtensions = true; //是否保留后缀
    form.parse(req, function(err, fields, files) { //fields提交的表单数据对象，files表示你提交的文件对象
        console.log("上传文件", fields)
        console.log("files", files)
        //这里是save_path 就是前端传回来的 path 字段，这个字段会被 multiparty 中间件解析到 fields 里面 ，这里的 fields 相当于 req.body 的意思
        let save_path = '/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node/picture/faceLeftImgs/'
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
                            console.log("左侧侧脸图片重命名成功")
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

var faceRightImgUpload = faceRouter.post('/upload/faceRightImg', (req, res) => {
    //利用multiparty中间件获取文件数据
    let uploadDir = '../picture/faceRightImgs' //作为中间目录，待会要重命名文件到指定目录的
    let form = new multiparty.Form()
    form.uploadDir = uploadDir
    form.keepExtensions = true; //是否保留后缀
    form.parse(req, function(err, fields, files) { //fields提交的表单数据对象，files表示你提交的文件对象
        console.log("上传文件", fields)
        console.log("files", files)
        //这里是save_path 就是前端传回来的 path 字段，这个字段会被 multiparty 中间件解析到 fields 里面 ，这里的 fields 相当于 req.body 的意思
        let save_path = '/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node/picture/faceRightImgs/'
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
                            console.log("右侧侧脸图片重命名成功")
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

var resFaceAccept = faceRouter.post('/resFace', function (req, res){
    //.......
    //22.4.12 貌似这个面诊不会往api发送结果，这块可能需要在前端发送给后端，然后插进数据库
    //.........
    //进行结果确认响应 面诊不需要该字段
    // res.send({result: "SUCCESS"})
    //req就是psot过来的全部数据，包括headers头信息，body里的
    //22.4.16
    //如果从前端传进来数据，需要zyId，以及faceData
    console.log('接收的数据', req.body)
    //将问诊结果存入全局变量handData
    faceId = req.body.zyId
    faceData = req.body.result
    //这块要测试看下faceData是不是问诊结果 或者是 data.faceFinal
//    console.log('问诊结果', faceData)


    //数据库插入数据操作
    var faceTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');

    //动态参数
    const sqlParams = [faceId, faceTime, faceData]
    console.log('要插入数据库的参数', sqlParams)
    //sql操作
    db.query(faceSql.insert, sqlParams,  (err, res) =>{
        if(err){
            console.log(err)
        } else {
            console.log(res)
            console.log('插入成功')
        }
    })

})

var resFaceShow = faceRouter.get('/resFand', function (req, res){
    //将当前handId用户的问诊记录显示出来
    // 22.4.16
    // 面诊不需要了
    res.send({data: faceData})
    console.log('本次问诊结果展示', faceData)
})

//上传图片到服务器后，给予网络地址
var faceImgShow = faceRouter.get('/picture/faceImgs/*', function(req, res){
    res.sendFile( "/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node" + "/" + req.url );
    console.log(req.url);
})
var faceLeftImgShow = faceRouter.get('/picture/faceLeftImgs/*', function(req, res){
    res.sendFile( "/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node" + "/" + req.url );
    console.log(req.url);
})
var faceRightImgShow = faceRouter.get('/picture/faceRightImgs/*', function(req, res){
    res.sendFile( "/home/zp/OldHome/DXY_code/CVofSSE-master/zy_node" + "/" + req.url );
    console.log(req.url);
})

//历史问诊记录
var resFaceHistory = faceRouter.get('/resFaceHistory', function (req, res){
    //查询指定id的用户历史问诊
    faceId = 21
    console.log("历史的id", req.body);
    console.log("用户的id:", faceId)
    //数据库操作
    const sqlParams = [faceId]
    db.query(faceSql.getHistoryById, sqlParams, (error, results) =>{
        if(error){
            console.log(error)
        } else {
            results = JSON.parse(JSON.stringify(results))
            res.send(results)
            console.log("这里是results:", results)
        }
    })

})

//导出
module.exports = faceImgUpload, faceLelftImgUpload, faceRightImgUpload, resFaceAccept, resFaceShow, faceImgShow, faceLeftImgShow,faceRightImgShow, resFaceHistory




