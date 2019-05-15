const express = require("express")
const router = express.Router()

const ejs = require("ejs")
const fs = require("fs")
const md5 = require("md5-node")
const multiparty = require("multiparty")

const DB = require("../../mongodb.js")
const bodyParser = require("body-parser")


// /login

router.get('/',function(request,response){
    response.render('login.html')
})

// /login/register

router.get('/register',function(request,response){
    response.render('register.html')
})


// 实现注册功能
// /login/doRegister

router.post('/doRegister',function(request,response){
    console.log(request.body)

    DB.insert('user',{ name:request.body.name,password:md5(request.body.password) },function(error,result){
        if(error){
            console.log("数据添加失败")
            console.log(error)
            response.send("<script>alert('注册失败');location.href='/register'</script>")
            return false
        }else{
            console.log("数据添加成功")
            response.redirect('/login')
        }
    })
})


// 实现登录功能
// /login/doLogin

router.post('/doLogin',function(request,response){
    console.log(request.body)

    DB.find('user',{ name:request.body.name,password:md5(request.body.password) },function(error,result){
        if(error){
            console.log(error)
            return false
        }else{
            console.log(result)

            // 如果长度为0，说明没有
            console.log(result.length)
            if(result.length > 0){
                // 长度为0 说明没有数据
                console.log("登录成功")
                response.redirect('/product')
                // response.send("抱歉，你好没有注册")
            }else{
                console.log("登录失败")
                response.send("<script>alert('登陆失败');location.href='/login';</script>")
            }   

        }
    })
})


// /login/logout

router.get('/logout',function(request,response){
    response.send("退出登录")
})


module.exports = router