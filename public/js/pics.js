
let pics=new Array();

function createCards() {
    $("#cardPanel").empty();
    let length=pics.length;
    let i=0;
    for(i=0;i<length; i++){
        let newCard = document.createElement('div');
        newCard.className="card";
        newCard.title=pics[i].picture_id;
        //alert(newCard.title);
        let newImg = document.createElement('img');
        newImg.src=pics[i].picUrl;
        newImg.className="pic";
        newCard.appendChild(newImg);
        let newDes=document.createElement('p');
        newDes.className="description";
        newDes.innerText="创建时间："+pics[i].date+"    "+"热度："+pics[i].tagNum+"\n"+"流行标签："+pics[i].pts;
        newCard.appendChild(newDes);
        document.getElementById("cardPanel").appendChild(newCard);
    }
    $(".card").on("click",function(){
        localStorage.wa_picSrc=$(this).children('img').get(0).src;
        //alert($(this).attr("title").toString());
        let temp=$(this).attr("title");
        localStorage.wa_picid=temp;
        //alert(localStorage.pici);
        try{
            location.href="/tags";
        }catch (e) {
            alert(e);
        }
    });
}

function loadPics() {
    $.post('/loadPics',function(data,status,xhr)
    {
        localStorage.pics=pics=data;
        createCards();
    });
    getWeather();
}

function searchPics() {
    let key=$("#key").val();
    if(key.length>0){
        $.post('/searchPics',{key:key},function(data,status,xhr)
        {
            localStorage.pics=pics=data;
            createCards();
        });
    }else{
        loadPics();
    }

}

function orderByTime() {
    for(let i=0;i<pics.length;i++){
        for(let j=i;j<pics.length;j++){
            if (pics[i]['picture_id']<pics[j]['picture_id']){
                let temp=pics[j];
                pics[j]=pics[i];
                pics[i]=temp;
            }
        }
    }
    for(let i=0;i<pics.length;i++){
        for(let j=i;j<pics.length;j++){
            if (pics[i]['date']<pics[j]['date']){
                let temp=pics[j];
                pics[j]=pics[i];
                pics[i]=temp;
            }
        }
    }
    createCards();
}

function orderByHot() {
    for(let i=0;i<pics.length;i++){
        for(let j=i;j<pics.length;j++){
            if (pics[i]['tagNum']<pics[j]['tagNum']){
                let temp=pics[j];
                pics[j]=pics[i];
                pics[i]=temp;
            }
        }
    }
    createCards();
}

function choosePics() {
    $("#chooseFiles").click();
}

function uploadFiles() {
    let file = document.getElementById("chooseFiles");
    let formData = new FormData();
    for(let i in file.files){
        formData.append('file',file.files[i]);
    }
    $.ajax({
        url: 'http://0.0.0.0:8082/uploadFiles',
        type: 'POST',
        data: formData,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            if(200 === data.code) {
                alert("上传成功")
            } else {
                alert('上传失败');
            }
            console.log('imgUploader upload success');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            // alert(XMLHttpRequest.readyState);
            // alert(XMLHttpRequest.status);
            // alert(textStatus);
            // alert(errorThrown);
            alert("与服务器通信发生错误");
        }
    });
}


function getWeather() {
    $.post('/getWeather',function(data,status,xhr)
    {
        $('#city').text(data.city);
        $('#province').text(data.province);
        $('#weather').text(data.weather);
        $('#temperature').text(data.temperature);
        $('#direction').text(data.winddirection);
        $('#power').text(data.windpower);
        $('#humidity').text(data.humidity);
        $('#update').text(data.reporttime);
    });
}

function recommend() {
    $.post('/recommend',{account:localStorage.wa_account},function(data,status,xhr)
    {
        localStorage.pics=pics=data;
        for(let i=0;i<pics.length;i++){
            $.post('/getPicInfo',{pic_id: pics[i]['picture_id']},function(data,status,xhr)
            {
                let pi=data[0];
                pics[i].picUrl=pi.picUrl;
                pics[i].date=pi.date;
                pics[i].tagNum=pi.tagNum;
                pics[i].pts=pi.pts;
                if(i==pics.length-1){
                    try{
                        createCards();
                    }catch (e) {
                        e.print()
                    }
                }
            });
        }
        //createCards();
    });
}