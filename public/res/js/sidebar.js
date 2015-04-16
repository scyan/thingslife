var sideBar=function(){
	var $root=$('#focus-panel');
	var _this={};
	_this.init=function(){
		$('[action-type=changeField]').droppable({
			accept:function(d){
				var task=$(d).data('task');
				if(!task){
					return false;
				}
				if(!task.isDone()&&$(this).attr('box')=='archived'){
					return false;
				}
				if(task.isProject()){
					if($(this).attr('box')=='archived'&&task.doneItems<task.items){
						return false;
					}
					if($(this).attr('box')=='inbox'||$(this).attr('box')=='today'||$(this).attr('box')=='next'){
						return false;
					}
				}
				if(task.isSubTask()){
					if($(this).attr('box')=='project'){
						return false;
					}
				}
				if($(this).attr('box')=='schedule'){
					return true;
				}
				if($(d).data('task').box().find($(this).attr('box'))>-1){
					return false;
				}
				return true;
			},
			activeClass:'droppable-hover',
			drop:function(event,ui){
				var task=$(ui.draggable).data('task');
				var data=queryToJson($(this).attr('action-data'));
				if(data.focusField=='schedule'){
					DateDialog.open(task);
				}else{
					task.edit(data,function(){
						$(ui.draggable).attr('accepted',true);
					});
				}
			//	$(ui.draggable).remove();
			}
		});
	};
	_this.initActions=function(){
		Dispacher.connect('changeField',function(event,data){
			$('[action-type=changeField]',$root).removeClass('current');
			var box=data.focusField;
			if(data.focusField=='inproject'){
				box=data.focusField+'-'+data.id;
			}
			$('[box='+box+']').addClass('current');
		});
		Dispacher.connect('task.edit task.create',function(event,data){
			$.get('/me/sidebar',FocusField.get(),function(res){
				_this.change(res);
			});
		});
		$root.delegate('[action-type=changeField]','click',function(){
			var data=queryToJson($(this).attr('action-data'));
		//	window.history.pushState("", "","/test");
			//	FocusField.set(data.focusField,data);
			Dispacher.notify('changeField',data);
				//mainPanel.change(data);
		});
		
	};
	_this.change=function(res){
		$root.html(res);
		_this.init();
	};
	return {
		init:function(){
			_this.init();
			_this.initActions();
		}
	};
}();
sideBar.init();