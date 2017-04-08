
//截图成功的图片base64保存在 window.cutImgData中
// initCut(html(),cut,src,fn) 中src不能为空，必须有值，前2参数不变，fn为回调函数截图之后的回调函数

(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var To=function (el, property, value, time, ease, onEnd,onChange ) {
    var current = el[property];
    var dv = value - current;
    var beginTime = new Date();
    var self = this;
    var currentEase=ease||function(a){return a };
    this.tickID=null;
    var toTick = function () {
        var dt = new Date() - beginTime;
        if (dt >= time) {
            el[property] = value;
            onChange && onChange(value);
            onEnd && onEnd(value);
            cancelAnimationFrame(self.tickID);
            self.toTick=null;
            return;
        }
        el[property] = dv * currentEase(dt / time) + current;
        self.tickID=requestAnimationFrame(toTick);
        //self.tickID = requestAnimationFrame(toTick);
        //cancelAnimationFrame������ tickID = requestAnimationFrame(toTick);�ĺ���
        onChange && onChange(el[property]);
    };
    toTick();
    To.List.push(this);
};

To.List=[];

To.stopAll=function(){
    for(var i= 0,len=To.List.length;i<len;i++){
        cancelAnimationFrame(To.List[i].tickID);
    }
    To.List.length=0;
};

To.stop=function(to) {
    cancelAnimationFrame(to.tickID);
};
// 上面是引用了alloyfinger例子中的to.js


function html(){
    return  '<div class="cut_wrap" style="display:none"><div class="img_wrap"><img id="avatar" src="../image/timg.jpg" alt=""></div><canvas id="canvas_cut"></canvas><div class="shadow"></div><div class="btns flex"><div id="cancle_btn" class="cancle_btn flex_item">取消</div><div id="save_btn" class="save_btn flex_item">保存</div></div></div>'
}

function initCut(html,cut,src,fn){
    var oDiv = document.createElement('div')
        oDiv.innerHTML = html
        document.addEventListener("DOMContentLoaded",function(){
            document.getElementsByTagName('body')[0].appendChild(oDiv)

            document.getElementById("cancle_btn").addEventListener('click',function(){
                document.querySelector(".cut_wrap").style.display = "none"

            })

            cut(src,fn)

            
        })
    
}

function showCutView(){
    document.querySelector(".cut_wrap").style.display = "block"
}

function ease(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function cut(src,fn){
    
    var el = document.getElementById("avatar");
    src && (el.src = src)

    var myCanvas = document.getElementById('canvas_cut')
        myCanvas.width = 300;
        myCanvas.height = 300;

    var ctx=myCanvas.getContext("2d");

    Transform(el);

    new AlloyFinger(el, {
        pointStart: function(){
            console.log('hi man, you just touch me ')
        },
        multipointStart: function () {
            // To.stopAll();
            console.log(el.scaleX)
            initScale = el.scaleX;
        },
        pinch: function (evt) {
            el.scaleX = el.scaleY = initScale * evt.scale;
        },
        pressMove: function (evt) {
            el.translateX += evt.deltaX;
            el.translateY += evt.deltaY;
            evt.preventDefault();
        },
        doubleTap: function (evt) {
            if (el.scaleX > 1.5) {
                new To(el, "scaleX", 1, 500, ease);
                new To(el, "scaleY", 1, 500, ease);
                new To(el, "translateX", 0, 500, ease);
                new To(el, "translateY", 0, 500, ease);
            } else {
                var box = el.getBoundingClientRect();
                var y = box.height - (( evt.changedTouches[0].pageY ) * 2) - (box.height / 2 - ( evt.changedTouches[0].pageY ));

                var x = box.width - (( evt.changedTouches[0].pageX) * 2) - (box.width / 2 - ( evt.changedTouches[0].pageX));
                new To(el, "scaleX", 2, 500, ease);
                new To(el, "scaleY", 2, 500, ease);
                new To(el, "translateX", x, 500, ease);
                new To(el, "translateY", y, 500, ease);
            }
            //console.log("doubleTap");
        }

    });

    el.onload = function(){
        var imageWidth,imageHeight
            imageWidth = el.width;
            imageHeight = el.height
        console.log(imageWidth,imageHeight)

        var middleCanvas = document.createElement("canvas")
        var middleCanvasCtx = middleCanvas.getContext('2d')

        document.getElementById("save_btn").addEventListener('click',function(){

            var scale = el.scaleX
            middleCanvas.width =imageWidth*scale
            middleCanvas.height =imageHeight*scale
//                    console.log(scale)
            // 这里的坐标转换是关键
            var sx = ((scale*imageWidth-imageWidth)/2-el.translateX)/scale
            var sy = ((scale*imageHeight-imageHeight)/2-el.translateY)/scale

//                    console.log(sx,sy)
//                    console.log(el.translateX,el.translateY)
            middleCanvasCtx.clearRect(0,0, middleCanvas.width,middleCanvas.height);
            middleCanvasCtx.fillStyle = "#fff";
            middleCanvasCtx.fillRect(0, 0,  middleCanvas.width, middleCanvas.height);
            middleCanvasCtx.drawImage(el,sx,sy,imageWidth,imageHeight,0,0, middleCanvas.width,middleCanvas.height)

            // 中转canvas绘制完毕

            // 绘制myCanvas
            ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

            ctx.drawImage(middleCanvas,0,0,myCanvas.width,myCanvas.height,0,0,myCanvas.width,myCanvas.height);






            var base64 = myCanvas.toDataURL("image/jpeg", .5)

            if(base64){
                console.log(base64)
                console.log(base64.length)
                alert('裁切成功大小'+base64.length/1000+'Kb')
                window.cutImgData = base64
                document.querySelector(".cut_wrap").style.display = "none"
                // 发送ajax
                // alert("头像修改成功")

                fn()
            }

        })

    }

}


