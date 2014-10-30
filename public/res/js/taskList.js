/**
 * 封装Tasks的逻辑
 * 
 * @param tasks
 *            包含task对象的数组 
 */
function TaskList(tasks,type){
	
	this.tasks=tasks||new Array();
	this.type=type||'default';
	this.length=this.tasks.length;
	if(this.type=='scheduled'){
		this.exeDate=tasks[0].exeDate;
	}
	if(this.type=='archived'){
		this.doneDate=tasks[0].doneDate;
	}
	if(this.type=='subTask'){
		
		this.parent=tasks[0].parent;
		//this.parentTitle=tasks[0].parentTitle;
	}
	
	if (typeof TaskList._initialized == 'undefined') {
		TaskList.prototype.remove=function(callback){
			var that=this;
			var taskIds='';
			var tasks=new Array();
			$.each(this.tasks,function(i,item){
				taskIds=taskIds+','+item._id;
			});
			$.post('/api/tasks/delete',{
				  taskIds:taskIds.substr(1),focusField:FocusField.get()
				},function(data){
					$.each(that.tasks,function(i,item1){
						$.each(data,function(i,item2){
							if(item1._id==item2._id){
								item2.focusType_before=item1.focusType;
								item2.items=item1.items;
								item1=new Task(item2);
								return false;
							}
						});
						tasks.push(item1);
					});
		
					callback.call(this,tasks);
			},'json');
		};
		TaskList.prototype.archive=function(callback){
  		   $.post('/api/tasks/archive', {
				   focusField : FocusField.get(),
				   projectId:(FocusField.get()=='inProject')?$('.project-info').data("task")._id:-1
			   },function(data){
				   var tasks=new Array();
				   $.each(data,function(i,item){
					   tasks.push(new Task(item));
				   });
				   callback.call(this,tasks);
			   },'json');
		};
		TaskList.prototype.filterFunctions=function(){
			return this.tasks;
		};
		TaskList.prototype.filterSubTasks=function(){
			var list=new Array();
			$.each(this.tasks,function(i,item){
				if(item.parent==0){
					list.push(item);
				}
			});
			return new TaskList(list);
			
		};
		
		TaskList.prototype.getParents=function(){
			var parents=' ';
			$.each(this.tasks,function(i,task){
				if(task.parent>0&&parents.match(' '+task.parent+' ')==null){
				   parents=parents+task.parent+' ';
				}
			});
			var tasks=this.tasks;
			$.ajax({
		    	   url: '/api/tasks/getparents',
		    	   data:'parents='+parents,
		    	   dataType:"json",
		    	   async: false,
		    	   success: function(data){
				       $.each(tasks,function(i,item){
				    	   item.parent=data[item.parent];
					        tasks[i]=item;
				       });
		           }
		    });
			this.tasks=tasks;
			return this;
	
		};
		TaskList.prototype.getUsers=function(){
			var userIds=' ';
			 $.each(this.tasks,function(i,item){
				 if(userIds.match(' '+item.userId+' ')==null){
				    userIds=userIds+item.userId+' ';
				 }
			 });
			 var tasks=this.tasks;
			 $.ajax({
			    	 url: '/api/multitasks/getusernames',
			    	 data:'userIds='+userIds,
			    	 dataType:"json",
			    	 async: false,
			    	 success: function(data){
					    $.each(tasks,function(i,item){
					       item.username=data[item.userId];
						   tasks[i]=item;
					     });
			         }
			 });
			 this.tasks=tasks;
			 return this;
		};
		/*TaskList.prototype.getTags=function(){
			
		};*/

	}
	TaskList._initialized = true;
}

function TaskListUI(tasklist){
	this.tasklist=tasklist;
	this.type=tasklist.type||'default';
	if (typeof TaskListUI._initialized == 'undefined') {
		TaskListUI.prototype.render=function(){
			if(this.type=='default'||FocusField.get()=='today'||FocusField.get()=='next'){
				ul='<ul class="task-list active-list" >'+this.content()+'</ul>';
			}else{
				ul='<ul class="task-list inactive-list" >'+this.content()+'</ul>';
			}
			return this.title()+ul;
		};
		TaskListUI.prototype.title=function(){
			var html='';
			switch(this.type){
			  case 'someday':
				  if(FocusField.get()!='someday'){
				      html+='<div class="group-title ">择日待办</div>';
				  }
				  break;
			  case 'deleted':
				  html+='<div class="group-title ">已删除</div>';
				  break;
			  case 'scheduled':
				  html+='<div  class="group-title">'+this.tasklist.exeDate+'</div>';
				  break;
			  case 'archived':
				  if(FocusField.get()=='inProject'){
					  html+='<div  class="group-title">已归档</div>';
				  }else{
				      html+='<div  class="group-title">'+this.tasklist.doneDate+'</div>';
				  }
				  break;
			  case 'subTask':
				  html+='<div id="project-'+this.tasklist.parent._id+'" class="group-title project-title">'+this.tasklist.parent.title+'</div>';
				  break;
			  case 'template':
				  html+='<div class="group-title">每周任务</div>';
			  case 'default':
				  default :
					  break;
			}
			return html;
		};
		TaskListUI.prototype.content=function(){
			var html='';
			//var tasks=this.tasklist.filterFunctions();
			//console.log(this.tasklist);
			if(this.tasklist.length>0){
			  $.each(this.tasklist.filterFunctions(),function(i,item){
				  html+=new TaskUI(item).render();
			  });
			}
			return html;
		};
		
		TaskListUI.prototype.getSelectedItem = function() {
			
		};
		
		TaskListUI.prototype.deleteTask = function(item) {
			
		};
		
		
	}
	TaskListUI._initialized=true;
}