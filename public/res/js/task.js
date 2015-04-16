/**
 * 封装Task的业务逻辑
 * 
 * var testRawTask = {id: 1, name: "task_1"};
 * 
 * var task1 = new Task(rawTask);
 * 
 * task1.isToday();
 * 
 * alert(task1.id);
 * alert(task1.name);
 * 
 * task1.isToday();
 * 
 * @param rawTask
 *            从数据库中来的原始的task对象
 * @returns {Task}
 */
function Task(rawTask) {
	this.isnew=false;
	if(!rawTask){
		this.isnew=true;
		this.focusType=FocusField.get().focusField;
	}
	$.extend(this, rawTask);
	if(this.repeatId){
		this.repeat=new RepeatClass(this.repeat);
	}else{
		this.repeat=new RepeatClass();
	}
	if(this.tagObj){
		this.tagObj=new TagClass(this.tagObj);
	}else{
		this.tagObj=new TagClass();
	}
	if(this.parent>0||typeof this.parent==='object'){
		this.parent=new Task(this.parent);
	}
	if (typeof Task._initialized == 'undefined') {

		Task.prototype.show=function(callback){
			$.getJSON('/api/tasks/showinfo',{taskId:this._id},function(data){
				  callback.call(this,data);
			});
		};
		//new-v
		Task.prototype.showTemplate=function(callback){
			$.get('/default/task/showtemplate',{taskId:this._id},function(data){
				  callback.call(this,data);
			});
		};
		Task.prototype.unfinish=function(callback){
			var that=this;
			$.getJSON('/api/tasks/undone',{taskId:this._id},function(res){
				if(res.code='10000'){
					Dispacher.notify('task.edit');
					if(callback){
						callback(that,res);
					}
				}else{
					alert(res.msg);
				}
			});
		};
		Task.prototype.finish=function(callback){
			var that=this;
			$.getJSON('/api/tasks/done',{taskId:this._id},function(res){
				if(res.code='10000'){
					Dispacher.notify('task.edit');
					if(callback){
						callback(that,res);
					}
				}else{
					alert(res.msg);
				}
			});
		};
		Task.prototype.edit=function(settings,callback){
			var task=this;
			if(!this._id){
				return false;
			}
			settings['taskId']=this._id;
			if(this.isSubTask()){
				if(!this.parent.isActive){
					var flag=confirm("进行此操作前要激活项目，确认激活项目吗？");
					if(!flag){
						return;
					}
					this.parent.edit({focusField:'next'});
				}
			}
			$.post("/api/tasks/edit",settings,function(res){
				if(res.code=='10000'){
					
				//	var $node=$(data);
				//	var newTask=new Task($node.attr('action-data').toJson());
					var newTask=null;
					if(res.data.task){
						newTask=new Task(res.data.task);
					}
					//$node.data('task',newTask);
					Dispacher.notify('task.edit',{oldTask:task,newTask:newTask});
					if(callback){
						callback.call(this,res);
					}
					
				}else{
					alert(res.msg);
				}
			     
			},'json');
		};
		Task.prototype.create=function(settings,callback){
			//TODO 非激活项目不可用
			
			$.post('/api/tasks/new',settings,function(res){
				if(res.code=='10000'){
					Dispacher.notify('task.create');
					callback.call(this,res);
				}else{
					alert(res.msg);
				}
			},'json');
		};
		Task.prototype.createTemplate=function(settings,callback){
			$.post('/api/tasks/newtemplate',settings,function(res){
				if(res.code=='10000'){
					Dispacher.notify('task.create');
					callback.call(this,res);
				}else{
					alert(res.msg);
				}
			},'json');
		};
		Task.prototype .addTag=function(settings,callback){
			$.post('/api/tasks/saveImg',{taskId:this._id,data:settings.data},function(data){
				callback.call(this,data);
			});
		};
		Task.prototype .deleteTag=function(callback){
			$.post('/api/tasks/deleteTag',{taskId:this._id},function(data){
				callback.call(this,data);
			});
		};
		Task.prototype.addSound=function(settings,callback){
			var that=this;
			$.ajaxFileUpload
			(
				{
					url:'/api/tasks/savewav',
					secureuri:false,
					fileElementId:settings.elem||'sound',
					dataType: 'json',
					data:{taskId:that._id,file:settings.elem||'sound'},
					success: function (data, status)
					{
						if(data.error!==''){
							alert(data.error);
						}
						callback.call(this,data);
						//console.log(data.aa);
					/*	if(typeof(data.error) != 'undefined')
						{
							if(data.error != '')
							{
								alert(data.error);
							}else
							{
								alert(data.msg);
							}
						}*/
					},
					error: function (data, status, e)
					{
						//callback.call(this,data);
						alert(e);
					}
				}
			);
		};
		Task.prototype .deleteSound=function(callback){
			$.post('/api/tasks/deletesound',{taskId:this._id},function(data){
				callback.call(this,data);
			},'json');
		};
/*		Task.prototype.countItems=function(settings){
			var items=0;
			$.ajax({
		    	   url: '/api/tasks/countitems',
		    	   data:'taskId='+this._id+'&focusType='+settings.focusField,
		    	   dataType:"json",
		    	   async: false,
		    	   success: function(data){
		    		   items=data;
				      //todo_minus=Number($('.focus-counter','#focus-today').children('.todo-counter').html())-data.todo_num;
					  //due_minus=Number($('.focus-counter','#focus-today').children('.due-counter').html())-data.due_num;
					  //SidebarPanel._checkCounter('today', todo_minus, due_minus);
		           }
		    	 });
			return items;
		};*/
		Task.prototype.box=function(){
			var box=[];
			if(this.isInbox()){
				box.push('inbox');
			}
		//	console.log(this.isToday);
			if(this.isToday()){
				box.push('today');
			//	box.push('next');
			}
			if(this.isNext()){
				box.push('next');
			}
			if(this.isSchedule()){
				box.push('schedule');
			}
			if(this.isTemplate()){
				box.push('schedule');
			}
			if(this.isSomeday()){
				box.push('someday');
			}
			if(this.isProject()){
				box.push('project');
			}
			if(this.isArchived()){
				box.push('archived');
			}
			if(this.isDeleted()){
				box.push('deleted');
			}
			if(this.isSubTask()){
				box.push('inproject-'+this.parent._id);
			}
			return box;
		};
		Task.prototype.isInbox=function(){
			if(this.isnew){
				return (FocusField.get().focusField=='inbox')?true:false;
			}
			
			return (this.focusType=='inbox')?true:false;
		};
		Task.prototype.isToday = function() {
			if(this.isnew){
				return (FocusField.get().focusField=='today')?true:false;
			}
			return(this.focusType=='today')? true: false;
		};
		Task.prototype.isNext = function() {
			if(this.isnew){
				return (FocusField.get().focusField=='next')?true:false;
			}
			return(this.focusType=='next')?true:false;
		};
		
		Task.prototype.isSchedule = function() {
			if(this.isnew){
				this.exeDate=TimeMachine.tomorrow('Y-m-d');
				return (FocusField.get().focusField=='schedule')?true:false;
			}
		//	return (this.focusType=='schedule'&&this.repeatId==0)?true:false;
			return this.focusType=='schedule'?true:false;
		};
		
		Task.prototype.isSomeday = function() {
			if(this.isnew){
				return (FocusField.get().focusField=='someday')?true:false;
			}
			return (this.focusType=='someday')?true:false;
		};
		
		Task.prototype.isProject = function() {
			return this.isproject;
		};
		
		Task.prototype.isArchived = function() {
			if(this.isnew){
				return (FocusField.get().focusField=='archived')?true:false;
			}
			return (this.focusType=='archived')?true:false;
		};
		
		Task.prototype.isDeleted = function() {
			if(this.isnew){
				return (FocusField.get().focusField=='deleted')?true:false;
			}
			return (this.focusType=='deleted')?true:false;
		};
		
		Task.prototype.isSubTask=function(){
			if(this.parent>0||typeof this.parent==='object'){
				
			  return true;
			}
			return false;
		};
		Task.prototype.isDone=function(){
			if(this.done=='true'){
				return true;
			}
			return false;
		};
		Task.prototype.isActive=function(){
			if(this.focusType=='today'||this.focusType=='next'||this.focus=='active'){
				return true;
			}else{
				return false;
			}
		};
		Task.prototype.isTemplate=function(){
			return (this.repeatId>0)? true:false;
		};
		Task.prototype.isDue=function(){
			if(this.dueDate!=0&&this.dueDays()<=0)
				return true;
			return false;
		};
		Task.prototype.dueDays = function() {
				return Math.ceil((this.dueDate*1000 - TimeMachine.today())/1000/3600/24);
		};	
		Task.prototype.hasComments=function(){
			if(this.comments&&this.comments>0){
				return true;
			}
			return false;
		};
		
		Task.prototype.hasNotes=function(){
			if(this.note&&this.note!=''){
				return true;
			}
			return false;
		};
	
		Task.prototype.hasSound=function(){
			if(this.sound>0){
				return true;
			}
			return false;
		};
		Task.prototype.hasTag=function(){
			if(this.tag){
				return true;
			}
			return false;
		};
		Task.prototype.isRepeat=function(){
			if(this.repeatId&&this.repeatId>0){
				return true;
			}
			return false;
		};
		Task.prototype.hasDueDate=function(){
			if(this.dueDate&&this.dueDate!=0){
				return true;
			}
			return false;
		};
	}
	Task._initialized = true;
}

/**
 * 封装Task的界面逻辑
 * 
 * var html = new TaskUI(task).render();
 * 
 * @param task
 *            Task对象
 * @param focus
 *            当前是在哪个focus: today, next, someday...
 * @returns {TaskUI}
 */
function TaskUI(task) {
	this.task = task;
	this.focus_field = FocusField.get();
    var html='';
	if (typeof TaskUI._initialized == 'undefined') {
		TaskUI.prototype.render = function() {
			html='<li id="task-' + this.task._id + '" class="'+this.css()+'">'+
			       this.prograssBar()+
			       this.checkbox()+
			       this.username()+
			       '<div class="parent">'+ this.parentTitle()+'</div>'+
			       '<div class="parent doneDate" >'+this.doneDate()+'</div>'+
			       '<div class="title">'+ this.task.title +'</div>'+
			       this.noteFlag()+
			       this.tagFlag()+
			       this.soundFlag()+
			       '<a class="comment-flag" id=comments-'+ this.task._id + ' href="javascript:void(0)">'+this.commentInfo()+'</a> '+
			       '<div class="due-text">'+this.dueInfo()+'</div>'+
			       this.todayFlag()+
			       //'<div class="today-flag">[T]</div>'+
			     '</li>';
			
			return html;
		};
		
		TaskUI.prototype.css=function(){
			var css='';
			if(this.task.isDue()&&this.focus_field!='us'){
				css+='due ';
			}
			if(this.task.isToday()){
				css+='today ';
			}
			if(this.task.isProject()){
				css+='project ';
			}
			/*if(this.task.isSubTask()){
				css+='subtask ';
			}*/
			if(this.task.isDone()&&this.focus_field!='us'){
				css+= 'done ';
			}
			if(this.task.isActive()){
				css+='active ';
			}
			
			//css+=this.task.focusType;
			return css;
		};
	
		TaskUI.prototype.prograssBar=function(){
			var html='';
			if(this.task.isProject()){
				html+='<div class="progress-bar">'+
		                '<div class="progress" style="width: '+(this.task.doneItems*100/this.task.items)+'%;">'+
		                  '<a href="javascript:void(0);">'+this.task.items+'任务</a>'+
		                '</div>'+
		              '</div>';
			}
			return html;
		};
		TaskUI.prototype.checkbox = function(){
			return (this.focus_field=='us'||this.task.repeatId > 0) ?'': '<div class="checkbox" id="checkbox-'+this.task._id+'">[ ]</div>' ;
		};
		TaskUI.prototype.doneDate=function(){
				return (this.task.isArchived()&&this.focus_field=='inProject')?this.task.doneDate:' ';
		};
		TaskUI.prototype.todayFlag=function(){
			//var html='<div class="today-flag" style="display:none">[T]</div>';
			if(this.task.isToday()&&this.focus_field!='us'){
				return '<div class="today-flag">[T]</div>';
			}
			return '';
		};
		TaskUI.prototype.username=function(){
			if(this.focus_field=='us')
				return     '<div class="username parent">['+ this.task.username+']</div>';
			return '';
		};
		TaskUI.prototype.parentTitle = function (){
			if(this.focus_field=='today'||this.focus_field=='schedule'||this.focus_field=='archived'||this.focus_field=='us'){
			  if(this.task.isSubTask()){
				return this.task.parent.title + ':';
			  }
			  return '';
			}
			return '';
		};
		TaskUI.prototype.dueInfo = function(){
			var due_info='';
			if(this.task.dueDate>0&&this.focus_field!='us')
			{   
				if(this.task.dueDays()>0){
					due_info='剩余'+this.task.dueDays()+'天';
				}else if(this.task.dueDays()==0){
					due_info='今天到期';
				}else{
					due_info='已过期'+Math.abs(this.task.dueDays())+'天';
				}
			}
			return due_info;
		};
		
		TaskUI.prototype.noteFlag = function(){
			if(this.task.hasNotes()){
				return '<div class="note-flag">[N]</div>';
			}
			return '';
		};
		TaskUI.prototype.soundFlag = function(){
			if(this.task.hasSound()){
				/*   '<a class="tag-flag" >[N]</a>'+
			       '<a class="sound-flag" >[N]</a>'+*/
				return '<div class="sound-flag">声音</div>';
			}
			return '';
		};
		TaskUI.prototype.tagFlag = function(){
			if(this.task.hasTag()){
				return '<div class="tag-flag">标签</div>';
			}
			return '';
		};
		TaskUI.prototype.commentInfo = function(){
			if(this.task.hasComments()){
				return '['+this.task.comments+'评论]';
			}
			return '';
		};
		
		/*TaskUI.prototype.itemInfo = function (){
			if(this.task.isProject()){
				return this.task.items+'任务';
			}
			return '';
		};*/
	}
	TaskUI._initialized = true;
}
