function openFile() {
    let c=confirm('打开新图片后，已有更改将丢失，请先确认已保存，是否继续？')
    if(c){
        $('#openFile').click();
    }
}

function showFile(){
    clear();
    let file = document.getElementById("openFile").files[0];

    //创建读取文件的对象
    let reader = new FileReader();
    reader.readAsDataURL(file);
    //创建文件读取相关的变量
    let imgFile;

    //为文件读取成功设置事件
    reader.onload=function(e) {
        imgFile = this.result;
        loadCanvas(imgFile);
    };

}


function uploadFile() {
    try{
        let imgData = document.getElementById("myCanvas").toDataURL("image/png");
        let arr = imgData.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        let file=new File([u8arr], "temp.png", {type:mime});
        let formData = new FormData();
        formData.append('file',file);
        $.ajax({
            url: 'http://0.0.0.0:8082/uploadFile',
            type: 'POST',
            data: formData,
            // async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                if(200 === data.code) {
                    alert("上传成功");
                    location.href="/";
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

    }catch (e) {
        alert(e.toString());
    }


}