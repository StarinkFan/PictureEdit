function loadCanvas(image){
    let main=document.getElementById('main');
    let c=document.getElementById('myCanvas');
    let ctx=c.getContext('2d');
    let img=new Image();
    img.src=image;
    localStorage.image=image;


    img.onload=function(){
        let height=img.height;
        let width=img.width;
        c.height=height;
        c.width=width;
        ctx.drawImage(img,0,0);
        let temp=0.5*(window.innerWidth-c.width);
        document.getElementById('content').style.left=temp+'px';
        temp=c.height+20;
        document.getElementById('main').style.minHeight=temp+'px';
        temp=Math.sqrt(c.height*c.height+c.width*c.width)/2-c.height/2;
        main.style.marginTop=temp>50?(temp+'px'):(50+'px');
    };
}