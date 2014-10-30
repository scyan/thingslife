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
	$.extend(this, rawTask);
	
	if (typeof Task._initialized == 'undefined') {

		Task.prototype.show=function(callback){
			$.getJSON('/api/tasks/edit',{taskId:this._id},function(data){
				  callback.call(this,data);
			});
		};
		Task.prototype .edit=function(settings,callback){
			var task=this;
			$.post("/api/tasks/edit",{
				editRepeat : Repeat.get().edit_repeat,
				taskId : this._id,
				done :settings.done,
				exeDate : settings.exeDate,
				dueDate:settings.dueDate,
				title : settings.title,
				note : settings.note,
				parent : settings.parent,
				focusField : settings.focusField,
				repeatType : Repeat.get().type,
				frequency : Repeat.get().frequency,
				days : Repeat.get().days,
				editTag:CanvasDialog.isEdit(),
				tag:CanvasDialog.getImg()
				
            },function(data){
            	if(data.task.parent!==0){
            		data.task.parent=task.parent;
            	}
            	data.task.items=task.items;
            	data.task=new Task(data.task);
            	
            	if(NewEditDialog.hasSound()){
            		data.task.addSound({},function(data2){
            			data2.sound>0?data.task.sound=data2.sound:'';
            			 callback.call(this,data);
            		});
				}else{
					callback.call(this,data);
				}
			     
			},'json');
		};
		Task.prototype.create=function(settings,callback){
			$.post('/api/tasks/new',{
				   editRepeat : Repeat.get().edit_repeat,
				   exeDate : settings.exeDate||undefined,
			       dueDate:settings.dueDate||undefined,
				   title : settings.title,
				   note : settings.note,
				   focusField : settings.focusField,
				   repeatType : Repeat.get().type,
				   frequency : Repeat.get().frequency,
				   days : Repeat.get().days,
				   editTag:CanvasDialog.isEdit(),
				   tag:CanvasDialog.getImg()
			},function(data){
				data.task.items=0;
				data.task=new Task(data.task);
				if(NewEditDialog.hasSound()){
            		data.task.addSound({},function(data2){
            			data2.sound>0?data.task.sound=data2.sound:'';
            			callback.call(this,data);
            		});
				}else{
					callback.call(this,data);
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
		Task.prototype .isInbox=function(){
			return (this.focusType=='inbox')?true:false;
		};
		Task.prototype.isToday = function() {
			return(this.focusType=='today')? true: false;
		};
		Task.prototype.isNext = function() {
			return(this.focusType=='next')?true:false;
		};
		
		Task.prototype.isSchedule = function() {
			return (this.focusType=='schedule'&&this.repeatId==0)?true:false;
		};
		
		Task.prototype.isSomeday = function() {
			return (this.focusType=='someday')?true:false;
		};
		
		Task.prototype.isProject = function() {
			return (this.focusLevel==1)?true:false;
		};
		
		Task.prototype.isArchived = function() {
			return (this.focusType=='archived')?true:false;
		};
		
		Task.prototype.isDeleted = function() {
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
			if(this.focusType=='today'||this.focusType=='next'){
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
			if(this.comments>0){
				return true;
			}
			return false;
		};
		
		Task.prototype.hasNotes=function(){
			if(this.note!=''){
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
			if(this.tag>0){
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
			return (this.focus_field=='us'||this.task.repeatId > 0) ?'': '<div class="checkbox" id="chechbox-'+this.task._id+'">[ ]</div>' ;
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
