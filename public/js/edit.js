

function clear() {
    let con = document.getElementById("content");
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');
    let main = document.getElementById("main");

    //resizeClearPic
    // document.getElementById("scale").onmousedown=null;
    // document.getElementById('scale').style.display='none';

    //clearResize
    c.onmousewheel=c.onwheel=null;//clearLight
    main.onmousedown=main.onmouseleave=main.onmouseup=null;
    $('#guide').css('display','none');
    $('#scale').css('display','none');
    $(document).unbind('keydown');



    //clearRotate
    $('#rotateCon').css('display','none');
    $('#rotateButton').unbind();

    //clearCut
    $('#myCanvas').unbind();
    c.style.cursor='auto';

    //clearInsert
    $('#guide').css('display','none');
    if(document.getElementById('insertCanvas')!=null){
        document.body.removeChild(document.getElementById('insertCanvas'));
        document.body.removeChild(document.getElementById('scale2'));
        document.body.onmousedown=document.body.onmouseleave=document.body.onmouseup=null;
    }

    //clearPaint
    $('#colorSelector').css('display','none');
    $('#myCanvas').unbind();

    //clearPaint
    $('#myCanvas').css('cursor','default');
    $('#myCanvas').unbind();

}

function resize() {
    clear();

    let g=document.getElementById('guide');
    g.style.display='block';
    g.innerText='右下自由缩放，滑轮等比缩放,回车完成';

    let main=document.getElementById('main');
    let con = document.getElementById("content");
    let s = document.getElementById("scale");
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    s.style.display='inherit';

    let imageObject=new Image();
    imageObject.src=c.toDataURL();
    imageObject.onload=function(){
        c.onmousewheel = c.onwheel = function (event) {
            event.preventDefault();
            event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40));  //获取当前鼠标的滚动情况
            if (event.wheelDelta > 0&& 1.25*c.width< document.body.clientWidth) {

                c.width = 1.25*c.width;
                c.height = 1.25*c.height;
                ctx.drawImage(imageObject,0,0,c.width,c.height);


            } else if(c.width*0.8>=100){

                c.width = 0.8*c.width;
                c.height = 0.8*c.height;
                ctx.drawImage(imageObject,0,0,c.width,c.height);

            }



            let temp=0.5*(document.body.clientWidth-c.width);
            document.getElementById('content').style.left=temp+'px';
            temp=Math.sqrt(c.height*c.height+c.width*c.width)/2-c.height/2;
            main.style.marginTop=temp>100?(temp+'px'):(100+'px');
        };

        s.onmousedown = function (e) {
            // 阻止冒泡,避免缩放时触发移动事件
            e.stopPropagation();
            e.preventDefault();
            let pos = {
                'w': c.offsetWidth,
                'h': c.offsetHeight,
                'x': e.clientX,
                'y': e.clientY
            };
            main.onmousemove = function (ev) {
                ev.preventDefault();
                // 设置图片的最小缩放为100*100
                let w = Math.max(100, ev.clientX - pos.x + pos.w);
                let h = Math.max(100,ev.clientY - pos.y + pos.h);
                // console.log(w,h)

                // 设置图片的最大宽高
                w = w >= window.innerWidth- $('#myCanvas').offset().left? window.innerWidth- $('#myCanvas').offset().left: w;
                h = h >= 1000 ? 1000 : h;

                c.width = w;
                c.height = h;
                ctx.drawImage(imageObject,0,0,w,h);


                // let temp=left+c.width-10;
                // s.style.left=temp+'px';
                // temp=top+ic.height-10;
                // s.style.top=temp+'px';

                let temp=0.5*(window.innerWidth-c.width);
                document.getElementById('content').style.left=temp+'px';
                temp=Math.sqrt(c.height*c.height+c.width*c.width)/2-c.height/2;
                main.style.marginTop=temp>100?(temp+'px'):(100+'px');
            };
            main.onmouseleave = function () {
                main.onmousemove=null;
                main.onmouseup=null;
            };
            main.onmouseup=function() {
                main.onmousemove=null;
                main.onmouseleave=null;
            };
        };
    };
    $(document).keydown(function(event){
        event.preventDefault();
        if(event.keyCode==13) {
            clear();
        }
    });
}

// function resizePic() {
//
//     let main=document.getElementById('main');
//     let con = document.getElementById("content");
//     let scale = document.getElementById("scale");
//     let c=document.getElementById('myCanvas');
//     let ctx=c.getContext('2d');
//     let img=new Image();
//     img.src=localStorage.image;
//
//     scale.style.display='inherit';
//
//     scale.onmousedown = function (e) {
//         // 阻止冒泡,避免缩放时触发移动事件
//         e.stopPropagation();
//         e.preventDefault();
//         let pos = {
//             'w': con.offsetWidth,
//             'h': con.offsetHeight,
//             'x': e.clientX,
//             'y': e.clientY
//         };
//         main.onmousemove = function (ev) {
//             ev.preventDefault();
//             // 设置图片的最小缩放为100*100
//             let w = Math.max(100, ev.clientX - pos.x + pos.w);
//             let h = Math.max(100,ev.clientY - pos.y + pos.h);
//             // console.log(w,h)
//
//             // 设置图片的最大宽高
//             w = w >= main.offsetWidth-con.offsetLeft ? main.offsetWidth-con.offsetLeft : w;
//             h = h >= main.offsetHeight-con.offsetTop ? main.offsetHeight-con.offsetTop : h;
//
//             let imageObject=new Image();
//             imageObject.onload=function(){
//                 let oldW=c.width;
//                 let oldH=c.height;
//                 c.width = w;
//                 c.height = h;
//                 ctx.scale(w/oldW,h/oldH);
//                 ctx.drawImage(imageObject,0,0);
//             };
//             imageObject.src=c.toDataURL();
//             console.log('put9');
//         };
//         main.onmouseleave = function () {
//             main.onmousemove=null;
//             main.onmouseup=null;
//             let temp=0.5*(document.body.clientWidth-c.width);
//             document.getElementById('content').style.left=temp+'px';
//             temp=Math.sqrt(c.height*c.height+c.width*c.width)/2-c.height/2;
//             main.style.marginTop=temp>100?(temp+'px'):(100+'px');
//         };
//         main.onmouseup=function() {
//             main.onmousemove=null;
//             main.onmouseup=null;
//             let temp=0.5*(document.body.clientWidth-c.width);
//             document.getElementById('content').style.left=temp+'px';
//             temp=Math.sqrt(c.height*c.height+c.width*c.width)/2-c.height/2;
//             main.style.marginTop=temp>100?(temp+'px'):(100+'px');
//         };
//     };
// }

function rotate() {
    clear();

    $('#rotateCon').css('display','inherit');

    $('#rotateButton').click(function () {
        console.log('here');
        let angle=Number($('#angle').val());
        if(isNaN(angle)){
            alert("请输入整数");
        }else{
            let temp=angle%360;
            temp='rotate('+temp+'deg)';
            let con = document.getElementById("content");
            con.style.webkitTransform = temp;
            con.style.mozTransform = temp;
            con.style.msTransform = temp;
            con.style.oTransform = temp;
            con.style.transform = temp;
        }
    });
}

function horizontalReverse(){
    clear();

    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    let img_data = ctx.getImageData(0, 0, c.width, c.height),
        i, i2, t,
        h = img_data.height,
        w = img_data.width,
        w_2 = w / 2;
// 将 img_data 的数据水平翻转
    for (let dy = 0; dy < h; dy ++) {
        for (let dx = 0; dx < w_2; dx ++) {
            i = (dy << 2) * w + (dx << 2);
            i2 = ((dy + 1) << 2) * w - ((dx + 1) << 2);
            for (let p = 0; p < 4; p ++) {
                t = img_data.data[i + p];
                img_data.data[i + p] = img_data.data[i2 + p];
                img_data.data[i2 + p] = t;
            }
        }
    }
// 重绘水平翻转后的图片
    ctx.putImageData(img_data, 0, 0);
    console.log('像素水平翻转');

}

function verticalReverse(){
    clear();

    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');
    let sourceData = ctx.getImageData(0, 0, c.width, c.height);
    let newData=ctx.createImageData(c.width,c.height);

// 将 img_data 的数据竖直翻转
    for(let i=0,h=sourceData.height;i<h;i++){
        for(let j=0,w=sourceData.width;j<w;j++){
            newData.data[i*w*4+j*4+0] = sourceData.data[(h-i)*w*4+j*4+0];
            newData.data[i*w*4+j*4+1] = sourceData.data[(h-i)*w*4+j*4+1];
            newData.data[i*w*4+j*4+2] = sourceData.data[(h-i)*w*4+j*4+2];
            newData.data[i*w*4+j*4+3] = sourceData.data[(h-i)*w*4+j*4+3];
        }
    }
// 重绘水平翻转后的图片
    ctx.clearRect(0,0,c.width,c.height);
    ctx.putImageData(newData, 0, 0);
    console.log('像素竖直翻转');

}

function cut() {
    clear();

    let main=document.getElementById('main');
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    c.style.cursor='crosshair';

    let startX;
    let startY;
    let endX;
    let endY;

    let ifOpacity=false;
    let initImg = ctx.getImageData(0, 0, c.width, c.height);


    $('#myCanvas').mousedown(function (e){
        ctx.putImageData( initImg,0, 0);
        let imgData = ctx.getImageData(0, 0, c.width, c.height),
            data = imgData.data;
        for( let i = 0; i < data.length; i += 4 ) {
            data[i+3]=0.2*data[i+3];
        }
        ctx.putImageData( imgData,0, 0);

        let rect = c.getBoundingClientRect();
        startX = event.clientX - rect.left * (c.width / rect.width);
        startY= event.clientY - rect.top * (c.height / rect.height);

        console.log('down:'+startX+' '+startY);

        $('#myCanvas').mousemove(function (e) {
            rect = c.getBoundingClientRect();
            endX = event.clientX - rect.left * (c.width / rect.width);
            endY= event.clientY - rect.top * (c.height / rect.height);
            imgData = ctx.getImageData(startX,startY,endX-startX,endY-startY);
            data = imgData.data;
            for( let i = 0; i < data.length; i += 4 ) {
                data[i+3]=data[i+3]*5;
            }
            ctx.putImageData( imgData,startX, startY );
            console.log('opa*5');
        });

        $('#myCanvas').mouseup(function (e){
            $('#myCanvas').unbind('mousemove');
            $('#myCanvas').unbind('mouseleave');
            $(document).keydown(function(event){
                event.preventDefault();
                if(event.keyCode==13){
                    c.width=endX-startX;
                    c.height=endY-startY;
                    ctx.putImageData(imgData,0,0);
                    let scale=100/c.height;
                    if(c.width<100||c.height<100) {
                        if (c.width < c.height) {
                            scale = 100 / c.width;
                        }
                        let imageObject = new Image();
                        imageObject.onload = function () {
                            let oldW = c.width;
                            let oldH = c.height;
                            c.width = c.width * scale;
                            c.height = c.height * scale;
                            ctx.drawImage(imageObject, 0, 0, c.width, c.height);
                            let temp = 0.5 * (document.body.clientWidth - c.width);
                            document.getElementById('content').style.left = temp + 'px';
                            temp = Math.sqrt(c.height * c.height + c.width * c.width) / 2 - c.height / 2;
                            main.style.marginTop = temp > 100 ? (temp + 'px') : (100 + 'px');
                        };
                        imageObject.src = c.toDataURL();
                    }
                }else{
                    var keyNum = event.which;   //获取键值
                    switch(keyNum){  //判断按键
                        case 37:
                            if(startX>=1){
                                startX--;
                                endX--;
                            }
                            break;
                        case 38:
                            if(startY>=1){
                                startY--;
                                endY--;
                            }
                            break;
                        case 39:
                            if(endX<=c.width-1){
                                endX++;
                                startX++;
                            }
                            break;
                        case 40:
                            if(endY<=c.height-1){
                                endY++;
                                startY++;
                            }
                        default:
                            break;
                    }

                    ctx.putImageData( initImg,0, 0);
                    imgData = ctx.getImageData(0, 0, c.width, c.height);
                    data = imgData.data;
                    for( let i = 0; i < data.length; i += 4 ) {
                        data[i+3]=0.2*data[i+3];
                    }
                    ctx.putImageData( imgData,0, 0);
                    imgData = ctx.getImageData(startX,startY,endX-startX,endY-startY);
                    data = imgData.data;
                    for( let i = 0; i < data.length; i += 4 ) {
                        data[i+3]=data[i+3]*5;
                    }
                    ctx.putImageData( imgData,startX, startY );
                }

            });
        });

        $('#myCanvas').mouseleave(function (e){
            $('#myCanvas').unbind('mousemove');
            $('#myCanvas').unbind('mouseup');
            $(document).keydown(function(event){
                event.preventDefault();
                if(event.keyCode==13){
                    c.width=endX-startX;
                    c.height=endY-startY;
                    ctx.putImageData(imgData,0,0);
                    let scale=100/c.height;
                    if(c.width<100||c.height<100){
                        if(c.width<c.height){
                            scale=100/c.width;
                        }
                        let imageObject=new Image();
                        imageObject.onload=function(){
                            let oldW=c.width;
                            let oldH=c.height;
                            c.width = c.width*scale;
                            c.height = c.height*scale;
                            ctx.drawImage(imageObject,0,0,c.width,c.height);
                            let temp=0.5*(document.body.clientWidth-c.width);
                            document.getElementById('content').style.left=temp+'px';
                            temp=Math.sqrt(c.height*c.height+c.width*c.width)/2-c.height/2;
                            main.style.marginTop=temp>100?(temp+'px'):(100+'px');
                        };
                        imageObject.src=c.toDataURL();
                    }
                }else{
                    let keyNum = event.which;   //获取键值
                    switch(keyNum){  //判断按键
                        case 37:
                            if(startX>=1){
                                startX--;
                                endX--;
                            }
                            break;
                        case 38:
                            if(startY>=1){
                                startY--;
                                endY--;
                            }
                            break;
                        case 39:
                            if(endX<=c.width-1){
                                endX++;
                                startX++;
                            }
                            break;
                        case 40:
                            if(endY<=c.height-1){
                                endY++;
                                startY++;
                            }
                        default:
                            break;
                    }

                    ctx.putImageData( initImg,0, 0);
                    imgData = ctx.getImageData(0, 0, c.width, c.height);
                    data = imgData.data;
                    for( let i = 0; i < data.length; i += 4 ) {
                        data[i+3]=0.2*data[i+3];
                    }
                    ctx.putImageData( imgData,0, 0);
                    imgData = ctx.getImageData(startX,startY,endX-startX,endY-startY);
                    data = imgData.data;
                    for( let i = 0; i < data.length; i += 4 ) {
                        data[i+3]=data[i+3]*5;
                    }
                    ctx.putImageData( imgData,startX, startY );
                }
            });

        });


    });
}