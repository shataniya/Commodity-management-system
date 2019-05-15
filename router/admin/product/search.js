const express = require("express")
const router = express.Router()
const DB = require("../../../mongodb.js")
const session = require("express-session")
// const bodyParser = require("body-parser")

// router.use(bodyParser())

// 商品搜索
router.get('/',function(request,response){
    console.log("显示页码数")
    console.log(request.session.pageIndex)

    // 查看搜索数据库还在不在
    console.log("查看数据库在不在")
    // console.log(request.session.dbName)
    // console.log(!!request.session.dbName)
    DB.drop("searchProduct")


    console.log(request.query.name)
    // 获取搜索的名称
    const name = request.query.name
    let newdata = []
    DB.findAll('products',{},function(error,data){
        if(error){
            console.log("商品查询失败")
            console.log(error)
            return false
        }else{
            console.log("商品查询成功")
            // console.log(data)
            console.log(data.length)

            const regex = new RegExp(name)
            console.log(regex)
            data.map(el=>{
                // el.name.includes(name)
                // console.log(el.proName)
                // console.log(DB.regex(name).test(el.proName))
                // console.log(regex.test(el.proName))
                if(regex.test(el.proName)){
                    // console.log(el)
                    newdata.push(el)
                    // console.log(newdata)
                }
            })

            const dbName = 'searchProduct'

            // 这里就是精髓，把挑选出来的 data 放到 session 里边保存
            // request.session.newdata = newdata   

            // 把搜索数据库的名称放到 session 里边
            request.session.dbName = dbName

            console.log(dbName)
            console.log(newdata.length)

            DB.insertAll(dbName,newdata,function(error,result){
                if(error){
                    console.log("商品向搜索数据库保存失败")
                    // console.log(error)
                    return false
                }else{
                    console.log("商品向数据库保存成功")
                    // console.log(result)
                    // console.log(newdata)
                    // request.session.pageIndex = 1
                    response.send("<script>location.href='/product';</script>")

                    // UnhandledPromiseRejectionWarning: MongoError: topology was destroyed

                }
            })
        }
    })
    // response.send("ok")
})


module.exports = router