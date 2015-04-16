var editDialog=function(){
	var isOpen=false;
	var $root=$('<div class="dialog task-form new-form edit-dialog" id="edit-form"></div>');
	var _this={};
	_this.render=function(){
		getCurrentTask().show(function(data){
			_this.task=new Task(data.task);
			_this.task.focusField=FocusField.get().focusField;
			$root.html(template(Templates.editDialog(),_this.task));
			$root.dialog( {
				title:'编辑任务',
				modal : true,
				width : 550,
				height : 320,
				buttons:{
					'确定':_this.submit,
					'取消':_this.close
				},
				close:_this.close
			});
			_this.initActions();
		});
	};
	_this.tomorrow=function(){
		var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		var day = currentDate.getDate();
		var month = currentDate.getMonth() + 1;
		var year = currentDate.getFullYear();
		return year+'-'+month+'-'+day;
	};
	_this.initActions=function(){
		//箱子改变决定是否显示日期
		$root.delegate('#focus-field','change',function(){
			if($(this).val()=='schedule'){
				if(_this.task.exeDate){
					$('#belongto',$root).append(template(Templates.exeDate(),_this.task));
				}else{
					$('#belongto',$root).append(template(Templates.exeDate(),{exeDate:_this.tomorrow()}));
				}
				//日程时间设置,点击弹出日历
				$('#date-field',$root).datepicker({
		    		dateFormat : 'yy-mm-dd',
					monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
					dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
					minDate : 1
		    	});
			}else{
				$('#date-field',$root).remove();
			}
		});
		//点击弹出repeatDialog
		$root.delegate('#setRepeat','click',function(){
    		RepeatDialog.open(_this.task.repeat);
    	});
		//日程时间设置,点击弹出日历
		$('#date-field',$root).datepicker({
    		dateFormat : 'yy-mm-dd',
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
			dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
			minDate : 1
    	});
		//过期时间设置,点击弹出日历
		$('#due-date-field',$root).datepicker({
			dateFormat : 'yy-mm-dd',
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
			dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
			minDate : 0
		});
		//点击打开canvasdialog
		$root.delegate('#setTag','click',function(){
    		CanvasDialog.open(editDialog,_this.task.tagObj);
    	});
		$root.delegate('#clear-tag','click',function(){
			_this.task.tagObj.set({name:''});
			$('#tag-info',$root).hide();
		});
		$root.delegate('[action-type=clear-dueDate]','click',function(){
			$('#due-date-field',$root).val('');
		});
		//tag缩放
		$('#tag-field',$root).toggle(function(){
    		$(this).attr('width','200');
    		$(this).attr('height','100');
    	},function(){
    		$(this).attr('width','30');
    		$(this).attr('height','20');
    	});
		//点击打开重复设置框
		$root.delegate('#setRepeat','click',function(){
    		RepeatDialog.open();
    	});
		//打开日历dialog
		$root.delegate('#due-date','click',function(){
    		DateDialog.openForDueDate();
    	});
		
	};
	//确认按钮
	_this.submit=function(){
		var check=$root.checkform();
		if(!check.valid){
			return;
		}
		var queryData=formToJson($('#edit-form'));
		queryData['repeat']=_this.task.repeat.get();
		queryData['tag']=_this.task.tagObj.get();
		_this.task.edit(queryData,function(data){
			_this.close();
		});
	};
	//取消按钮和关闭
	_this.close=function(){
		$root.remove();
		isOpen=false;
	};

	return {
		open:function(){
			if(isOpen){
				return;
			}
			isOpen=true;
			_this.render();
		},
		isOpen:function(){
			return isOpen;
		},
		task:function(){
			return _this.task;
		},
		refreshTag:function(){
			//console.log(template(Templates.tag_info(),_this.task));
			$('#tag-info',$root).html(template(Templates.tag_info(),_this.task));
			//tag缩放
			$('#tag-field',$root).toggle(function(){
	    		$(this).attr('width','200');
	    		$(this).attr('height','100');
	    	},function(){
	    		$(this).attr('width','30');
	    		$(this).attr('height','20');
	    	});
		},
		changeRepeat:function(){
			$('#repeat-info',$root).html(template(Templates.repeat_info(),_this.task));
		}
	};
}();
