const express = require("express")
const router = express.Router()
// const ejs = 

// const DB = require("../../../mongodb.js")

// previous

router.get('/',function(request,response){
    console.log(request.session.pageIndex)
    // console.log(request.cookies.pageIndex)
    let pageIndex = request.session.pageIndex
    if(pageIndex <= 1){
        // 说明这是第一页，因此没必要翻页
        request.session.pageIndex = 1
        response.send("<script>location.href='/product'</script>")
        return false
    }else{
        request.session.pageIndex = pageIndex - 1
        // console.log("<script>location.href='/product?pageIndex=<%= request.session.pageIndex %>';</script>")
        response.send("<script>location.href='/product?pageIndex="+ request.session.pageIndex+ "';</script>")
    }
    // response.send("这是上一页")
})

module.exports = router