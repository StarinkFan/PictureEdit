let totalDisX=0;
let totalDisY=0;

function clickCP() {
    clear();
    let g=document.getElementById('guide');
    g.style.display='inherit';
    g.innerText='可多选图片，按左右方向键切换，回车确认';
    $("#choosePic").click();
}

function choosePic() {
    let picUrls=new Array();
    let picIndex=0;

    let main=document.getElementById('main');
    let c=document.getElementById('myCanvas');

    let ic=document.createElement('canvas');
    ic.id='insertCanvas';

    document.body.appendChild(ic);


    let top=$('#myCanvas').offset().top;
    let left=$('#myCanvas').offset().left;

    let ictx=ic.getContext('2d');
    ictx.fillStyle = 'rgba(255, 255, 255, 0)';

    ic.style.left=left+'px';
    ic.style.top=top+'px';
    console.log(ic.clientTop+':'+ic.clientTop);
    ic.style.zIndex='12';
    ic.style.position='absolute';

    let pic=new Image();

    let file = document.getElementById("choosePic");
    for(let i=0;i<file.files.length;i++){
        let reader = new FileReader();
        reader.readAsDataURL(file.files[i]);
        //创建文件读取相关的变量
        let imgFile;

        //为文件读取成功设置事件
        reader.onload=function(e) {
            imgFile = this.result;
            picUrls.push(imgFile);
            if(i==file.files.length-1){
                pic.src=picUrls[picIndex%picUrls.length];
            }
        };
    }


    // let formData = new FormData();
    // for(let i in file.files){
    //     formData.append('file',file.files[i]);
    // }
    // $.ajax({
    //     url: 'http://0.0.0.0:8081/insert',
    //     type: 'POST',
    //     data: formData,
    //     // async: false,
    //     cache: false,
    //     contentType: false,
    //     processData: false,
    //     success: function(data){
    //         if(200 === data.code) {
    //             picUrls=data.data;
    //             pic.src=picUrls[picIndex%picUrls.length];
    //         } else {
    //             alert('打开失败');
    //         }
    //         console.log('imgUploader upload success');
    //     },
    //     error: function(XMLHttpRequest, textStatus, errorThrown){
    //         // alert(XMLHttpRequest.readyState);
    //         // alert(XMLHttpRequest.status);
    //         // alert(textStatus);
    //         // alert(errorThrown);
    //         alert("与服务器通信发生错误");
    //     }
    // });

    $(document).keydown(function(event){
        event.preventDefault();
        let keyNum = event.which;   //获取键值
        switch(keyNum) {  //判断按键
            case 13:
                let g=document.getElementById('guide');
                g.style.display='inherit';
                g.innerText='拖动调位，右下放大；回车确认插入，否则丢失';

                $(document).unbind('keydown');
                addScale(left,top,pic);
                picMove(left,top);
                insertPic();
                break;
            case 37:
                picIndex=picIndex+picUrls.length-1;
                picIndex=picIndex%(picUrls.length);
                pic.src=picUrls[picIndex];
                //alert(pic.src);
                break;
            case 39:
                picIndex++;
                picIndex=picIndex%(picUrls.length);
                pic.src=picUrls[picIndex];
                //alert(pic.src);
                break;
            default:
                break;
        }
    });

    pic.onload=function(){
        let height=pic.height;
        let width=pic.width;
        ic.height=height;
        ic.width=width;
        ictx.drawImage(pic,0,0);
    };
}

function picMove(left,top){
    let ic=document.getElementById('insertCanvas');
    let s=document.getElementById('scale2');
    let c=document.getElementById('myCanvas');

    ic.style.cursor='move';

    ic.onmousedown=function (e) {
        let disX;
        let disY;
        let startX=e.pageX;
        let startY=e.pageY;
        let temp1;
        let temp2;
        let temp;

        ic.onmousemove=function (e) {
            disX=e.pageX-startX;
            disY=e.pageY-startY;
            if(left+disX+ic.width>$('#myCanvas').offset().left+c.width) {
                disX=$('#myCanvas').offset().left+c.width-left-ic.width;
            }
            if(left+disX<$('#myCanvas').offset().left) {
                disX=$('#myCanvas').offset().left-left;
            }
            temp1=left+disX;
            ic.style.left=temp1+'px';
            temp=temp1+ic.width-10;
            s.style.left=temp+'px';
            if(top+disY+ic.height>$('#myCanvas').offset().top+c.height) {
                disY=$('#myCanvas').offset().top+c.height-top-ic.height;
            }
            if(top+disY<$('#myCanvas').offset().top) {
                disY=$('#myCanvas').offset().top-top;
            }
            temp2=top+disY;
            ic.style.top=temp2+'px';
            temp=temp2+ic.height-10;
            s.style.top=temp+'px';

            console.log('move6');
        };
        ic.onmouseup=function (e) {
            left=temp1;
            top=temp2;
            totalDisX=$('#insertCanvas').offset().left-$('#myCanvas').offset().left;
            totalDisY=$('#insertCanvas').offset().top-$('#myCanvas').offset().top;
            ic.onmousemove=null;
            ic.onmouseleave=null;
        };

        ic.onmouseleave=function (e) {
            left=temp1;
            top=temp2;
            totalDisX=$('#insertCanvas').offset().left-$('#myCanvas').offset().left;
            totalDisY=$('#insertCanvas').offset().top-$('#myCanvas').offset().top;
            ic.onmousemove=null;
            ic.onmouseup=null;
        };
    }
}

function addScale(left,top,pic) {
    let c=document.getElementById('myCanvas');
    let ic=document.getElementById('insertCanvas');
    let ictx=ic.getContext('2d');
    let s=document.createElement('div');
    s.id='scale2';
    s.className='scale';
    let temp=left+ic.width-10;
    s.style.left=temp+'px';
    temp=top+ic.height-10;
    s.style.top=temp+'px';
    document.body.appendChild(s);

    s.onmousedown = function (e) {
        // 阻止冒泡,避免缩放时触发移动事件
        e.stopPropagation();
        e.preventDefault();
        let pos = {
            'w': ic.offsetWidth,
            'h': ic.offsetHeight,
            'x': e.clientX,
            'y': e.clientY
        };
        document.body.onmousemove = function (ev) {
            ev.preventDefault();
            // 设置图片的最小缩放为100*100
            let w = Math.max(50, ev.clientX - pos.x + pos.w);
            let h = Math.max(50,ev.clientY - pos.y + pos.h);
            // console.log(w,h)

            // 设置图片的最大宽高
            w = w >= c.width- $('#myCanvas').offset().left+$('#insertCanvas').offset().left? c.width- $('#myCanvas').offset().left+$('#insertCanvas').offset().left : w;
            h = h >= c.height- $('#myCanvas').offset().top+$('#insertCanvas').offset().top ? c.height- $('#myCanvas').offset().top+$('#insertCanvas').offset().top : h;

            ic.width = w;
            ic.height = h;
            ictx.drawImage(pic,0,0,w,h);
            temp=$('#insertCanvas').offset().left+ic.width-10;
            s.style.left=temp+'px';
            temp=$('#insertCanvas').offset().top+ic.height-10;
            s.style.top=temp+'px';
        };
        document.body.onmouseleave = function () {
            document.body.onmousemove=null;
            document.body.onmouseup=null;
        };
        document.body.onmouseup=function() {
            document.body.onmousemove=null;
            document.body.onmouseleave=null;
        };
    };
}

function insertPic() {
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');
    let ic=document.getElementById('insertCanvas');
    let ictx=ic.getContext('2d');
    let s=document.getElementById('scale2');
    $(document).keydown(function(event){
        event.preventDefault();
        if(event.keyCode==13) {
            let imgData=ictx.getImageData(0,0,ic.width,ic.height);
            ctx.putImageData(imgData,totalDisX,totalDisY,0,0,ic.width,ic.height);
            totalDisX=0;
            totalDisY=0;
            clear();
        }
    });
}

function paint() {
    clear();
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    ctx.lineJoin = "round";
    ctx.lineWidth = 3;

    let paint=false;
    let box;
    let mouseX;
    let mouseY;

    let color='black';
    $('#colorSelector').css('display','inherit');
    $('#color').change(function () {
        color=$('#color').val();
        ctx.strokeStyle = color;
    });

    $('#myCanvas').mousedown(function (e) {
        paint = true;
        box = c.getBoundingClientRect();
        mouseX = (e.clientX - box.left) * c.width / box.width;
        mouseY = (e.clientY - box.top) * c.height / box.height;
        ctx.beginPath();
        ctx.moveTo(mouseX , mouseY);
    });

    $('#myCanvas').mousemove(function (e) {
        if (paint) {
            box = c.getBoundingClientRect();
            mouseX = (e.clientX - box.left) * c.width / box.width;
            mouseY = (e.clientY - box.top) * c.height / box.height;
            ctx.lineTo(mouseX , mouseY);
            ctx.stroke();
            ctx.lineJoin = "round";
            ctx.lineWidth = 3;
            ctx.moveTo(mouseX , mouseY);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        paint = false;
        ctx.closePath();
    });
    $('#myCanvas').mouseleave(function(e){
        paint = false;
        ctx.closePath();
    });
}

function mosaic(){
    clear();
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    let mosaic=false;
    let box;
    let mouseX;
    let mouseY;
    let left;
    let top;
    let right;
    let bottom;

    let initImg=ctx.getImageData(0,0,c.width,c.height);


    $('#myCanvas').css('cursor','crosshair');

    $('#myCanvas').mousedown(function (e) {
        mosaic = true;
    });

    $('#myCanvas').mousemove(function (e) {
        if (mosaic) {
            box = c.getBoundingClientRect();
            mouseX = (e.clientX - box.left) * c.width / box.width;
            mouseY = (e.clientY - box.top) * c.height / box.height;
            left=mouseX-3>0?mouseX-3:0;
            top=mouseY-3>0?mouseY-3:0;
            right=mouseX+3<c.width?mouseX+3:c.width;
            bottom=mouseY+3<c.height?mouseY+3:c.height;
            console.log(left+" "+top+" "+right+" "+bottom);
            let imgData=ctx.getImageData(left,top,right-left,bottom-top);
            let data=imgData.data;
            let avgR=0;
            let avgG=0;
            let avgB=0;
            for(let i=0;i<data.length;i+=4){
                avgR=avgR+data[i]/data.length*4;
                avgG=avgG+data[i+1]/data.length*4;
                avgB=avgB+data[i+2]/data.length*4;
            }
            for(let i=0;i<data.length;i+=4){
                data[i]=avgR;
                data[i+1]=avgG;
                data[i+2]=avgB;
            }
            ctx.putImageData(imgData,left,top);

        }
    });

    $('#myCanvas').mouseup(function (e) {
        mosaic = false;
    });
    $('#myCanvas').mouseleave(function(e){
        mosaic = false;
    });
}

function reverseColor() {
    clear();
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    let imgData=ctx.getImageData(0,0,c.width,c.height);
    let data=imgData.data;
    for(let i=0;i<data.length;i+=4){
        data[i]=255-data[i];
        data[i+1]=255-data[i+1];
        data[i+2]=255-data[i+2];
    }
    ctx.putImageData(imgData,0,0);

}

function retro() {
    clear();
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    let imgData=ctx.getImageData(0,0,c.width,c.height);
    let data = imgData.data;
    for( let i = 0; i < data.length; i += 4 ) {
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];
        data[i] = r * 0.3 + g * 0.4 + b * 0.3;
        data[i+1] = r * 0.2 + g * 0.6 + b * 0.2;
        data[i+2] = r * 0.4 + g * 0.3 + b * 0.3;
    }
    ctx.putImageData( imgData, 0, 0 );
}

function blackWhite() {
    clear();
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    let imgData=ctx.getImageData(0,0,c.width,c.height);
    let data = imgData.data, avg = 0;
    for( let i = 0; i < data.length; i += 4 ) {
        avg = ( data[i] + data[i+1] + data[i+2] ) / 3;
        data[i] = avg;
        data[i+1] = avg;
        data[i+2] = avg;
    }
    ctx.putImageData( imgData, 0, 0 );
}