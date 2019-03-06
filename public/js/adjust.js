function bright() {
    clear();
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    let g=document.getElementById('guide');
    g.style.display='block';
    g.innerText='滚动滑轮调节亮度';

    c.onmousewheel = c.onwheel = function (event) {
        event.preventDefault();
        event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40));  //获取当前鼠标的滚动情况
        if (event.wheelDelta > 0) {
            let imgData=ctx.getImageData(0,0,c.width,c.height);
            let data = imgData.data;
            for( let i = 0; i < data.length; i += 4 ) {
                data[i]*=1.05;
                data[i+1]*=1.05;
                data[i+2]*=1.05;
            }
            ctx.putImageData( imgData, 0, 0 );
        } else{
            let imgData=ctx.getImageData(0,0,c.width,c.height);
            let data = imgData.data;
            for( let i = 0; i < data.length; i += 4 ) {
                data[i]/=1.05;
                data[i+1]/=1.05;
                data[i+2]/=1.05;
            }
            ctx.putImageData( imgData, 0, 0 );
        }

    };
}

function opacity() {
    clear();
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');

    let g=document.getElementById('guide');
    g.style.display='block';
    g.innerText='滚动滑轮调节透明度';

    c.onmousewheel = c.onwheel = function (event) {
        event.preventDefault();
        event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40));  //获取当前鼠标的滚动情况
        if (event.wheelDelta > 0) {
            let imgData=ctx.getImageData(0,0,c.width,c.height);
            let data = imgData.data;
            for( let i = 0; i < data.length; i += 4 ) {
                data[i+3]*=1.1;
            }
            ctx.putImageData( imgData, 0, 0 );
        } else{
            let imgData=ctx.getImageData(0,0,c.width,c.height);
            let data = imgData.data;
            for( let i = 0; i < data.length; i += 4 ) {
                data[i+3]/=1.1;
            }
            ctx.putImageData( imgData, 0, 0 );
        }

    };
}