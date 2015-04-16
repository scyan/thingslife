var newDialog=function(){
	var isOpen=false;
	var $root=$('<div class="dialog task-form edit-dialog"></div>');
	var _this={};
	_this.render=function(){
			_this.task=new Task();
			_this.task.type=_this.type;
			_this.task.focusField=FocusField.get().focusField;
			$root.html(template(Templates.newDialog(),_this.task));
			$root.dialog( {
				title:'添加任务',
				modal : true,
				width : 550,
				height : 320,
				buttons:{
					'添加':_this.submit,
					'添加，并继续':_this.submitContinue
				},
				close:_this.close
			});
			_this.initActions();
	};
	_this.tomorrow=function(){
		var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		var day = currentDate.getDate();
		var month = currentDate.getMonth() + 1;
		var year = currentDate.getFullYear();
		return year+'-'+month+'-'+day;
	};
	_this.initActions=function(){
		/*var validator = $root.validate({
			rules: {
				name: {
					required: true,
				},
			},
			messages: {
				name: {
					required: "请输入标题",
				}
			},
			submitHandler:function(form){
	            alert("submitted");   
	         //   form.submit();
	        } ,
			onkeyup: false
		});*/
		//箱子改变决定是否显示日期
		$root.delegate('#focus-field','change',function(){
			if($(this).val()=='schedule'){
				if(_this.task.exeDate){
					$('#belongto',$root).append(template(Templates.exeDate(),_this.task));
				}else{
					$('#belongto',$root).append(template(Templates.exeDate(),{exeDate:_this.tomorrow()}));
				}
			}else{
				$('#date-field',$root).remove();
			}
			//日程时间设置,点击弹出日历
			$('#date-field',$root).datepicker({
	    		dateFormat : 'yy-mm-dd',
				monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
				dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
				minDate : 1
	    	});
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
    		CanvasDialog.open(newDialog,_this.task.tagObj);
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
    		RepeatDialog.open(_this.task.repeat);
    	});
		//打开日历dialog
		$root.delegate('#due-date','click',function(){
    		DateDialog.openForDueDate();
    	});
		$root.keydown(function(event) {
			var e=event||window.event;
			if(e.keyCode==13){
				_this.submitContinue();
			}
		});
	};
	_this.submit=function(){
		var check=$root.checkform();
		if(!check.valid){
			return;
		}
		var queryData=formToJson($root);
		
		queryData['repeat']=_this.task.repeat.get();
		queryData['tag']=_this.task.tagObj.get();
		var focusField=FocusField.get();
		if(focusField.focusField=='inproject'){
			queryData['parent']=focusField.id;
		}
		if(_this.type&&_this.type=='repeat'){
			if(queryData['repeat']['empty']){
				alert('请设置重复');
				return;
			}
			_this.task.createTemplate(queryData,function(data){
				$root.dialog("close");
			});
		}else{
			_this.task.create(queryData,function(data){
				$root.dialog("close");
			});
		}

	};
	_this.submitContinue=function(){
		if(!check.valid){
			return;
		}
		var queryData=formToJson($root);
		queryData['repeat']=_this.task.repeat.get();
		queryData['tag']=_this.task.tagObj.get();
		var focusField=FocusField.get();
		if(focusField.focusField=='inproject'){
			queryData['parent']=focusField.id;
		}
		if(_this.type&&_this.type=='repeat'){
			if(!queryData['repeat']['empty']){
				alert('请设置重复');
				return;
			}
			_this.task.createTemplate(queryData,function(data){});
		}else{
			_this.task.create(queryData,function(data){});
		}
	};
	_this.close=function(){
		$root.remove();
		isOpen=false;
	};

	return {
		open:function(type){
			if(isOpen) return;
			isOpen=true;
			_this.type=type;
			_this.render();
		},
		isOpen:function(){
			return isOpen;
		},
		task:function(){
			return _this.task;
		},
		refreshTag:function(){
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
		changeRepeat:function(obj){
			$('#repeat-info',$root).html(template(Templates.repeat_info(),_this.task));
		}
	};
}();