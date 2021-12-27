//注册的用户信息
const User = require('../models/userModel');
const { commonResponse } = require('./utils.js');
const express = require('express');
const router = express.Router();

//解析post请求主体的键值对
const bodyParser = require('body-parser');

// 解析post请求中的xhr.setRequestHeader( 'Content-Type','application/x-www-form-urlencoded')
router.use(bodyParser.urlencoded({ extended: true }))
//parse application/json
router.use(bodyParser.json())


//注册
router.post('/usersRegister',function(req, res){
    let { username, password } = req.body;
    console.log('注册')
    //先验证用户名是否存在
    User.findOne({
        username
    },function(err, adventure){
        if(err){//错误
            commonResponse(res, false, null, undefined, err);
            return;
        }
        //返回给前端
        if(adventure){
            commonResponse(res, false, null, undefined, '用户名已存在');
        }else{
            User.create({
                username,
                password,
            },function (err,data) {
                commonResponse(res, !err, data, '注册成功');
            });
        }
    })
});

//登录
router.post('/userLogin',function(req, res){
    let { username, password } = req.body;
    User.findOne({
        username
    },function(err,adventure){
        if(err){
            commonResponse(res, false, null, undefined, err);
            return;
        }
        if(!adventure){
            commonResponse(res, false, null, undefined, '用户名不存在');
        }else{
            User.findOne({
                username,
                password
            },function(error,data){
                if(error){
                    commonResponse(res, false, null, undefined, err);
                    return;
                }
                if(data){
                    commonResponse(res, true, data, '登录成功');
                }else{
                    commonResponse(res, false, data, '密码错误');
                }
            })
        }
    })
});

module.exports = router;
