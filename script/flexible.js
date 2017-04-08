// 移动端自适应方案，rem+flexbox
// 1rem == 10px iphone6下，其他尺寸会自动计算rem值 width == 3.75rem
// fontSize 不必使用rem 尺寸大了反而不好，body上设置默认fontSize，之后的元素下的字体大小使用em控制，以便全局控制


;(function(win, lib) {
	var doc = win.document;
	var docEl = doc.documentElement;
	var dpr = win.devicePixelRatio;
	var tid; //定时器
	var flexible = lib.flexible || (lib.flexible = {});
	
	

	// 刷新rem ，以iphone6的width375px为基准 1rem == 100px ，
	function refreshRem(){
    dpr = win.devicePixelRatio;
		var deviceWidth = docEl.getBoundingClientRect().width;
		if (deviceWidth / dpr > 540) {
			deviceWidth = 540 * dpr;
		}
		var rem = deviceWidth / 3.75;
		docEl.style.fontSize = rem + 'px';
		flexible.rem = win.rem = rem;
	}

  function refreshFontSize(){
    var deviceWidth = docEl.getBoundingClientRect().width;
    if (doc.readyState === 'complete') {
      if(deviceWidth>=400){
        doc.body.style.fontSize = 16 + 'px';
      }else{
        doc.body.style.fontSize = 14 + 'px';
      }
      
    } else {
      doc.addEventListener('DOMContentLoaded', function(e) {
        if(deviceWidth>=400){
          doc.body.style.fontSize = 16 + 'px';
        }else{
          doc.body.style.fontSize = 14 + 'px';
        }
      }, false);
    }

  }


  // var evt = "onorientationchange" in win ? "orientationchange" : "resize";
	// 监听窗口变化，自动刷新rem 及 device-dpr
    
    // win.addEventListener('resize', function() {
    // win.location.reload(false);
    // }, false);

  
	

	// win.addEventListener('pageshow', function(e) {
	// 	if (e.persisted) {
	// 		clearTimeout(tid);
	// 		tid = setTimeout(function(){
 //        refreshRem();
 //        refreshFontSize();
 //        docEl.setAttribute('device-dpr', dpr);
 //      }, 300);
	// 	}
	// }, false);

  
	
	

	refreshRem();
  refreshFontSize();
  docEl.setAttribute('device-dpr', dpr);

	flexible.dpr = win.dpr = dpr;
  flexible.refreshRem = refreshRem;
	flexible.refreshFontSize = refreshFontSize;

	

	flexible.rem2px = function(d) {
		var val = parseFloat(d) * this.rem;
		if (typeof d === 'string' && d.match(/rem$/)) {
			val += 'px';
		}
		return val;
	}
	flexible.px2rem = function(d) {
		var val = parseFloat(d) / this.rem;
		if (typeof d === 'string' && d.match(/px$/)) {
			val += 'rem';
		}
		return val;
	}

	// console.log(flexible);

  
})(window, window['lib'] || (window['lib'] = {}));