const express = require("express")
const router = express.Router()

const ejs = require("ejs")
const fs = require("fs")
const md5 = require("md5-node")
const multiparty = require("multiparty")

const session = require("express-session")

const DB = require("../../mongodb.js")
const bodyParser = require("body-parser")

const previous = require("./product/previous.js")
const next = require("./product/next.js")
const search = require("./product/search.js")

router.use('/previous',previous)

router.use('/next',next)

router.use('/search',search)

// /product
router.get('/',function(request,response){
    // console.log(request.session)

    console.log(request.session.dbName)

    const dbName = request.session.dbName

    const database = dbName ? dbName : 'products'
    console.log(database)

    // console.log(request.session.newdata)
    // const newdata = request.session.newdata
    // console.log(newdata.length)

    // console.log(newdata.parseJSON())
    console.log(request.query.pageIndex) // undefined
    console.log(request.session.pageIndex)
    const pageIndex = request.query.pageIndex ? request.query.pageIndex : request.session.pageIndex
    DB.find(database,{},function(error,data){
        if(error){
            console.log(error)
            return false
        }else{
            // console.log(data)
            response.render('product.html',{
                // list: newdata.length ? newdata : data
                list:data
            })
        }
    },pageIndex)
})


// /product/productdelete

router.get('/productdelete',function(request,response){
    // console.log(request.query.id)
    const id = request.query.id
    DB.delete('products',{ "_id":new DB.ObjectID(id) },function(error,result){
        if(error){
            console.log("商品删除失败")
            console.log(error)
            return false
        }else{
            console.log("商品删除成功")
            response.send("<script>alert('成功删除商品~~');location.href='/product'</script>")
        }
    })
})



// /product/productadd

router.get('/productadd',function(request,response){
    // response.send("增加商品")
    response.render('productadd.html')
})

// /product/doProductAdd

router.post('/doProductAdd',function(request,response){

    // 获取表单数据，以及post过来的图片
    let form = new multiparty.Form()

    // 路径这个地方的设置要注意：这是绝对路径，使用绝对路径
    // form.uploadDir = __dirname+'/public/upload'
    form.uploadDir = 'upload'
    // form.
    form.parse(request,function(error,fields,files){
        if(error){
            console.log(error)
        }else{
            // console.log(fields) // 获取表单的数据
            // console.log(files) // 图片上传成功返回的数据

            const proName = fields.proName[0]
            const procost = fields.procost[0]
            const propostage = fields.propostage[0]
            const prodes = fields.prodes[0]
            const proImg = files.proImg[0].path

            // console.log(proImg)

            DB.insert('products',{ proName,procost,propostage,prodes,proImg },function(error,result){
                if(error){
                    console.log("商品添加失败")
                    console.log(error)
                    return false
                }else{
                    console.log("商品添加成功")
                    response.send("<script>alert('商品添加成功~~');location.href='/product'</script>")
                }
            })
        }
    })

})


// /product/productedit

router.get('/productedit',function(request,response){
    const id = request.query.id
    // console.log(id)
    // console.log(new DB.ObjectID(id))
    DB.find('products',{ "_id":new DB.ObjectID(id) },function(error,data){
        if(error){
            console.log("商品获取失败")
            console.log(error)
            return false
        }else{
            console.log("商品获取成功")
            // console.log(data)
            response.render("productedit.html",{
                // 注意：这里必须是data[0]，因为返回的data是一个数组，不可以直接使用
                item:data[0]
            })
        }
    })
    
})


// /product/doProductEdit

router.post('/doProductEdit',function(request,response){
    const form = new multiparty.Form()
    form.uploadDir = 'upload'
    form.parse(request,function(error,fields,files){
        if(error){ // 如果发生错误，说明 数据获取失败
            console.log("数据获取失败")
            console.log(error)
            return false
        }else{ // 说明 数据获取成功
            // console.log(fields)
            // console.log(files)
            
            const number = fields.number[0]
            const proName = fields.proName[0]
            const procost = fields.procost[0]
            const propostage = fields.propostage[0]
            const prodes = fields.prodes[0]
            const proImg = files.proImg[0].path
            const originalFilename = files.proImg[0].originalFilename

            const proImgReg = /\.jpg$/
            // console.log(proImgReg.test(proImg)) 

            // console.log(procost)
            // console.log(proImg)

            DB.update('products',{ "_id":new DB.ObjectID(number) },originalFilename ? { proName,procost,propostage,prodes,proImg }:{ proName,procost,propostage,prodes },function(error,result){
                if(error){
                    console.log("数据更新失败")
                    console.log(error)
                    return false
                }else{
                    console.log("数据更新成功")
                    
                    fs.unlink(proImg,function(error,result){
                        if(error){
                            console.log("图片删除失败")
                            console.log(error)
                            return false
                        }else{
                            console.log("图片删除成功")
                        }
                    })
                    response.send("<script>alert('商品数据修改成功');location.href='/product'</script>")
                }
            })

        }
    })
    
})


module.exports = router


