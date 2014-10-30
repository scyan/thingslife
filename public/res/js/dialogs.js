var DateDialog = {
	settings : {
		root : null,
		type :null,
		task:null,
		task_id:0,
		toFocusField:'',
		subject :null
	},
	init : function (options){
	 $.extend(this.settings,options);
	 $root=$(this.settings.root);
	 $root.datepicker( {
			dateFormat : 'yy-mm-dd',
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
			dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ]
			//minDate : 1
		});
	 $root.dialog( {
 		modal : true,
 		autoOpen : false
		});
	// this.initButtons($root);
	 this.initActions($root);
    },
    initButtons : function($root){
        var html='<div class="row buttons-row"></div>';
        $('.buttons-row',this.settings.root).remove();
        $root.append(html);
        switch(this.settings.type){
           case 'drag':
        	   $('.buttons-row',this.settings.root).html('<input type="button" id="drag-ensure" value="确定" />'+
                                     '<input type="button" id="drag-cancel" value="取消" />');
        	   break;
           case 'dueDate':
        	   $('.buttons-row',this.settings.root).html('<input type="button" id="dueDate-ensure" value="确定"/>'+
        		                     '<input type="button" id="dueDate-cancel" value="取消"/>');
        	   break;
        	   default:
        		   break;
        }
    },
    initActions : function($root){
    	$('#drag-ensure').live('click',function(){
    		DateDialog.settings.task.edit({
    			focusField:'schedule',
    			exeDate : $root.val()
    		},function(data){
    			Dispacher.notify('task.edit',{task:data.task,task_before:DateDialog.settings.task});
    		});
 			$root.dialog("close");
         });
        
        $('#drag-cancel').live('click',function(){
         	$root.dialog("close");
         });
        
        $('#dueDate-ensure').live('click',function(){
    		$('#dueDate-info').html($root.val());
			  $root.dialog('close');
        });
        $('#dueDate-cancel').live('click',function(){
        	$root.dialog('close');
        });
    },
    isOpen : function(){
    	return $(this.settings.root).dialog('isOpen');
    },
	openForDrag : function (task,toFocusField){
    	$root=$(this.settings.root);
    	this.settings.task=task;
    	this.settings.toFocusField=toFocusField;
    	this.settings.type='drag';
    	this.initButtons($root);
    	$root.datepicker('option','minDate',1);
    	$root.dialog('open');
    	
    },
    openForDueDate : function(){
    	$root=$(this.settings.root);
    	this.settings.type='dueDate';
    	this.initButtons($root);
    	$.datepicker.setDefaults($.datepicker.regional['']);
    	$root.datepicker('option','minDate','-3m');
    	$root.dialog('open');
    }
};
var NewEditDialog = {
	settings : {
	  type : "new",
	/**
	 * NewEditDialo的最外层容器
	 */
	  root : null,
	  task:0

  },
    init : function (options){
	  $.extend(this.settings,options);
	  var $root=$(this.settings.root);
	  
	  this.initTitleField($root);
	  this.initBelongField ($root);
	  this.initNoteField($root);
	  this.initRepeatField($root);
	  this.initDueField($root);
	  this.initRecordField($root);
	  this.initActions($root);
	  //this.initButtons($root);
	  
	  $root.dialog( {
			modal : true,
			width : 550,
			height : 320,
            autoOpen : false
		});
    },
    
    /**
	 * @access public
	 */
    open : function (options){
    	$.extend(this.settings,options);
    	
    	var $root=$(this.settings.root);
    	var title=(this.settings.type=='edit')?'编辑任务':'添加任务';
    	
        this.clear();//清空上一次添加时的信息
        Repeat.init();//清空repeat对象的数据
        //TODO
        CanvasDialog.clear();//清空画布
    	$root.dialog('option','title',title);
    	this.initButtons($root);
        $root.dialog('open');
    	
    	(FocusField.get()=='schedule')?$('#date-field').show():$('#date-field').hide();
    	$('#belongto').show();
    	if(this.settings.type=='edit'){
    		this.settings.task=getCurrentTask();
    		getCurrentTask().show(function(data){
    			  $('#focus-field').val(data.task.focusType);
    			  $('#title-field').val(data.task.title);
				  $('#note-field').val(data.task.note);
				  (getCurrentTask().isSchedule())?$('#date-field').show():$('#date-field').hide();
				  if(data.task.tag>0){
					  $('#tag-field').attr('src','/res/tags/'+data.tag.name+'?i='+Math.random());
				  }
				  if(data.task.sound>0){
					  $('#player').attr('src','/res/upload/sound_'+data.task._id+'.wav?i='+Math.random());
					  $('#player').show();
					  $('#delete-sound').show();
				  }
				  
				  (data.task.exeDate==0)?$('#date-field').val(TimeMachine.tomorrow('Y-m-d')):$('#date-field').val(TimeMachine.custom(data.task.exeDate*1000));
				  (data.task.dueDate!=0)?$('#dueDate-info').html(TimeMachine.custom(data.task.dueDate*1000)):'';
				  (data.task.repeatId==0)?$('#belongto').show():$('#belongto').hide();
				  if (data.repeat) {
					Repeat.set(data.repeat);
				  }
    		});
    	}else{
    		(FocusField.get()=='schedule')?$('#date-field').show():$('#date-field').hide();
    		$('#focus-field').val(FocusField.get());
    		$('#date-field').val(TimeMachine.tomorrow('Y-m-d'));
    	}
    },
    /**
	 * @access public
	 * clear dialog
	 */
    clear : function(){
    	$('#title-field').val('');
		$('#note-field').val('');
		$('#repeat-info').empty();
		$('#dueDate-info').empty();
		$('#sound').val('');
		$('#player').hide();
		$('#player').attr('src','');
		$('#delete-sound').hide();
		$('#tag-field').attr('src','');
    },
    isOpen : function(){
    	return $(this.settings.root).dialog('isOpen');
    },
    /**
	 * @access private
	 */
    initTitleField : function ($root){
    	var html='<div class="row">'+
    	           '<label for="title-field">任务</label>'+
    	           '<input type="text" id="title-field" name="title" value=""/>'+
    	         '</div>';
    	$root.append(html);
    	$("#title-field").keydown(function(event) {
			if (event.keyCode == 13&&NewEditDialog.settings.type=='new') {
				$("#add-continue").click();
			}
		});
    },
    /**
	 * @access private
	 */
    initBelongField : function ($root){
    	var html='<div id="belongto"class="row">'+
                   '<label for="focus-field">放入</label>'+
                   '<select id="focus-field" name="focus">'+
                      '<option value="inbox">收集箱</option>'+
                      '<option value="today">今日待办</option>'+
                      '<option value="next" >下一步行动</option>'+
                      '<option value="schedule">日程</option>'+
                      '<option value="someday">择日待办</option>'+
                   '</select>'+
                   '<input id="date-field" type="text" readonly="readonly"></input>'+
                 '</div>';
    	$root.append(html);
    	$('#date-field').datepicker({
    		dateFormat : 'yy-mm-dd',
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
			dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
			minDate : 1
    	});
    	$('#focus-field').change(function(){
    		($(this).val()=='schedule')?$('#date-field').show():$('#date-field').hide();
    	});
    },
    /**
	 * @access private
	 */
    initNoteField : function ($root){
    	var html='<div class="row">'+
                   '<label for="note-field">备注</label>'+
                   '<textarea id="note-field" name="note"></textarea>'+
                 '</div>'+
                 '<div class="row">'+
                    '<label for="tag-field">标签</label>'+
                    '<a href="javascript:void(0);" id="setTag">画布</a>&nbsp;&nbsp;'+
                    '<img width="30" height="20" id="tag-field"/>'+
                    '<a href="javascript:void(0);" id="clear-tag">删除</a>'+
                 '</div>';
    	$root.append(html);
    	$('#setTag').click(function(){
    		CanvasDialog.open();
    	});
    	$('#tag-field').toggle(function(){
    		$(this).attr('width','200');
    		$(this).attr('height','100');
    	},function(){
    		$(this).attr('width','30');
    		$(this).attr('height','20');
    	});
    	$('#clear-tag').click(function(){
    		$('#tag-field').attr('src','');
    		Dispacher.notify('tag.change',{img:null});
    	});
    },
    /**
	 * @access private
	 */
    initRepeatField : function($root){
    	var html='<div class="row">'+
                   '<label>重复</label>'+
                   '<p><a href="javascript:void(0);" id="setRepeat">设置</a><span id="repeat-info"></span></p>'+
                 '</div>';
    	$root.append(html);
    	$('#setRepeat').click(function(){
    		RepeatDialog.open();
    	});
    },
    /**
	 * @access private
	 */
    initDueField : function($root){
    	var html='<div class="row">'+
                   '<p>'+
    	             '<a href="javascript:void(0)" id="due-date">过期时间</a>&nbsp;&nbsp;'+
    	             '<span id="dueDate-info"></span>&nbsp;&nbsp;&nbsp;&nbsp;'+
    	             '<a href="javascript:void(0);" id="clear-dueDate">清空</a>'+
    	           '</p>'+ 
                 '</div>';
    	$root.append(html);
    	$('#due-date').click(function(){
    		DateDialog.openForDueDate();
    	});
    	
    	$('#clear-dueDate').click(function(){
    		$('#dueDate-info').empty();
    	});
    },
    initRecordField : function($root){
    	var html='<div class="row">'+
                   '<p>'+
                   '<a href="javascript:void(0)" id="record">录音</a>&nbsp;&nbsp;'+
                   '<input id="sound" type="file" name="sound" /> '+
                    '<embed id="player" showtracker="true" enablecontextmenu="false" '+
                   'showpositioncontrols="false" showstatusbar="true" autostart="auto"' +
                   'loop="false" volume="20" type="audio/mpeg" '+
                   'src="" '+
                   'style="width: 200px; height: 20px;">'+
                   '<input type="button" id="delete-sound" value="删除音频"/>'+
                   '</p>'+ 
             '</object> '+
                  '</div>';
    	$root.append(html);
    	$('#player').hide();
    	$('#delete-sound').hide();
    	$('#record').click(function(){
    		RecordDialog.open();
    	});
        $('#delete-sound').click(function(){
	        NewEditDialog.settings .task.deleteSound(function(){
	        	$('#player').hide();
	        });
        });
    },
    
    hasSound : function(){
    	if($('#sound').val()!==''){
    		return true;
    	}else{
    		return false;
    	}
    	
    },
    /**
	 * @access private
	 */
    initButtons:function($root){
    	var html='<div class="row buttons-row"></div>';
    	$('.buttons-row',this.settings.root).remove();
    	$root.append(html);
    	switch(this.settings.type){
    	   case 'edit':
    		    $('.buttons-row',this.settings.root).html('<input type="button" id="edit-ensure" value="确定"/>'+
                                       '<input type="button" id="edit-cancel" value="取消"/>');
    		   break;
    	   case 'new':
    		   $('.buttons-row',this.settings.root).html( '<input type="button" id="add" value="添加" />'+
                                       '<input type="button" id="add-continue" value="添加，并继续" />');
    		   break;
    		   default:
    			   break;
    	}
    },
    initActions : function($root){
    	var that=this;
    	$('#add').live('click',function(){
    		new Task().create({
    			exeDate : $("#date-field").val(),
    			dueDate:($('#dueDate-info').html()=='')?0:$('#dueDate-info').html(),
    			title : $("#title-field").val(),
    			note : $("#note-field").val(),
    			focusField : $("#focus-field").val()
    		},function(data){
    			Dispacher.notify('task.create',{task:data.task,template:data.template});
			    $root.dialog("close");
			    that.clear();
    		});
    	});
    	
    	$('#add-continue').live('click',function() {
    		new Task().create({
    			exeDate : $("#date-field").val(),
		    	dueDate:($('#dueDate-info').html()=='')?0:$('#dueDate-info').html(),
		    	title : $("#title-field").val(),
		    	note : $("#note-field").val(),
		    	focusField : $("#focus-field").val()
    		},function(data){
    			NewEditDialog.clear();
	        	Repeat.init();
	        	Dispacher.notify('task.create',{task:data.task,template:data.template});
	        	that.clear();
    		});
		});
    	
    	$('#edit-ensure').live('click',function(){
    	    getCurrentTask().edit({
    	    	exeDate : $("#date-field").val(),
    	    	dueDate:$('#dueDate-info').html(),
				//dueDate:($('#dueDate-info').html()=='')?0:$('#dueDate-info').html(),
				title : $("#title-field").val(),
				note : $("#note-field").val(),
				focusField : $("#focus-field").val()
    	    },function(data){
    	    	//task.parent=getCurrentTask().parent;
    	    	Dispacher.notify('task.edit',{task:data.task,task_before:getCurrentTask(),template:data.template});
				$root.dialog("close");
				that.clear();
    	    });
    	});
    	$('#edit-cancel').live('click',function(){
    		$root.dialog("close");
    		that.clear();
    	});
    }
};

var RepeatDialog={
	settings:{
	  type : 'daily',
	  post : false,
	  root : null
    },
    init : function(options){
    	$.extend(this.settings,options);
    	$root=$(this.settings.root);
    	this.initRepeatType($root);
    	this.initRepeatDetail($root);
    	
    	$root.dialog( {
  		  modal : true,
  		  width : 500,
  		  autoOpen: false,
          buttons:{
      		'确定':function(){
      		    var days='';
      		    $.each($(':checkbox','#repeat-days'),function(i,item){
      		    	if($(item).attr("checked")==true){
      		    		days=days+','+$(item).attr('id').split('-')[1];
      		    	}
      		    });
      		    
      		    days=days.substr(1);
      		    Repeat.set({type:$('#repeat-type').val(),frequency:$('#frequency').val(),days:days});
      		    if(RepeatDialog.settings.post==true){
      		    	getCurrentTask().edit({},function(data){});
      		    	RepeatDialog.settings.post=false;
      		    }
      		    $(this).dialog('close');
      	    },
      		'取消':function(){
      		    $(this).dialog('close');
      	    }
      	  }
  		});
    },
    /**
	 * @access private
	 */
    initRepeatType : function ($root){
    	var html = '<div id="repeat_form">' + 
    	              '<p><b>重复方式:</b></p>' + 
    	              '<select id="repeat-type">' + 
    	                '<option value="daily">按日</option>'+ 
    	                '<option value="weekly">按周</option>' + 
    	                '<option value="monthly">按月</option>' + 
    	                '<option value="yearly">按年</option>' + 
    	              '</select>' + 
    	              '<div id="repeat-detail"></div>' + 
    	           '</div>';
        
    	$root.html(html);
    	$('#repeat-type').change(function(){
    		($(this).val()=='weekly')?$('#repeat-detail').show():$('#repeat-detail').hide();
    		//this.initRepeatDetail()
    	});
    },
    /**
	 * @access private
	 */
    initRepeatDetail : function($root){
    	html = '<p>重复频率：每<input id="frequency" type="text" size="3" value="1"></input>周</p>' + 
    	       '<div id="repeat-days">重复日'+
    	          '<input type="checkbox" id="weekday-1"value="1">周一</input>&nbsp;'+
    	          '<input type="checkbox" id="weekday-2"value="2">周二</input>&nbsp;'+
    	          '<input type="checkbox" id="weekday-3"value="3">周三</input>&nbsp;'+
    	          '<input type="checkbox" id="weekday-4"value="4">周四</input>&nbsp;'+
    	          '<input type="checkbox" id="weekday-5"value="5">周五</input>&nbsp;'+
    	          '<input type="checkbox" id="weekday-6"value="6">周六</input>&nbsp;'+
    	          '<input type="checkbox" id="weekday-7"value="7">周日</input>&nbsp;'+
    	       '</div>';
    	$('#repeat-detail').html(html);
    	//($('#repeat-type').val()=='weekly')?$('#repeat-detail').show():$('#repeat-detail').hide();
    },
    /**
	 * @access public
	 */
    open : function (post){
    	this.settings.post=post||false;
    	//this.settings.task_id=task_id||0;
    	$root=$(this.settings.root);
    	var repeat=Repeat.get();
    	RepeatDialog.clear();
    	RepeatDialog.set(repeat.type,repeat.frequency,repeat.days);
        $root.dialog('open');
    },

    /**
	 * @access public
	 * clear dialog
	 */
   clear : function(){
    	$('#repeat-type').val('daily');
    	$('#frequency').val(1);
    	for(var x in $('#repeat-days').children()){
			$('#repeat-days :nth-child('+x+')').attr('checked',false);
		}
    },
    set : function($type,$frequency,$days){
    	$('#repeat-type').val($type);
    	($type=='weekly')?$('#repeat-detail').show():$('#repeat-detail').hide();
    	$('#frequency').val($frequency);
    	$days=$days.split(',');
    	for ( var i in $days) {
			$('#weekday-' + $days[i]).attr('checked', true);
		}
    }
};

var TextDialog={
	settings:{
	type : 'comment',
	root:null,
	task_id:0,
	task:null,
	toFocusField:null
    },
    init : function(options){
    	$.extend(this.settings,options);
    	var $root=$(this.settings.root);
    	$(this.settings.root).dialog( {
  			width : 500,
  			height : 300,
  			autoOpen : false
  		});
    	this.initActions($root);
    },

    initButtons : function($root){
    	var html='';
    	if(this.settings.type=='message'){
    	  html+='<div class="row buttons-row " >'+
                  '<input type="button" id="read" class="fr mr" value="我知道了" />'+
                '</div>';
    	}
    	if(this.settings.type=='active-parent'){
    		html+='<div class="row buttons-row " >'+
                    '<input type="button" id="active-ensure"  value="确定" />'+
                    '<input type="button" id="active-cancel"  value="取消" />'+
                  '</div>';
    	}
    	if(this.settings.type=='done-children'){
    		html+='<div class="row buttons-row " >'+
                    '<input type="button" id="active-ensure"  value="确定" />'+
                    '<input type="button" id="active-cancel"  value="取消" />'+
                  '</div>';
    	}
        $root.append(html);
     
    },
    initActions : function($root){
    	 $('#read').live('click',function(){
      	    $.post('/api/tasks/read', {
  				messageIds : Messages.getIds()
  			}, function(data) {
  			});
      	   $root.dialog("close");
         });
         $('#active-ensure').live('click',function(){
        	 getCurrentProject().edit({focusField:'next'},function(data){
        		 Dispacher.notify('task.edit',{task:data.task});
        		 TextDialog.settings.task.edit({focusField:TextDialog.settings.toFocusField},function(data){
        		     Dispacher.notify('task.edit',{task:data.task});
        			 $root.dialog("close");
        		 });
        	 });
         });
         $('#active-cancel').live('click',function(){
        	 $root.dialog("close");
         });
    },
    open : function(options){
      $.extend(this.settings,options);
	  var $root=$(this.settings.root);
	  var title;

	  switch(this.settings.type){
	    case 'comment':
	    	title='评论';
	    	$root.html('正在载入评论......');
		    $.getJSON("/api/tasks/listComments", {
				taskId : this.settings.task_id
			}, function(data) {
				$root.html(Comments.makeList(data));
			});
	    	break;
	    case 'message':
	    	title='未读消息';
	    	$root.html('正在载入消息......');
	    	$.getJSON('/api/tasks/listmessages',{},function(data){
	    		$root.html(Messages.makeList(data));
	    		if(!$.isEmptyObject(data))
	    		   TextDialog.initButtons($root);
	    	});
	    	break;
	    case 'active-parent':
	    	title='是否激活项目？';
	    	$root.html('如果不激活项目此操作将不能执行，要激活项目吗？');
	    	break;
	    case 'done-children':
	    	title='是否完成所有子任务？';
	    	var x=0;
	    	$.each($('.task-list'),function(i,item){
	    		if(!$(item).hasClass('done'))
	    			i++;
	    	});
	    	$root.html('还有'+x+'条子任务没有完成，要完成他们吗？');
	    	break;
	    default:
	    	break;
	  }
	  $root.dialog('option','title',title);
	  $root.dialog('open');
	  this.initButtons($root);
    }
};
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

var RecordDialog={
		settings:{
			root:null
			
		},
		init: function(options){
			  $.extend(this.settings,options);
			  var $root=$(this.settings.root);
			  this.initCall();
			  this.initRecord($root);
			  this.initActions();
			 // this.initActions();
			  $root.dialog( {
		  			width : 500,
		  			height : 300,
		  		
		  			autoOpen : false,
		  			buttons:{
		  				'关闭':function(){
				  $root.dialog('close');
		  				}
		  			
		  			}
		  		});
		},
		
		initRecord : function($root){
			$root.html(
			'<div id="flashContent"></div>'

			);
		},
		initCall :function(){
			var InternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
			function TestRecorder_DoFSCommand(command, args){
			  //var myFlashObj = InternetExplorer ? TestRecorder : document.TestRecorder;
			  //console.log(args);
			 alert (args);
			}
			if (navigator.appName && navigator.appName.indexOf("Microsoft") != -1 && 
			  navigator.userAgent.indexOf("Windows") != -1 && navigator.userAgent.indexOf("Windows 3.1") == -1) {
			  document.write('<SCRIPT LANGUAGE=VBScript\> \n');
			  document.write('on error resume next \n');
			  document.write('Sub myFlash_FSCommand(ByVal command, ByVal args)\n');
			  document.write(' call myFlash_DoFSCommand(command, args)\n');
			  document.write('end sub\n');
			  document.write('</SCRIPT\> \n');
			} 
		},
		initActions:function(){

			   var swfVersionStr = "10.0.0";
	            var xiSwfUrlStr = "playerProductInstall.swf";
	            var flashvars = {};
	            var params = {};
	            params.quality = "high";
	            params.bgcolor = "#ffffff";
	           // params.allowscriptaccess = "sameDomain";
	            params.allowfullscreen = "true";
	            params.swLiveConnect="true";
	            params.allowScriptAccess="always";
	            params.swliveconnect="true";
	            var attributes = {};
	            attributes.id = "TestRecorder";
	            attributes.name = "TestRecorder";
	            attributes.align = "middle";
	            swfobject.embedSWF(
	                "/res/swf/TestRecorder.swf", "flashContent", 
	                "320", "200", 
	                swfVersionStr, xiSwfUrlStr, 
	                flashvars, params, attributes);
				swfobject.createCSS("#flashContent", "display:block;text-align:left;");
		},
		  open: function(){
		  
					$(this.settings.root).dialog('open');
		  }
};