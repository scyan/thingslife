var Toolbar=function(){
	var $root=$('#toolbar');
	var _this={};
	_this.initActions=function(){
		Dispacher.connect('changeField',function(event,data){
			$.get('/me/toolbar',data,function(res){
				$root.html(res);
			});
		});
		Dispacher.connect('task.edit task.archive task.destroy',function(event,data){
			$.get('/me/toolbar',FocusField.get(),function(res){
				$root.html(res);
			});
		});
		Dispacher.connect('task.selected',function(event,task){
			$root.find('[action-type=editTask]').removeClass('disabled');
			$root.find('[action-type=deleteTask]').removeClass('disabled');
			$root.find('[action-type=nextTask]').removeClass('disabled');//改日
			$root.find('[action-type=todayTask]').removeClass('disabled');//今日
			if(!task.isTemplate()){
				$root.find('[action-type=scheduleTask]').removeClass('disabled');//计划
			}
			$root.find('[action-type=inactiveProject]').removeClass('disabled');//冻结
			$root.find('[action-type=activeProject]').removeClass('disabled');//激活
			
			if(task.isToday()){
				$root.find('[action-type=todayTask]').hide();//今日
				$root.find('[action-type=nextTask]').css('display','inline-block');//改日
			}else{
				$root.find('[action-type=nextTask]').hide();//改日
				$root.find('[action-type=todayTask]').css('display','inline-block');//今日
			}
			if(task.isToday()||task.isNext()){
				$root.find('[action-type=activeProject]').hide();//激活
				$root.find('[action-type=inactiveProject]').css('display','inline-block');//冻结
			}else{
				$root.find('[action-type=inactiveProject]').hide();//冻结
				$root.find('[action-type=activeProject]').css('display','inline-block');//激活
			}
		});
		$root.delegate('[action-type=newProject]','click',function(){
			if(!$(this).hasClass('disabled')){
				new Task().create({title:'project',focusField:'project'});
    		}
		});
		$root.delegate('[action-type=editTask]','click',function(){
			if(!$(this).hasClass('disabled')){
				var task=getCurrentTask();
				if(task.isProject()){
					Dispacher.notify('changeField',{focusField:'inproject',id:task._id});
				}else{
					editDialog.open();
				}
			}
		});
		$root.delegate('[action-type=newTask]','click',function(){
			if(!$(this).hasClass('disabled')){
				newDialog.open();
			}
		});
		$root.delegate('[action-type=newRepeat]','click',function(){
			if(!$(this).hasClass('disabled')){
				newDialog.open('repeat');
			}
		});
		$root.delegate('[action-type=scheduleTask]','click',function(){
			if(!$(this).hasClass('disabled')){
				DateDialog.open(getCurrentTask());
			}
		});
		
		$root.delegate('[action-type=deleteTask]','click',function(){
			if(!$(this).hasClass('disabled')){
				getCurrentTask().edit({'focusField':'deleted'});
			}
		});
		
		$root.delegate('[action-type=todayTask]','click',function(){
			if(!$(this).hasClass('disabled')){
				getCurrentTask().edit({'focusField':'today'});
			}
		});
		$root.delegate('[action-type=nextTask]','click',function(){
			if(!$(this).hasClass('disabled')){
				getCurrentTask().edit({'focusField':'next'});
			}
		});
		$root.delegate('[action-type=activeProject]','click',function(){
			if(!$(this).hasClass('disabled')){
				getCurrentTask().edit({'focusField':'next'});
			}
		});
		$root.delegate('[action-type=inactiveProject]','click',function(){
			if(!$(this).hasClass('disabled')){
				getCurrentTask().edit({'focusField':'someday'});
			}
		});
		
		$root.delegate('[action-type=archiveTask]','click',function(){
			if(!$(this).hasClass('disabled')){//TODO
				$.getJSON('/api/tasks/archive',FocusField.get(),function(data){
					if(data.code==10000){
						Dispacher.notify('task.archive');
					}
				});
			}
		});
		$root.delegate('[action-type=clearTrash]','click',function(){
			if(!$(this).hasClass('disabled')){//TODO
				$.getJSON('/api/tasks/destroy',FocusField.get(),function(data){
					Dispacher.notify('task.destroy');
				});
			}
		});
		
		$root.delegate('[action-type=changePage]','click',function(){
			if(!$(this).hasClass('disabled')){
				var data=FocusField.get();
				data.page=$(this).attr('action-data');
				Dispacher.notify('changeField',data);
			}
		});
		
	
		
		
	};
	return {
		init:function(){
			_this.initActions();
		}
	};
}();
Toolbar.init();