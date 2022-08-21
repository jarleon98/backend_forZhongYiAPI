//js引入模块，需要先npm install 该模块， 然后在程序里require引入

//引入express框架，这个可以具体网上了解下
var express = require('express');
//引入fs模块，主要是使用文件读取和写入功能
var fs = require('fs');
//引入path模块，主要是使用文件的路径
var path = require('path');
//bodyParser和multiparty，主要是处理请求体中的body，具体情况具体分析
var bodyParser = require('body-parser');
var multiparty = require('multiparty')

//app对象 网站服务器对象，这一步是利用express框架生成一个应用对象，相当于建立一个网页
var app = express();

//app.use 就是使用一些中间件，具体上网搜搜了解
// 处理请求头、跨域问题，就是前后端交互要处理的问题
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
//app.all是对所有的路径进行处理，可以理解为输入的网址
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    next();
});



//引入路由模块，就是另外三个子模块，这里只是调用声明下
var handRouter = require("./handRouter")
var faceRouter = require("./faceRouter")
var tongueRouter = require("./tongueRouter")

//图片上传路由
//请求方法分为post、get、put和delete 可以理解为添加，获取，修改和删除
//手诊，举例来说发送一个post请求，当url路径为http://39.99.214.230:3001/upload/leftHand，就走39行的代码
app.post("/upload/leftHand", handRouter)
app.post("/upload/rightHand", handRouter)
//面诊
app.post("/upload/faceImg", faceRouter)
app.post("/upload/faceLeftImg", faceRouter)
app.post("/upload/faceRightImg", faceRouter)
//舌诊
app.post("/upload/tongueTop", tongueRouter)
app.post("/upload/tongueBottom", tongueRouter)

//中医平台发送信息路由
app.post("/resHand", handRouter)
app.post("/resFace", faceRouter)
app.post("/resTongue", tongueRouter)


//获取诊断信息路由,面诊直接从前端获取了，这个接口暂时用不上
app.get("/resHand", handRouter)
app.get("/resFace", faceRouter)
app.get("/resTongue", tongueRouter)

//问诊历史路由
app.get("/resHandHistory", handRouter)
app.get("/resFaceHistory", faceRouter)
app.get("/resTongueHistory", tongueRouter)

//页面网络地址展示路由
app.get("/picture/leftHands/*", handRouter)
app.get("/picture/rightHands/*", handRouter)
app.get("/picture/faceImgs/*", faceRouter)
app.get("/picture/faceLeftImgs/*", faceRouter)
app.get("/picture/faceRightImgs/*", faceRouter)
app.get("/picture/tongueTops/*", tongueRouter)
app.get("/picture/tongueBottoms/*", tongueRouter)

//这里就是express框架的监听端口，意思就是我开放一个端口号可以让别人访问到
app.listen(3001);