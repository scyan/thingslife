
var CanvasDialog={
		settings:{
			root:null,
			isDraw:false,
			canvas : null,
			context:null,
			img :null,
			isEdit : false,
			isProject:false,
			project:null
		},
	  init: function(options){
		  $.extend(this.settings,options);
		  var $root=$(this.settings.root);
		  this.initCanvas($root);
		  var that=this;
		  $root.dialog( {
	  			width : 500,
	  			height : 300,
	  			position:[200,200],
	  			autoOpen : false,
	  			buttons:{
	  				'确认':function(){

	  					//将图像输出为base64压缩的字符串  默认为image/png  
	  					var canvas=document.getElementById('myCanvas');
	  					var data = canvas.toDataURL();                      
	  					//删除字符串前的提示信息 "data:image/png;base64,"  
	  				    var b64 = data.substring( 22 ); 
	  				    Dispacher.notify('tag.change',{img:b64,isProject:that.settings.isProject,project:that.settings.project});
	  				 /*   that.settings.img=b64;
	  				    that.settings.isEdit=true;*/
	  					$root.dialog('close');
	  				},
	  				'取消':function(){
	  					//that.settings.context.clearRect(0, 0, 500, 300); 
	  					$root.dialog('close');
	  				}
	  			}
	  		});
		  Dispacher.connect('tag.change',function(event,args){
			  if(!args.img){
				  $('.tag-bar').hide();
			  }else{
				  $('.tag-bar').show();
			  }
			  that.settings.img=args.img;
			  that.settings.isEdit=true;
		  });
		  Dispacher.connect('task.create task.edit',function(event,args){
			  that.clear();
			  /*that.settings.context.clearRect(0, 0, 500, 300); 
			  that.settings.img=null;
			  that.settings.isEdit=false;*/
		  });
	  },
	  initCanvas : function($root){
		  var html= '<div class="color_box">'+
                       '<ul class="color">'+
                          '<li class="red">红色</li>'+
                          '<li class="orange">橙色</li>'+
                          '<li class="yellow">黄色</li>'+
                          '<li class="green">绿色</li>'+
                          '<li class="scyan">青色</li>'+
                          '<li class="blue">蓝色</li>'+
                          '<li class="purple">紫色</li>'+
                      '</ul>'+
                   '</div>'+
			  '<canvas id="myCanvas" width="400" height="200" style="background:#FFF">'+'</canvas>';
		  $root.html(html);
		  this.settings.canvas = document.getElementById('myCanvas');
		  if (this.settings.canvas && this.settings.canvas.getContext) {
			  this.settings.context = this.settings.canvas.getContext('2d');
			  this.settings.context.strokeStyle="#FF0000";
			  this.settings.context.fillStyle = "#FFFFFF"; 
			  this.settings.context.fillRect(0, 0, 400, 200);
			 
		  }
		  var that=this; 
		  $('.color_box li').click(function(){
			  that.settings.context.strokeStyle=$(this).css("background-color");
		  });
		  $('#myCanvas').mousedown(function(e){
			  that.settings.isDraw=true;
			  that.settings.context.beginPath();
			  var co=that._calcXY(e.pageX,e.pageY);
			  that.settings.context.moveTo(co.x,co.y);
		  });
		  $('#myCanvas').mousemove(function(e){
			  if(that.settings.isDraw==true){
				  var co=that._calcXY(e.pageX,e.pageY);
			      that.settings.context.lineTo(co.x, co.y);
			      that.settings.context.stroke();
			  }
		  });
		  $('#myCanvas').mouseup(function(){
			  that.settings.context.closePath();
			  that.settings.isDraw=false;
		  });
				  
			
	  },
	  open: function(options){
		  this.settings.isProject=false;
		  this.settings.project=null;
		  $.extend(this.settings,options);
		  $(this.settings.root).dialog('open');
	  },
	  isEdit : function(){
		  return this.settings.isEdit;
	  },
	  getImg : function(){
		  return this.settings.img;
	  },
	 
	  clear : function(){
		  this.settings.context.clearRect(0, 0, 500, 300);
		  this.settings.context.fillRect(0, 0, 500, 300);
		  this.settings.context.strokeStyle='#FF0000';
		  this.settings.img=null;
		  this.settings.isEdit=false;
	  },
	  //TODO
	  _calcXY : function(x,y){
		  var p = $(this.settings.root).dialog( "option", "position" );
		  if(x){
			 x=x-this.settings.canvas.offsetLeft-p[0];
		  }
		  if(y){
			  y=y-this.settings.canvas.offsetTop-p[1]-32;
		  }
	      return {x:x,y:y};
	  }
};