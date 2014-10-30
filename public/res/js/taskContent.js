/**
 * 封装TaskContent界面逻辑
 * 
 * @param tasks
 *            TaskList对象
 */
function TaskContentUI(){
	this.id=0;
	if (typeof TaskContentUI._initialized == 'undefined') {
		TaskContentUI.prototype.render=function(){
			var html='';
			switch(FocusField.get()){
			   case 'inbox':
			   case 'today':
				   html='<div class="list-block default-list"></div>';
				   break;
			   case 'next':
				   html ='<div class="list-block default-list"></div>'+
		                 '<div class="list-block subTask-list"></div>';
			       break;
			   case 'someday':
				   html ='<div class="list-block someday-list"></div>'+
	                     '<div class="list-block subTask-list"></div>';
		           break;
			   case 'schedule':
				   html = '<div class="list-block scheduled-list"></div>'+
		              '<div class="list-block template-list"></div>';
		           break;
			   case 'project':
				   html ='<div class="list-block default-list"></div>'+
	                 '<div class="list-block scheduled-list"></div>'+
	                 '<div class="list-block someday-list"</div>';
			      break;
			   case 'inProject':
				   var player=  '<embed id="player-project"  showtracker="true" enablecontextmenu="false" '+
                   'showpositioncontrols="false" showstatusbar="true" autostart="auto"' +
                   'loop="false" volume="20" type="audio/mpeg" '+
                   'src="" style="width: 200px; height: 20px;"/>&nbsp;&nbsp;<div class="clear-sound">X</div>&nbsp;&nbsp;';
				   html='<div class="project-info" id="">'+
		                    '<div class="title-bar "><div class="checkbox">[ ]</div><textarea class="title"></textarea></div>'+
	                        '<div class="duedate-bar"><div class="duedate-flag">[D]</div><input type="text"  class="duedate" readonly="readonly" /> <div class="clear-duedate">X</div> </div>'+
	                        '<div class="notes-bar"><div class="note-flag">[N]</div><textarea class="notes"></textarea></div>'+
	                        '<div class="tag-bar"><div class="tag-flag">[N]</div><div class=tag><img width="30" height="20" id="tag-project"/>&nbsp;&nbsp;<div class="clear-tag">X</div>&nbsp;&nbsp;<a href="javascript:void(0);" id="canvas">画布</a>&nbsp;&nbsp;</div></div>'+
	                        '<div class="sound-bar"><div class="sound-flag">[N]</div><div class="sound">'+player+'<input type="button" id="record-project" value="录音"/>&nbsp;&nbsp;<input id="sound-project" type="file" name="sound-project" /><input type="button" id="uploadsound" value="上传"/> </div></div>'+
	                        
	                    '</div>'+
					    '<div class="list-block default-list"></div>'+
                        '<div class="list-block scheduled-list"></div>'+
                        '<div class="list-block someday-list"></div>'+
                        '<div class="list-block archived-list"></div>'+
                        '<div class="list-block deleted-list"></div>';
	              break;
			   case 'archived':
				   html = '<div class="list-block archived-list"></div>';
				   break;
			   case 'deleted':
				   html ='<div class="list-block default-list"></div>'+
		             '<div class="list-block subTask-list"></div>';
				   break;
			   case 'us':
				   html='<div class="list-block archived-list"></div>';
			       break;
			   case 'inTask':
				 html='<div><input type="button" id="goback" value="返回"/></div>'+
					  '<div class="group-title">任务详情</div>' +
					  '<div class="task-detail" >' + 
					     '<div class="title clearfix">' + 
					         '<span class="label">任务:</span>'+
							 '<span class="text"></span>' + 
						 '</div>' + 
						 '<div class="note clearfix">' + 
							  '<span class="label">备注:</span>'+
							  '<span class="text"></span>' + 
						 '</div>' + 
						 '<div class="created-at clearfix">' + 
							  '<span class="label">创建时间:</span>'+
							  '<span class="text"></span>' + 
						 '</div>' + 
						 '<div class="done-at clearfix">'+
							  '<span class="label">完成时间:</span>' + 
							  '<span class="text"></span>' + 
						 '</div>' + 
					  '</div>'+
					  '<div class="group-title">已有回复</div>' + 
					  '<ul class="comment-list"></ul>'+
					  '<div class="group-title">我要回复</div>'+
					  '<div class="comment-post">' + 
					     '<div>' + 
							 '<textarea id="comment"></textarea>' + 
						 '</div>' + 
						 '<div>' +
						     '<input type="button" id="add-comment" value="提交" />' + 
						 '</div>' + 
					  '</div>';
				   break;
			   default:
				   break;
			
			}
			return html;
		};

		TaskContentUI.prototype .getCurrentItem=function(){
				var task=clone($('.task-list li.selected, .task-list li.done-selected').data('task'));
				return task;
		};
		TaskContentUI.prototype.insertItem=function(task){
			
			 switch(FocusField.get()){
			   case 'inbox':
			   case 'today':
				   this._toDefault(task);
				   break;
			   case 'deleted':
			   case 'next':
				   if(task.isSubTask()){
					   this._toSubTasks(task);
				   }else{
					   this._toDefault(task);
				   }
				   break;
			   case 'someday':
				   if(task.isSubTask()){
					   this._toSubTasks(task);
				   }else{
					   this._toSomeday(task);
				   }
				   break;
			   case 'schedule':
				   if(task.isTemplate()){
					   this._toTemplate(task);
				   }else{
					   this._toScheduled(task);
				   }
				   break;
			   case 'project':
				   if(task.isActive()){
					  this._toDefault(task);
				   }else if(task.isSchedule()){
					   this._toScheduled(task);
				   }else if(task.isSomeday()){
					  this._toSomeday(task);
				   }
				   break;
			   case 'inProject':
		           if(task.parent!=$('.project-info').attr('id').split('-')[1]){
		        	   this.removeItem(task);
		           }else{
					   if(task.isActive()){
						   this._toDefault(task);
					   }else if(task.isSchedule()){
						   this._toScheduled(task);
					   }else if(task.isSomeday()){
						   this._toSomeday(task);
					   }else if(task.isArchived()){
						   this._toArchived(task);
					   }else if(task.isDeleted()){
						   this._toDeleted(task);//TODO
					   }
		           }
				  
				   break;
			   case 'archived':
			       this._toArchived(task);
			       break;
			   case 'us':
				   this._toArchived(task);
				   break;
			  default:
				   break;
			 }
			 $('#task-'+task._id).data("task",task);
			
			 if(task.isSubTask()){
				 $('.parent','#task-'+task._id).data('task',new Task(task.parent));
			 }
			 if(!task.isTemplate()&&FocusField.get()!='us'){
			     $('#task-'+task._id).draggable( {
					   revert : "invalid",
					   helper : function(event){
						   var title = $(event.currentTarget).find(".title").text();
						   return "<div class='task-dragging'>" + title + "</div>";
					   },
					   opacity: 0.6,
					   appendTo: "body",
					   cursorAt: { left: -10, top: 5 }
				 });
			  }
		};
		TaskContentUI.prototype.insertItems=function(tasklist){
		    var that=this;
			$.each(tasklist.filterFunctions(),function(i,item){
				that.insertItem(item);
			});
		};
		TaskContentUI.prototype.removeItem=function(task){
			$('#task-'+task._id).remove();
		};
		TaskContentUI.prototype.removeItems=function(tasklist){
			var that=this;
			$.each(tasklist,function(i,item){
				that.removeItem(item);
			});
		};
		TaskContentUI.prototype.initProjectInfo=function(project){
			$('.project-info').attr('id','task-'+project._id);
			$('#tag-project','.project-info').hide();
			$('.clear-tag','.project-info').hide();
			$('#player-project','.project-info').hide();
			$('.clear-sound','.project-info').hide();
			project.show(function(data){
				  data.task=new Task(data.task);
				  $('.project-info').data("task",data.task);
				  var css=' ';
				  if(data.task.isToday())
					  css+='today ';
				  if(data.task.isDue())
					  css+='due ';
				  if(data.task.isDone())
					  css+='done ';
				 /* if(data.task.isActive())
					  css+='active ';*/
				  $('.title-bar').addClass(css);
				  
				  $('.title','.project-info').html(data.task.title);
				  $('.notes','.project-info').html(data.task.note);
				  (data.task.dueDate!=0)?$('.duedate','.project-info').val(TimeMachine.custom(data.task.dueDate*1000)):'';
				if(data.task.tag>00){
					$('#tag-project','.project-info').attr('src','/res/tags/tag_'+data.task._id+'.png?i='+Math.random());
					$('#tag-project','.project-info').show();
					$('.clear-tag','.project-info').show();
				}
				  if(data.task.sound>0){
					  $('#player-project','.project-info').show();
					  $('.clear-sound','.project-info').show();
					  $('#player-project','.project-info').attr('src','/res/upload/sound_'+data.task._id+'.wav?i='+Math.random());
				  }
			      
			});
			
			 $('.duedate','.project-info').datepicker( {
					dateFormat : 'yy-mm-dd',
					monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
					dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ]
				});
			  
			  $('.title','.project-info').focusout(function(){
				  project.edit({title:$(this).val()},function(data){
					  $('.projects-bundle').children('ul')
                            .children('#focus-inProject-'+$('.project-info').attr('id').split('-')[1])
                            .children('.focus-name').html(data.task.title);
				  });
			
			  });
			  $('.notes','.project-info').focusout(function(){
				  project.edit({note:$(this).val()},function(data){});
			  });
			  $('.duedate','.project-info').change(function(){
				  project.edit({dueDate:$(this).val()},function(data){
						if(new Task(data.task).isDue()){
							$('.title-bar','.project-info').addClass('due');
						}else{
							$('.title-bar','.project-info').removeClass('due');
						}
				  });
			  });
			  
			  $('.clear-duedate').click(function(){
				  project.edit({dueDate:0},function(data){
					  $('.duedate','.project-info').val('');
					  $('.title-bar','.project-info').removeClass('due');	
				  });
	
			  });
			  $('#tag-project','.project-info').toggle(function(){
		    		$(this).attr('width','200');
		    		$(this).attr('height','100');
		      },function(){
		    		$(this).attr('width','30');
		    		$(this).attr('height','20');
		    	});
			  $('.clear-tag').click(function(){
				  project.deleteTag(function(data){
					  $('#tag-project').hide();
					  $('.clear-tag').hide();
				  });
			  });
			  $('#canvas','.project-info').click(function(){
				  CanvasDialog.open({isProject:true,project:project});
			  });
		
			  $('#record-project','.project-info').click(function(){
				  RecordDialog.open();
			  });
		
			  $('#uploadsound','.project-info').click(function(){
				  if($('#sound','.project-info').val()!==''){
					  project.addSound({elem:'sound-project'},function(data){
						  $('#player-project','.project-info').show();
						  $('.clear-sound','.project-info').show();
						  $('#player-project','.project-info').attr('src','/res/upload/sound_'+project._id+'.wav?i='+Math.random());
					      $('#sound-project').val('');
					  });
				  }
			  });
			  $('.clear-sound','.project-info').click(function(){
				  project.deleteSound(function(){
					  $('#player-project','.project-info').hide();
					  $('.clear-sound','.project-info').hide();
				  });
			  });
			  
		};
		TaskContentUI.prototype .initTaskInfo=function(task){
			$('.task-detail').attr('id','task-'+task._id);
			 $.getJSON('/api/Multitasks/show', {
					taskId : task._id
				}, function(data) {
					var createdTime = new Date();
					$('.text','.title').html(data.task.title);
					$('.text','.note').html(data.task.note);
					$('.text','.created-at').html(TimeMachine.fullTime(data.task.createdTime));
	                $('.text','.done-at').html(TimeMachine.fullTime(data.task.doneTime));	
	                $('.comment-list').html(Comments.makeList(data.comments));
	                
	          	  $('#goback').click(function(){
	        		  var field_before=FocusField.get();
	        		  FocusField.set('us');
	        		  Dispacher.notify('field.change',
	        				{current_page:Number($('#current-page').html()),user_id:MainPanel.settings.user_id,field_before:field_before});
	        	  });
			});
		};
		TaskContentUI.prototype._toDefault=function(task){
			  var tasks=new Array();
				  tasks.push(task);
				  
			 
			  if($('#task-'+task._id,'.default-list').length>0){
				  $('#task-'+task._id).replaceWith(new TaskUI(task).render());
			  }else{
				  $('#task-'+task._id).remove();
				  if($('.default-list ul').length>0){
					  $('.default-list ul').prepend(new TaskUI(task).render());
				  }else{
					  $('.default-list').prepend(new TaskListUI(new TaskList(tasks)).render());
				  }
			  }
			  
		};
		TaskContentUI.prototype._toSomeday=function(task){
			var tasks=new Array();
			tasks.push(task);
			if($('#task-'+task._id,'.someday-list').length>0){
				  $('#task-'+task._id).replaceWith(new TaskUI(task).render());
			}else{
				$('#task-'+task._id).remove();
				if($('.someday-list ul').length>0){
				    $('.someday-list ul').prepend(new TaskUI(task).render());
			    }else{
				    $('.someday-list').prepend(new TaskListUI(new TaskList(tasks,'someday')).render());
			    }
			}
		    
		};
		TaskContentUI.prototype._toDeleted=function(task){
			var tasks=new Array();
			tasks.push(task);
		    if($('.deleted-list ul').length>0){
			    $('.deleted-list ul').prepend(new TaskUI(task).render());
		    }else{
			    $('.deleted-list').prepend(new TaskListUI(new TaskList(tasks,'deleted')).render());
		    }
		};
		TaskContentUI.prototype._toTemplate=function(task){
			var tasks=new Array();
			tasks.push(task);
		    if($('.template-list ul').length>0){
		    	if($('#task-'+task._id).length>0){
	    			 $('#task-'+task._id).replaceWith(new TaskUI(task).render());
		    	}else{
		    		$('.template-list ul').prepend(new TaskUI(task).render());
		    	}
			    
		    }else{
			    $('.template-list').prepend(new TaskListUI(new TaskList(tasks,'template')).render());
		    }
		};
		TaskContentUI.prototype._toScheduled=function(task,type){
			   var tasks=new Array();
			   tasks[0]=task;
		 
		       var flag=0;
		       $.each($('.group-title','.scheduled-list'),function(i,item){
		    	   if(TimeMachine.timestamp($(item).html())>TimeMachine.timestamp(task.exeDate)){
		    		     $('#task-'+task._id).remove();
			    		 $(item).before(new TaskListUI(new TaskList(tasks,'scheduled')).render());
			    		 flag=1;
			    		 return false;
			    	 }else if(TimeMachine.timestamp($(item).html())==TimeMachine.timestamp(task.exeDate)){
			    		 if($(item).next().children('#task-'+task._id).length>0){
			    			 $('#task-'+task._id).replaceWith(new TaskUI(task).render());
			    		 }else{
			    			 $('#task-'+task._id).remove();
			    			 (type=='first')?$(item).next().prepend(new TaskUI(task).render()):$(item).next().append(new TaskUI(task).render());
			    		 }
			    		 
			    		 flag=1;
			    		 return false;
			    	 }
		       });
		       if(flag==0){
		    	   $('#task-'+task._id).remove();
		    	   $('.scheduled-list').append(new TaskListUI(new TaskList(tasks,'scheduled')).render());
		       }
		      
	  };
	  TaskContentUI.prototype._toArchived=function(task,type){
		  var tasks=new Array();
	       tasks.push(task);
		  if(FocusField.get()!='inProject'){
		       var flag=0;
		       $.each($('.group-title','.archived-list'),function(i,item){
		    	   if(TimeMachine.timestamp($(item).html())<TimeMachine.timestamp(task.doneDate)){
		    		   $(item).before(new TaskListUI(new TaskList(tasks,'archived')).render());
		    		   flag=1;
		    		   return false;
		    	   }else if(TimeMachine.timestamp($(item).html())==TimeMachine.timestamp(task.doneDate)){
		    		   (type=='first')?$(item).next().prepend(new TaskUI(task).render()):$(item).next().append(new TaskUI(task).render());
		    		   flag=1;
		    		   return false;
		    	   }
		       });
		       if(flag==0){
		    	   $('.archived-list').append(new TaskListUI(new TaskList(tasks,'archived')).render());
		       }
		  }else{
			  if($('.archived-list ul').length>0){
				    $('#task-'+task._id).remove();
				    $('.archived-list ul').prepend(new TaskUI(task).render());
			  }else{
				   $('#task-'+task._id).remove();
				    $('.archived-list').prepend(new TaskListUI(new TaskList(tasks,'archived')).render());
			  }
		  }
	  };
	  TaskContentUI.prototype._toSubTasks=function(task,type){
		  var tasks=new Array();
	      tasks[0]=task;
		  var flag=0;
		  $.each($('.group-title','.subTask-list'),function(i,item){
			  if(Number($(item).attr('id').split('-')[1])>task.parent._id){
				  $('#task-'+task._id).remove();
				  $(item).before(new TaskListUI(new TaskList(tasks,'subTask')).render());
				  flag=1;
				  return false;
			  }else if(Number($(item).attr('id').split('-')[1])==task.parent._id){
				  if($(item).next().children('#task-'+task._id).length>0){
					  $('#task-'+task._id).replaceWith(new TaskUI(task).render());
				  }else{
					  $('#task-'+task._id).remove();
					  (type=='first')?$(item).next().prepend(new TaskUI(task).render()):$(item).next().append(new TaskUI(task).render());
				  }
			       flag=1;
			       return false;
			  }
		  });
		  if(flag==0){
			  $('#task-'+task._id).remove();
			  $('.subTask-list').append(new TaskListUI(new TaskList(tasks,'subTask')).render());
		  }
	  };
	}
	TaskContentUI._initialized=true;
	
}