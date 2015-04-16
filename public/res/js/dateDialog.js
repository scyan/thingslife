var DateDialog=function(){
	var isOpen=false;
	var $root=$('<div id="date-dialog" title="日期" class="dialog " ></div>');
	var _this={};
	_this.render=function(){
		$root.datepicker( {
			dateFormat : 'yy-mm-dd',
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
			dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
			minDate : 1
		});
		$root.dialog( {
		 	modal : true,
		 	buttons:{
				'确定':_this.submit,
				'取消':_this.close,
			},
			close:_this.close,
		});
	};
	_this.submit=function(){
		_this.task.edit({
			focusField:'schedule',
			exeDate : $root.val()
		},function(data){
		//	Dispacher.notify('task.edit',{task:data.task,task_before:_this.task});
		});
		_this.close();
	};
	_this.close=function(){
		$root.remove();
		isOpen=false;
	};
	return {
		open:function(task){
			_this.task=task;
			_this.render();
		}
	};
}();
