const express = require("express")
const router = express.Router()

const DB = require("../../../mongodb.js")



// next

router.get('/',function(request,response){
    console.log(request.session.dbName)
    const database = request.session.dbName ? request.session.dbName : 'product'
    console.log(request.session.pageIndex)
    const pageIndex = request.session.pageIndex
    console.log(pageIndex+1)
    DB.find(database,{},function(error,data){
        if(error){
            console.log("数据获取失败")
            console.log(error)
            return false
        }else{
            console.log("获取数据成功")
            // console.log(data)
            console.log(data.length)

            if(data.length <= 0){
                // 说明下一页没有了
                response.send("<script>location.href='/product?pageIndex="+ request.session.pageIndex +"';</script>")
            }else{
                // 说明下一页还有
                request.session.pageIndex = pageIndex+1
                response.send("<script>location.href='/product?pageIndex="+ request.session.pageIndex +"';</script>")
            }
        }
    },pageIndex+1)
    // response.send("ok")
})


module.exports = router