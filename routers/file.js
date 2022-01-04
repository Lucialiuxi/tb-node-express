//项目文件信息
let FileInfo = require('../models/fileItemInfoModel');
let express = require('express');
var router = express.Router();
const { commonResponse } = require('./utils.js');
const { v1: uuidv1 } = require('uuid');

//解析post请求主体的键值对
const bodyParser = require('body-parser');

// 解析post请求中的xhr.setRequestHeader( 'Content-Type','application/x-www-form-urlencoded')
router.use(bodyParser.urlencoded({ extended: true }))
//parse application/json
router.use(bodyParser.json())

//新建文件夹
router.post('/createFile',function(req, res){
    const { username, fileName, fileAbstract } = req.body;
    const createTime = new Date().getTime();
    if(fileName){
        FileInfo.create({
            username,
            fileName,
            fileAbstract,
            fileId: uuidv1(),
            star: false,
            inRecycleBin: false,
            createTime: new Date().getTime(),
        },function(err,data){
            if(err){//错误
                commonResponse(res, false, null, undefined, err);
            }else{
                commonResponse(res, true, data, '新建项目成功');
            }
        });
    }

});

//进入或者刷新大图标文件区的时候，请求文件数据
router.post('/findAFileInfoServer',function(req,res,next){
    //前端发送过来的用户名存在，就查找用户名对应的数据
    let fileId = req.body.fileId;
    if(fileId){
        FileInfo.find({ fileId },function(err,data){
            if(err){//错误
                commonResponse(res, false, null, undefined, err);
            }else{
                commonResponse(res, true, data, '获取数据成功');
            }
        })
    }
    
});

//进入或者刷新大图标文件区的时候，请求文件数据
router.post('/allFilesInfo',function(req, res){
    //前端发送过来的用户名存在，就查找用户名对应的数据
    let { username } = req.body;;
    if(username){
        FileInfo.find({
            username,
        },function(err,data){
            if(err){
                commonResponse(res, false, null, undefined, err);
            }else{
                commonResponse(res, true, data, '获取数据成功');
            }
        });
    }
});

//修改大图标文件的信息 
router.post('/modifyFileInfo',function(req, res){
    let { fileId, username, fileAbstract, fileName } = req.body;
    if(fileId){
        FileInfo.findOneAndUpdate(
        { fileId, username },
        { fileName, fileAbstract},
        function(err, data){
            if(err){
                commonResponse(res, false, null, undefined, err);
            } else {
                commonResponse(res, true, data, '修改文件信息成功');
            }
        })

    }
});

//切换标星
router.post('/toggleFileStar',function(req, res){
    let { fileId, username, star } = req.body;
    if(fileId){
        FileInfo.findOneAndUpdate({
            fileId,
            username,
        },{
            star
        },function(err,data){
            if(err){
                commonResponse(res, false, null, undefined, err);
            } else {
                commonResponse(res, true, data, `切换标星成功${req.body.star}`);
            }
        })
    }
});

// 移动文件到回收站 / 从回收站撤销还原
router.post('/moveFileToRecycleBin',function(req, res){
    let { fileId, username, inRecycleBin } = req.body;
    if(fileId){
        FileInfo.findOneAndUpdate({
            fileId,
            username,
        },{ inRecycleBin },function(err, data){
            if(err){
                commonResponse(res, false, null, undefined, err);
            } else {
                commonResponse(res, true, data, '移动文件到回收站成功');
            }
        })
    }
});

// 从回收站删除一个项目文件夹
router.post('/deleteAFlie',function(req,res){
    let { fileId, username } = req.body;
    if(fileId){
        FileInfo.findOneAndDelete({
            fileId,
            username,
            inRecycleBin: true,
        },function(err,data){
            if(err){
                commonResponse(res, false, null, undefined, err);
            } else {
                commonResponse(res, true, data, '文件删除成功');
            }
        })
    }
});

module.exports = router;
