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
	  this.initActions($root);
	  
	  $root.dialog( {
			modal : true,
			width : 550,
			height : 320,
            autoOpen : false
		});
	  Dispacher.connect('dueDateField.change',function(event,args){
		  if($('#dueDate-info').text()==''){
			  $('.dueDate-bar').hide();
		  }else{
			  $('.dueDate-bar').show();
		  }
	  });
    },
    render:function(data){
    	 var $root=$(this.settings.root);
    	 $root.empty();
    	  this.initTitleField($root,data);
    	  this.initBelongField ($root,data);
    	  this.initNoteField($root,data);
    	  this.initRepeatField($root,data);
    	  this.initDueField($root,data);
    	//  this.initRecordField($root,data);
    	  this.initButtons($root);
    },
    /**
	 * @access public
	 */
    open : function (options){
    	$.extend(this.settings,options);
    	
    	var $root=$(this.settings.root);
    	var title=(this.settings.type=='edit')?'编辑任务':'添加任务';
    	var that=this;
        Repeat.init();//清空repeat对象的数据
        //TODO
        CanvasDialog.clear();//清空画布
    	$root.dialog('option','title',title);

    	if(this.settings.type=='edit'){
    		this.settings.task=getCurrentTask();
    		getCurrentTask().show(function(data){
    			  that.render(data);
				  if (data.repeat) {
					Repeat.set(data.repeat);
				  }
				  $root.dialog('open');
    		});
    	}else{
    		that.render();
    		 $root.dialog('open');
    	}
    },
    /**
	 * @access public
	 * clear dialog
	 */
    clear : function(){
/*    	$('#title-field').val('');
		$('#note-field').val('');
		$('#repeat-info').empty();
		$('#dueDate-info').empty();
		Dispacher.notify('dueDateField.change');
		$('#sound').val('');
		$('#player').hide();
		$('#player').attr('src','');
		$('#delete-sound').hide();
		$('#tag-field').attr('src','');*/
    },
    isOpen : function(){
    	return $(this.settings.root).dialog('isOpen');
    },
    /**
	 * @access private
	 */
    initTitleField : function ($root,data){
    	var title=(data==undefined)?'':data.task.title;
    	var html='<div class="row">'+
    	           '<label for="title-field">任务</label>'+
    	           '<input type="text" id="title-field" name="title" value="'+title+'"/>'+
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
    initBelongField : function ($root,data){
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
    	if(data!=undefined){
    		(data.task.repeatId==0)?$('#belongto').show():$('#belongto').hide();
    		$('#focus-field').val(data.task.focusType);
    		 (data.task.exeDate==0)?$('#date-field').val(TimeMachine.tomorrow('Y-m-d')):$('#date-field').val(TimeMachine.custom(data.task.exeDate*1000));
    	}else{
    		$('#focus-field').val(FocusField.get());
    		$('#date-field').val(TimeMachine.tomorrow('Y-m-d'));
    	}
    	$('#focus-field').val()=='schedule'?$('#date-field').show():$('#date-field').hide();
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
    initNoteField : function ($root,data){
    	var note='';
    	var tag_src='';
    	if(data!=undefined){
    		note=data.task.note;
    		if(data.task.tag>0){
  			  tag_src=data.tag.name+'?i='+Math.random();
  		  	}
    	}
    	var html='<div class="row">'+
                   '<label for="note-field">备注</label>'+
                   '<textarea id="note-field" name="note">'+note+'</textarea>'+
                 '</div>'+
                 '<div class="row">'+
                    '<label for="tag-field">标签</label>'+
                    '<a class="edit-dialog-icons set-tag" href="javascript:void(0);" id="setTag"></a>&nbsp;&nbsp;'+
                    '<span class="tag-bar"><img width="30" height="20" id="tag-field" src="'+tag_src+'"/><a  class="clear-tag" href="javascript:void(0);" id="clear-tag"></a></span>'+
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
    	$('#clear-tag','#new-edit-dialog').click(function(){
    		$('#tag-field','#new-edit-dialog').attr('src','');
    		Dispacher.notify('tag.change',{img:null});
    	});
    },
    /**
	 * @access private
	 */
    initRepeatField : function($root,data){
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
    initDueField : function($root,data){
    	var html='<div class="row">'+
    				'<label for="due-date-field">过期时间</label>'+
    	             '<a class="edit-dialog-icons due-date" href="javascript:void(0)" id="due-date"></a>&nbsp;&nbsp;'+
    	             '<span class="dueDate-bar"><span id="dueDate-info"></span><a class=" clear-tag " href="javascript:void(0);" id="clear-dueDate"></a></span>'+
                 '</div>';
    	$root.append(html);
    	if(data!=undefined){
    		  (data.task.dueDate!=0)?$('#dueDate-info').html(TimeMachine.custom(data.task.dueDate*1000)):'';
    	}
    	$('#due-date').click(function(){
    		DateDialog.openForDueDate();
    	});
    	
    	$('#clear-dueDate').click(function(){
    		$('#dueDate-info').empty();
    		Dispacher.notify('dueDateField.change');
    	});
    },
    initRecordField : function($root,data){
    	var html='<div class="row">'+
    				'<label for="due-date-field">录音</label>'+
                   '<a  class="edit-dialog-icons record" href="javascript:void(0)" id="record"></a>&nbsp;&nbsp;'+
                   '<input id="sound" type="file" name="sound" /> '+
                    '<embed id="player" showtracker="true" enablecontextmenu="false" '+
                   'showpositioncontrols="false" showstatusbar="true" autostart="auto"' +
                   'loop="false" volume="20" type="audio/mpeg" '+
                   'src="" '+
                   'style="width: 200px; height: 20px;">'+
                   '<input type="button" id="delete-sound" value="删除音频"/>'+
             '</object> '+
                  '</div>';
    	$root.append(html);
    	if(data!=undefined&&data.task.sound>0){
    		 $('#player').attr('src','/res/upload/sound_'+data.task._id+'.wav?i='+Math.random());
    	}else{
    		$('#player').hide();
    		$('#delete-sound').hide();
    	}
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
    	    	dueDate:$('#dueDate-info').text(),
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