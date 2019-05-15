const MongoClient = require("mongodb").MongoClient
const DBurl = 'mongodb://127.0.0.1:10086'

// 获取 objectID
const ObjectID = require("mongodb").ObjectID
// 获取之后还要记得暴露 objectID
exports.ObjectID = ObjectID

function __connectdb(callback){
    MongoClient.connect(DBurl,{ useNewUrlParser:true },function(error,db){
        if(error){
            console.log(error)
            return false
        }else{
            callback(db)
            db.close() // 关闭数据库
        }
    })
}

// 封装一个查询数据的方法

// 查询方法
exports.find = function(collection,data,callback,pageIndex=1){
    __connectdb(function(db){
        db.db('demo1').collection(collection).find(data).limit(5).skip(5*(pageIndex-1)).toArray(function(error,data){
            callback(error,data)
        })
    })
}

exports.findAll = function(collection,data,callback){
    __connectdb(function(db){
        db.db('demo1').collection(collection).find(data).toArray(function(error,data){
            callback(error,data)
        })
    })
}


// 插入方法
exports.insert = function(collection,data,callback){
    __connectdb(function(db){
        db.db('demo1').collection(collection).insertOne(data,function(error,result){
            callback(error,result)
        })
    })
}

exports.insertAll = function(collection,data,callback){
    __connectdb(function(db){
        db.db('demo1').collection(collection).insertMany(data,function(error,result){
            callback(error,result)
        })
    })
}


// 修改方法
exports.update = function(collection,data1,data2,callback){
    __connectdb(function(db){
        db.db('demo1').collection(collection).updateOne(data1,{ $set:data2 },function(error,data){
            callback(error,data)
        })
    })
}

// 删除方法
exports.delete = function(collection,data,callback){
    __connectdb(function(db){
        db.db('demo1').collection(collection).deleteOne(data,function(error,data){
            callback(error,data)
        })
    })
}


exports.drop = function(collection){
    __connectdb(function(db){
        db.db('demo1').collection(collection).drop()
    })
}


exports.regex = function(string){
    return new RegExp(string)
}
