let express = require('express');
let app = express();
let now="/";

let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use("/pages",express.static("./pages"));
app.use("/static",express.static("./public"));

app.use(bodyParser.urlencoded({extended:false}));


//cookie
let cookieParser = require('cookie-parser');    //引入模块
app.use(cookieParser('webAssign'));        //挂载中间件，可以理解为实例化



//session
const session = require('express-session');// session 插件
const FileStore = require('session-file-store')(session);

app.use(session({

    secret: 'webAssign',

    name: 'SESSION', // 这里的name值得是cookie的name，默认cookie的name是：connect.sid

    cookie: {maxAge: 3*60*1000,httpOnly:true}, // 设置maxAge是3min，即3min后session和相应的cookie失效过期

    resave: true, // 是否允许session重新设置

    rolling: true, // 是否按照原设定的maxAge值重设session同步到cookie中

    saveUninitialized: false, // 是否设置session在存储容器中可以给修改

    store: new FileStore()

}));

app.use(function (req, res, next) {
    if(req.path!="/favicon.ico"){
        let temp=req.path;
        console.log('here:'+temp);
        if(temp.substr(0,7).toLowerCase()=="/pages/"){
            console.log('send');
            return res.send("非法访问！");
        }else{
            if(!req.session.userName&&req.path!='/login'&&req.path!="/signup"&&req.path!='/logout'&&req.path!='/searchAccount'&&req.path!='/findPassword'&&req.path!='/resetPassword'){
                console.log('redirect /login');
                res.redirect('/login');
            }
            else{
                next();
            }
        }
    }



});

// 获取主页
app.get('/', function (req, res) {
    console.log(req.session.userName);
    res.sendFile(__dirname+'/pages/pics.html');
    now="pics";
});
//登录
app.get('/login', function (req, res) {
    res.sendFile(__dirname+'/pages/login.html');
    now="login";
});
//注册
app.get('/signup', function (req, res) {
    res.sendFile(__dirname+'/pages/signup.html');
    now="signup";
});
app.get('/findPassword', function (req, res) {
    res.sendFile(__dirname+'/pages/findPassword.html');
    now="findpw";
});
app.get('/resetPassword', function (req, res) {
    if(now=="findpw"||now=="resetpw"){
        res.sendFile(__dirname+'/pages/resetPassword.html');
        now="resetpw";
    }else{
        res.send("非法访问！");
    }

});
//编辑
app.get('/editImg', function (req, res) {
    if(now=="pics"||now=="editImg"){
        res.sendFile(__dirname+'/pages/editImg.html');
        now="editImg";
    }else{
        res.send("非法访问！");
    }
});
//标签
app.get('/tags', function (req, res) {
    if(now=="pics"||now=="tags"){
        res.sendFile(__dirname+'/pages/tags.html');
        now="tags";
    }else{
        res.send("非法访问！");
    }

});

app.get('/logout', function (req, res) {
    console.log('try logout now');
    req.session.destroy(function(err) {
        if (err) {
            console.error(err);
        } else {
            res.clearCookie('SESSION');
            res.send(true);
        }
    });
});
// app.get('/', function(req, res, next) {
//     if(req.session.sign){
//         console.log(req.session);
//     }
//     else{
//         //未登陆过
//         res.redirect('/pages/login.html');
//     }
//
// });

let mysql  = require('mysql');

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '981018',
    port: '3306',
    database: 'webassign',
});

connection.connect();


let server = app.listen(8082, function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});

let picIndex=0;
let  sql = "SELECT picture_id FROM pictures order by picture_id DESC limit 0,1";
console.log(sql);
connection.query(sql,function (err, result) {
    if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
    picIndex=result[0]['picture_id'];
});

const crypto = require("crypto");

app.post('/login',function(request,response)
{
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(request.body.password).digest("hex");
    let  sql = "SELECT * FROM users WHERE account=\'"+request.body.account+"\' AND user_password=\'"+newPas+"\'";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        if(result.length==0){
            response.send(false);
        }else{
            //request.session.destroy();
            request.session.userName = request.body.account;
            console.log(request.session.userName);
            response.send(true);

            // response.cookie('user', {
            //         id: 1,
            //         name: 'ruidoc'
            //     }, {
            //         maxAge: 900000
            //     }
            // );
            //
            // //获取设置的cookie
            // let user = request.cookies.user
        }
    });
   // connection.end();
});

app.post('/searchAccount',function(request,response)
{
    let  sql = "SELECT * FROM users WHERE account=\'"+request.body.account+"\'";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        if(result.length==0){
            response.send(false);
        }else{
            response.send(true);
        }
    });
    // connection.end();
});

app.post('/signup',function(request,response)
{
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(request.body.password).digest("hex");
    let  sql = "INSERT INTO users (account, user_password, phone) VALUES (\'"+request.body.account+"\', \'"+newPas+"\', \'"+request.body.phone+"\')";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        if(result){
            response.send(true)
        }else{
            response.send(false)
        }
    });
    // connection.end();
});

app.post('/resetPassword',function(request,response)
{
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(request.body.password).digest("hex");
    let  sql = "UPDATE users SET user_password=\'"+newPas+ "\' WHERE account=\'"+request.body.account+"\';";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        if(result){
            response.send(true)
        }else{
            response.send(false)
        }
    });
    // connection.end();
});


let multer  = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/img');
    },
    filename: function (req, file, cb){
        picIndex++;
        cb(null, picIndex+'.png');
    }
});

let upload = multer({
    storage: storage
});

app.post('/uploadFile', upload.single('file'), function (req, res) {
    let pi=picIndex;
    console.log(req.file.originalname);
    let url = 'http://' + req.headers.host + '/static/img/' + req.file.originalname;
    res.json({
        code : 200,
        data : url
    });
    addPic2DB('/static/img/'+pi+'.png');
});

app.post('/uploadFiles', upload.array('file',5), function (req, res) {
    let pi=picIndex;
    let urls=new Array();
    for(let i=0;i<req.files.length;i++){
        let temp = 'http://' + req.headers.host + '/static/img/' + req.files[i].originalname;
        urls.push(temp);
        addPic2DB('/static/img/'+(pi-req.files.length+1+i)+'.png');
    }
    console.log(urls);
    res.json({
        code : 200,
        data : urls
    })
});

function addPic2DB(picUrl){
    let  sql = "INSERT INTO pictures (picUrl, date) VALUES (\'"+picUrl+"\', date_format(sysdate(),'%Y-%m-%d'))";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
    });
}

app.post('/searchTags',function(request,response)
{
    let  sql = "SELECT content, popularity FROM tags WHERE picture_id=\'"+request.body.pic_id+"\'";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        response.send(result);
    });

    // let data={tags: [
    //         {content: "熊猫", popularity: 112},
    //         {content:"国宝",popularity:89}
    //     ]};
    // response.send(data) ;

});

app.post('/loadPics',function(request,response) {
    let pics=new Array();
    let  sql = "select pictures.picture_id, pictures.picUrl, pictures.date, sum(popularity) as tagNum from pictures, tags where pictures.picture_id=tags.picture_id group by pictures.picture_id " +
        "union select pictures.picture_id, pictures.picUrl, pictures.date, 0 as tagNum from pictures where picture_id not in " +
        "(select pictures.picture_id from pictures, tags where pictures.picture_id=tags.picture_id)";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        pics=result;
        for(let i=0;i<pics.length;i++){
            let pic_id=pics[i]['picture_id'];
            sql="SELECT content FROM tags where picture_id="+pic_id+" ORDER BY popularity DESC limit 0,3;" ;
            connection.query(sql,function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                console.log('--------------------------SELECT----------------------------');
                console.log(result);
                console.log('------------------------------------------------------------\n\n');
                let temp="";
                for(let j=0;j<result.length;j++){
                    temp=temp+result[j].content+" ";
                }
                pics[i]['pts']=temp;
                if(i==pics.length-1){
                    response.send(pics);
                }
            });
        }
    });

    // connection.end();
});

app.post('/getPicIndex',function(request,response)
{
    let  sql = "SELECT picture_id FROM pictures order by picture_id DESC limit 0,1";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        response.send(result)
    });
    // connection.end();
});

// app.post('/addTag',function(request,response)
// {
//     let  sql = "SELECT * FROM tags WHERE content=\'"+request.body.content+"\' and picture_id="+request.body.pic_id+";";
//     console.log(sql);
//     connection.query(sql,function (err, result) {
//         if(err){
//             console.log('[SELECT ERROR] - ',err.message);
//             return;
//         }
//
//         console.log('--------------------------SELECT----------------------------');
//         console.log(result);
//         console.log('------------------------------------------------------------\n\n');
//         if(result.length!=0){
//             sql = "UPDATE tags SET popularity=popularity+1 WHERE content=\'"+request.body.content+"\' and picture_id="+request.body.pic_id+";";
//             console.log(sql);
//             connection.query(sql,function (err, result) {
//                 if(err){
//                     console.log('[SELECT ERROR] - ',err.message);
//                     return;
//                 }
//
//                 console.log('--------------------------SELECT----------------------------');
//                 console.log(result);
//                 console.log('------------------------------------------------------------\n\n');
//                 if(result){
//                     recordTag(request.body.account, request.body.pic_id);
//                     response.send(true);
//                 }else{
//                     response.send(false)
//                 }
//             });
//         }else{
//             sql = "INSERT INTO tags (content, popularity, picture_id) VALUES (\'"+request.body.content+"\', 1, "+request.body.pic_id+")";
//             console.log(sql);
//             connection.query(sql,function (err, result) {
//                 if(err){
//                     console.log('[SELECT ERROR] - ',err.message);
//                     return;
//                 }
//
//                 console.log('--------------------------SELECT----------------------------');
//                 console.log(result);
//                 console.log('------------------------------------------------------------\n\n');
//                 if(result){
//                     recordTag(request.body.account, request.body.pic_id);
//                     response.send(true);
//                 }else{
//                     response.send(false)
//                 }
//             });
//         }
//     });
//
// });

function recordTag(account, pic_id) {
    let  sql = "SELECT num FROM records WHERE account=\'"+account+"\' and picture_id="+pic_id+";";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        if(result.length!=0){
            sql = "UPDATE records SET num=num+1 WHERE account=\'"+account+"\' and picture_id="+pic_id+";";
            console.log(sql);
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }

                console.log('--------------------------SELECT----------------------------');
                console.log(result);
                console.log('------------------------------------------------------------\n\n');
            });
        }else{
            sql = "INSERT INTO records (account, num, picture_id) VALUES (\'"+account+"\', 1, "+pic_id+")";
            console.log(sql);
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }

                console.log('--------------------------SELECT----------------------------');
                console.log(result);
                console.log('------------------------------------------------------------\n\n');
            });
        }
    });
}

app.post('/countRecords',function(request,response)
{
    let  sql = "SELECT num FROM records WHERE account=\'"+request.body.account+"\' and picture_id="+request.body.pic_id+";";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        if(result.length==0||result[0]['num']<3){
            response.send(false);
        }else{
            response.send(true);
        }
    });

});

app.post('/tagsRecommend',function(request,response)
{
    let  sql = "SELECT distinct content FROM tags WHERE content LIKE '%"+request.body.content+"%'";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        response.send(result);
    });

});

app.post('/searchPics',function(request,response)
{
    let pics=new Array();
    let  sql = "select pictures.picture_id, pictures.picUrl, pictures.date, sum(popularity) as tagNum from pictures, tags where pictures.picture_id=tags.picture_id and tags.content like '%"+request.body.key+"%' group by pictures.picture_id ";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        pics=result;
        for(let i=0;i<pics.length;i++){
            let pic_id=pics[i]['picture_id'];
            sql="SELECT content FROM tags where picture_id="+pic_id+" ORDER BY popularity DESC limit 0,3;" ;
            connection.query(sql,function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                console.log('--------------------------SELECT----------------------------');
                console.log(result);
                console.log('------------------------------------------------------------\n\n');
                let temp="";
                for(let j=0;j<result.length;j++){
                    temp=temp+result[j].content+" ";
                }
                pics[i]['pts']=temp;
                if(i==pics.length-1){
                    response.send(pics);
                }
            });
        }
    });

});



var request=require('request');

app.post('/getWeather',function(req,res)
{
    let e=request({url:'https://restapi.amap.com/v3/ip?key=3ce0fdf7d8ac0ce02bb0ace205c463ae',
        method:'GET',
        headers:{'Content-Type':'text/json' }
    },function(error,response,body){
        if(!error && response.statusCode==200){
            let data=JSON.parse(body);
            console.log(data);
            let cc=data.adcode;
            e=request({url:'https://restapi.amap.com/v3/weather/weatherInfo?city='+cc+'&key=3ce0fdf7d8ac0ce02bb0ace205c463ae',
                method:'GET',
                headers:{'Content-Type':'text/json' }
            },function(error,response,body){
                if(!error && response.statusCode==200){
                    let data=JSON.parse(body);
                    console.log(data['lives'][0]);
                    res.send(data['lives'][0]);
                }
            });
        }
    });
});

app.post('/recommend',function(request,response) {
    let accounts=new Array();
    let records=new Array();
    let pics=new Array();
    let total=0;
    let  sql = "select r1.account, count(distinct r2.picture_id) as total, count(distinct r1.picture_id) as same  from records r1, records r2 " +
        "where r1.account=r2.account and r1.account<>\'"+request.body.account+"\' and r1.picture_id in " +
        "(select picture_id from records r3 where r3.account=\'"+request.body.account+"\') group by r1.account";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        accounts=result;

        let  sql = "select * from records where account<>\'"+request.body.account+"\' and picture_id not in " +
            "(select picture_id from records where account=\'"+request.body.account+"\');";
        console.log(sql);
        connection.query(sql,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }

            console.log('--------------------------SELECT----------------------------');
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            records=result;

            let  sql = "select count(*) as total from records where account=\'"+request.body.account+"\';";
            console.log(sql);
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }

                console.log('--------------------------SELECT----------------------------');
                console.log(result);
                console.log('------------------------------------------------------------\n\n');
                total=result[0]['total'];

                for(let i=0;i<accounts.length;i++){
                    accounts[i]['similarity']=accounts[i]['same']/(accounts[i]['total']+total-accounts[i]['same']);
                }
                for(let i=0;i<records.length;i++){
                    let index=findPic(pics, records[i]['picture_id']);
                    let score=accounts[findAcc(accounts, records[i]['account'])]['similarity']*records[i]['num'];
                    if(index==-1){
                        pics.push({'picture_id':records[i]['picture_id'], score:score});
                    }else{
                        pics[index]['score']=pics[index]['score']+score;
                    }

                }
                for(let i=0; i<pics.length; i++){
                    if(pics[i]['score']<0.6){
                        pics.splice(i,1);
                    }
                }
                for(let i=0; i<pics.length; i++){
                    for(let j=i; j<pics.length; j++){
                        if(pics[i]['score']<pics[j]['score']){
                            let temp=pics[j];
                            pics[j]=pics[i];
                            pics[i]=temp;
                        }
                    }
                }
                console.log(pics);
                response.send(pics);
            });
        });

    });

    // connection.end();
});

function findPic(pics, id) {
    for(let i=0;i<pics.length;i++){
        if(pics[i]['picture_id']==id){
            return i;
        }
    }
    return -1;

}

function findAcc(accs, acc) {
    for(let i=0;i<accs.length;i++){
        if(accs[i]['account']==acc){
            return i;
        }
    }
    return -1;

}

app.post('/getPicInfo',function(request,response)
{
    let pics=new Array();
    let  sql = "select pictures.picUrl, pictures.date, sum(popularity) as tagNum from pictures, tags where pictures.picture_id=tags.picture_id and pictures.picture_id="+request.body.pic_id+" group by pictures.picture_id ";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        pics=result;
        for(let i=0;i<pics.length;i++){
            let pic_id=pics[i]['picture_id'];
            sql="SELECT content FROM tags where picture_id="+request.body.pic_id+" ORDER BY popularity DESC limit 0,3;" ;
            connection.query(sql,function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                console.log('--------------------------SELECT----------------------------');
                console.log(result);
                console.log('------------------------------------------------------------\n\n');
                let temp="";
                for(let j=0;j<result.length;j++){
                    temp=temp+result[j].content+" ";
                }
                pics[i]['pts']=temp;
                if(i==pics.length-1){
                    response.send(pics);
                }
            });
        }
    });

});

var AipNlpClient = require("baidu-aip-sdk").nlp;

// 设置APPID/AK/SK
var APP_ID = "15048457";
var API_KEY = "RXTZ649B2ijFo9OhptQENBVn";
var SECRET_KEY = "4aKcVkalvIf94Xlap16nUjyLeMtrsVLA";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);

var HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({timeout: 5000});

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function(requestOptions) {
    // 查看参数
    console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
});

app.post('/addTag',function(request,response)
{
    let  sql = "SELECT content FROM tags WHERE picture_id="+request.body.pic_id+";";
    console.log(sql);
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        let ifCombine=false;
        let count=1;
        let len=result.length;
        for(let i=0;i<result.length;i++){
            console.log(result[i]['content']);
            client.simnet(request.body.content, result[i]['content']).then(function(result) {
                count++;
                console.log(result);
                let si=result.score;
                if(si>0.9){
                    ifCombine=true;
                    sql = "UPDATE tags SET popularity=popularity+1 WHERE content=\'"+result.texts.text_2+"\' and picture_id="+request.body.pic_id+";";
                    console.log(sql);
                    connection.query(sql,function (err, result) {
                        if(err){
                            console.log('[SELECT ERROR] - ',err.message);
                            return;
                        }

                        console.log('--------------------------SELECT----------------------------');
                        console.log(result);
                        console.log('------------------------------------------------------------\n\n');
                    });
                }

                if(count==len){
                    if(ifCombine){
                        recordTag(request.body.account, request.body.pic_id);
                        response.send(true);
                    }else{
                        sql = "INSERT INTO tags (content, popularity, picture_id) VALUES (\'"+request.body.content+"\', 1, "+request.body.pic_id+")";
                        console.log(sql);
                        connection.query(sql,function (err, result) {
                            if(err){
                                console.log('[SELECT ERROR] - ',err.message);
                                return;
                            }

                            console.log('--------------------------SELECT----------------------------');
                            console.log(result);
                            console.log('------------------------------------------------------------\n\n');
                            if(result){
                                recordTag(request.body.account, request.body.pic_id);
                                response.send(true);
                            }else{
                                response.send(false)
                            }
                        });
                    }
                }
            }).catch(function(err) {
                // 如果发生网络错误
                console.log(err);
            });

        }

    });

});

// function compare(word1, word2){
//     let e=request({url:'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=RXTZ649B2ijFo9OhptQENBVn&client_secret=4aKcVkalvIf94Xlap16nUjyLeMtrsVLA',
//         method:'GET',
//         headers:{'Content-Type':'text/json' }
//     },function(error,response,body){
//         if(!error && response.statusCode==200){
//             let data=JSON.parse(body);
//             console.log(data);
//             let at=data.access_token;
//             e=request({url:'https://aip.baidubce.com/rpc/2.0/nlp/v2/word_emb_sim?access_token='+at,
//                 method:'GET',
//                 headers:{'Content-Type':'application/json' },
//                 body: JSON.stringify({'word_1': word1, 'word_2': word2})
//             },function(error,response,body){
//                 if(!error && response.statusCode==200){
//                     console.log(body);
//                 }
//             });
//         }
//     });
// }



