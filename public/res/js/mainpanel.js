var mainPanel=function(){
	var $root=$('#content');
	var _this={};
	_this.init=function(){
		$('[node-type=projectInfo]').each(function(){
			$(this).data('task',new Task($(this).attr('action-data').toJson()));
		});
		if(FocusField.get().focusField=='inproject'){
			_this.task=$('[node-type=projectInfo]',$root).data('task');
		}
		$('[node-type=taskItem]').each(function(){
			$(this).data('task',new Task($(this).attr('action-data').toJson()));
		});
		$('.things-draggable').draggable({
			cancel:'.checkbox',
			 revert : "invalid", 
			 appendTo: "body",
			 helper : function(event){
				$node=$(this).clone();
				$node.data('task',$(this).data('task'));
				var width=document.defaultView.getComputedStyle($(this).parents('ul')[0]).width;
				$ret=$(this).parents('ul').clone().empty();
			//	$ret.css('width',width);
				$ret.append($node);
				$(this).css('visibility','hidden');
				 return $ret;
			   },
			   stop:function(a,b){
				   $(this).css('visibility','visible');
			   }
		//	 cursorAt: { left: 10, top: 5 }
		});
		$('[autogrow=true]',$root).autogrow();
		//过期时间设置,点击弹出日历
		$('[action-type=dueDate]',$root).datepicker({
			dateFormat : 'yy-mm-dd',
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
			dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
			minDate : 0
		});
		//tag缩放
		$('[node-type=tag-field]',$root).toggle(function(){
    		$(this).attr('width','200');
    		$(this).attr('height','100');
    	},function(){
    		$(this).attr('width','30');
    		$(this).attr('height','20');
    	});
	};
	_this.initActions=function(){
		Dispacher.connect('changeField',function(event,data){
			$.get('/me/'+data.focusField,data,function(data){
				_this.change(data);
			});
		});
		Dispacher.connect('task.edit task.create task.archive task.destroy',function(event,data){
			$.get('/me/'+FocusField.get().focusField,FocusField.get(),function(data){
				_this.change(data);
			});
		});
		
		$root.delegate('[node-type=taskItem]','click',function(){
			$('[node-type=taskItem]',$root).removeClass('selected');
			$(this).addClass('selected');
			Dispacher.notify('task.selected',$(this).data('task'));
		});
		$root.delegate('[node-type=taskItem]','dblclick',function(){
			var task=$(this).data('task');
			if(task.isArchived()||task.isDeleted()){
				return false;
			}
			if(task.isProject()){
				Dispacher.notify('changeField',{focusField:'inproject',id:task._id});
			}else{
				editDialog.open();
			}
		});
		$root.delegate('.progress-bar','click',function(){
			var task=$(this).parents('[node-type=taskItem]').data('task');
			Dispacher.notify('changeField',{focusField:'inproject',id:task._id});
		});
		$root.delegate('.checkbox','click',function(event){
			if($(this).parents('[node-type=taskItem]').size()>0){
				var item=$(this).parents('[node-type=taskItem]');
			}else if($(this).parents('[node-type=projectInfo]').size()>0){
				var item=$(this).parents('[node-type=projectInfo]');
			}else{
				return;
			}
			var task=item.data('task');
			if(task.isDeleted()){
				return;
			}
			var that=this;
			var e=event||window.event;
			if(e&&e.topPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble=true;
			}
			if(task.isDone()){
				task.unfinish();
			}else{
				task.finish();
			}
		});
		
		
		$root.delegate('[node-type=projectTitle]','blur',function(){
			var task=$(this).parents('[node-type=projectInfo]').data('task');
			if(task){
				task.edit({title:$(this).val()});
			}
		});
		$root.delegate('[node-type=projectNote]','blur',function(){
			var task=$(this).parents('[node-type=projectInfo]').data('task');
			if(task){
				task.edit({note:$(this).val()});
			}
		});
		$root.delegate('#setTag','click',function(){
			CanvasDialog.open(mainPanel,_this.task.tagObj);
		});
		$root.delegate('[action-type=clear-tag]','click',function(){
			_this.task.tagObj.set({name:''});
			$('#tag-info',$root).hide();
			_this.task.edit({tag:_this.task.tagObj});
		});
		$root.delegate('[action-type=dueDate]','change',function(){
			_this.task.edit({dueDate:$(this).val()});
		});
		$root.delegate('[action-type=clear-dueDate]','click',function(){
			$('[action-type=dueDate]',$root).val('');
			$('[action-type=dueDate]',$root).trigger('change');
		});
	};
/*	_this.checkSelect=function(){
		if($('.selected',$root).size()>0){
			Dispacher.notify('task.selected');
		}
	};*/
	_this.change=function(html){
		$root.html(html);
		_this.init();
	};
	return {
		init:function(){
			_this.init();
			_this.initActions();
		},
		change:function(html){
			_this.change(html);
		},
		refreshTag:function(){
		//	$('#tag-info',$root).html(template(Templates.tag_info(),_this.task));
			_this.task.edit({'tag':_this.task.tagObj});
		},
	};
	
}();
mainPanel.init();