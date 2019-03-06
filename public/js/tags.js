function addTag() {
    $.post('/addTag',{account:localStorage.wa_account,content:$("#newTag").val(),pic_id:localStorage.wa_picid},function(data,status,xhr)
    {
        if(data) {
            alert("添加成功");
            try{
                location.href='/tags';
            }catch (e) {
                alert(e.toString())
            }
        }else{
            alert("添加失败");
        }
    });
}

function loadTags() {
    document.getElementById('picture').src=localStorage.wa_picSrc;
    let tags=new Array();
    //alert(localStorage.wa_picid);
    $.post('/searchTags',{pic_id:parseInt(localStorage.wa_picid)},function(data,status,xhr)
    {
        let tags=new Array();
        localStorage.tags=tags=data;
        let length=tags.length;
        let i=0;
        for(i=0;i<length; i++){
            let newCon = document.createElement('p');
            let newPo=document.createElement('p');
            newCon.innerText=tags[i].content;
            newPo.innerText=tags[i].popularity;
            document.getElementById('tagBody').appendChild(newCon);
            document.getElementById('tagPopularity').appendChild(newPo);
        }
    });
    $.post('/countRecords',{account:localStorage.wa_account,pic_id:localStorage.wa_picid},function(data,status,xhr)
    {
        if(data) {
            $("#add").attr("disabled",true);
            $("#add").text('已达上限');
        }else{
            let ifMentioned=false;
            $('#newTag').bind('input propertychange',function(){
                $("#recommendList").empty();
                if( $('#newTag').val().length>8 && (!ifMentioned) ){
                    $('#newTag').focus();
                    alert("长度超出，请删减");
                    $("#add").attr("disabled",true);
                    ifMentioned=true;
                }else if($('#newTag').val().length<=8){
                    $("#add").attr("disabled",false);
                    ifMentioned=false;
                    tagsRecommend();
                }
            });
        }
    });

}

function tagsRecommend() {
    let rl=document.getElementById('recommendList');
    $.post('/tagsRecommend',{content:document.getElementById('newTag').value},function(data,status,xhr)
    {
        if(data.length>0) {
            for(let i=0;i<data.length;i++){
                let newBu=document.createElement('button');
                newBu.className="list-group-item";
                newBu.innerText=data[i]['content'];
                rl.appendChild(newBu);
                newBu.onclick=function () {
                    document.getElementById('newTag').value=newBu.innerText;
                    rl.style.display="none";
                }
            }
            rl.style.display="inherit";

        }else{
            rl.style.display="none";
        }
    });
}