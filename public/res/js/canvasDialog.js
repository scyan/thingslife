
var CanvasDialog=function(){
	var isOpen=false;
	var $root=$('<div id="canvas-dialog" class="dialog hidden" title="画布" style="display:none " ></div>');
    var _this={};
    _this.render=function(){
    	_this.isDraw=false;
    	$root.html(template(Templates.canvasDialog()));
    	$root.dialog( {
    		modal : true,
	  		width : 500,
	  		height : 300,
	  		position:[200,200],
	  		buttons:{
	  			'确认':_this.submit,
	  			'取消':_this.close,
	  		},
	  		close:_this.close,
	  	});
    	_this.initActions();
    };
    _this.initActions=function(){
    	  _this.canvas = document.getElementById('myCanvas');
		  if (_this.canvas && _this.canvas.getContext) {
			  _this.context = _this.canvas.getContext('2d');
			  _this.context.strokeStyle="#FF0000";
			  _this.context.fillStyle = "#FFFFFF"; 
			  _this.context.fillRect(0, 0, 400, 200);
		  }
		  //换颜色
		  $root.delegate('.color_box li','click',function(){
			  _this.context.strokeStyle=$(this).css("background-color");
		  });
		  
		  $root.delegate('#myCanvas','mousedown',function(e){
			  _this.isDraw=true;
			  _this.context.beginPath();
			  var co=_this._calcXY(e.pageX,e.pageY);
			  _this.context.moveTo(co.x,co.y);
		  });
		  
		  $root.delegate('#myCanvas','mousemove',function(e){
			  if(_this.isDraw==true){
				  var co=_this._calcXY(e.pageX,e.pageY);
				  _this.context.lineTo(co.x, co.y);
				  _this.context.stroke();
			  }
		  });
		  $root.delegate('#myCanvas','mouseup',function(){
			  _this.context.closePath();
			  _this.isDraw=false;
		  });
    };
    //TODO
	_this._calcXY=function(x,y){
		  var p = $root.dialog( "option", "position" );
		  if(x){
			 x=x-_this.canvas.offsetLeft-p[0];
		  }
		  if(y){
			  y=y-_this.canvas.offsetTop-p[1]-32;
		  }
	      return {x:x,y:y};
	};
    _this.submit=function(){
			//将图像输出为base64压缩的字符串  默认为image/png  
			var canvas=document.getElementById('myCanvas');
			var data = canvas.toDataURL();                      
			//删除字符串前的提示信息 "data:image/png;base64,"  
		    var b64 = data.substring( 22 );
		    $.post('/api/tasks/saveimg',{data:b64},function(res){
		    	if(res.code=='10000'){
		    		
		    		 _this.tagObj.set(res.data.tag);
		    		 _this.superior.refreshTag();
		    	}
		    },'json');
		//    _this.tagObj.set({img:b64});
			_this.close();
    };
    _this.close=function(){
    	$root.remove();
		isOpen=false;
    };
    return {
    	open:function(superior,tagObj){
    		if(isOpen){
				return;
			}
			isOpen=true;
			_this.superior=superior;
			_this.tagObj=tagObj;
    		_this.render();
    	}
    };
}();