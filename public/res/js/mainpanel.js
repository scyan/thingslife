/**
 * 
 * 使用
 * MainPanel.init({type : "me", root : "#main-panel",focus : "inbox"});
 * 
 */
var MainPanel = {
	settings : {
	  type : "me",
	/**
	 * MainPanel的最外层容器,比如：<div id="main-panel"></div>
	 */
	  root : null,
	  
	  user_id :0,
	  taskContentUI:new TaskContentUI(),
	  
	  content: ' '
  },

  init : function(options){
	  $.extend(this.settings,options);
	  $root=$(this.settings.root);
	  
	  Dispacher.connect('tasks.delete',function(event,args){
		  MainPanel.settings.taskContentUI.removeItems(args.tasklist);
	  });
      Dispacher.connect('task.create', function(event,args){
    	  var task=args.task;
    	  if(task.focusType==FocusField.get()){
    		  MainPanel.settings.taskContentUI.insertItem(task);
    	  }else if(task.isToday()&&FocusField.get()=='next'){
    		  MainPanel.settings.taskContentUI.insertItem(task);
    	  }else if(task.isProject()){
    		  MainPanel.settings.taskContentUI.insertItem(task);
    	  }
    	  if(!$.isEmptyObject(args.template)&&FocusField.get()=='schedule'){
    		  MainPanel.settings.taskContentUI.insertItem(new Task(args.template));
    	  }
      });
      Dispacher.connect('task.edit',function(event,args){
    	  switch(FocusField.get()){
    	     case 'today':
    	    	 if(args.task.isToday()){
    	    		 MainPanel.settings.taskContentUI.insertItem(args.task);
    	    	 }else{
    	    		 MainPanel.settings.taskContentUI.removeItem(args.task);
    	    	 }
    	    	 break;
    	     case 'inbox':
    	     case 'next':
    	     case 'someday':
    	     case 'archived':
    	     case 'deleted':
    	    	 if(args.task.focus!==FocusField.get()){
    	    		 MainPanel.settings.taskContentUI.removeItem(args.task);
    	    	 }else{
    	    		 MainPanel.settings.taskContentUI.insertItem(args.task);
    	    	 }
    	    	 break;
    	     case 'schedule':
    	    	 if(args.task.focus!==FocusField.get()){
    	    		 MainPanel.settings.taskContentUI.removeItem(args.task);
    	    	 }else{
    	    		 MainPanel.settings.taskContentUI.insertItem(args.task);
    	    	 }
    	    	 if(!$.isEmptyObject(args.template)){
  				     MainPanel.settings.taskContentUI.insertItem(new Task(args.template));
  			     }
    	    	 break;
    	     case 'project':
    	    	 if(args.task.isDeleted()||args.task.isArchived()){
    	    		 MainPanel.settings.taskContentUI.removeItem(args.task);
    	    	 }else{
    	    		 MainPanel.settings.taskContentUI.insertItem(args.task);
    	    	 }
    	    	 break;
    	     case 'inProject':
    	    	 if(args.task.isDeleted()||args.task.isInbox()){
    	    		 MainPanel.settings.taskContentUI.removeItem(args.task);
    	    	 }else if(!args.task.isProject()){
    	    		 MainPanel.settings.taskContentUI.insertItem(args.task);
    	    	 }
    	    	 break; 
    	     default:
    	          break;
    	  }
      });

      Dispacher.connect('tasks.archive',function(event,args){
    	  if(FocusField.get()=='inProject'){
    		MainPanel.settings.taskContentUI.insertItems(new TaskList(args.tasklist));
  	     }else{
  		    MainPanel.settings.taskContentUI.removeItems(args.tasklist);
  	     }
      });
      
      Dispacher.connect('field.change',function(event,args){
    	  if(FocusField.get()==='inProject'){
    		  MainPanel.initProjectDetail(args.project);
    	  }else if(FocusField.get()==='inTask'){
    		  MainPanel.initTaskDetail(args.task);
    	  }else if(FocusField.get()==='us'){
    		  MainPanel.initOurTaskList(args.current_page,args.user_id);
    	  }else{
    		  MainPanel.initMyTaskList(args.current_page);
    	  }
      });
      Dispacher.connect('tag.change',function(event,args){
    	  if(args.isProject){
    		  args.project.addTag({data:args.img},function(data){
    			  $('#tag-project','.project-info').show();
    			  $('.clear-tag','.project-info').show();
    			  $('#tag-project','.project-info').attr('src','/res/tags/tag_'+args.project._id+'.png?i='+Math.random());
    		  });
    	  }
      });
	  switch(this.settings.type){
	    case 'us':
		  this.initOurTaskList(1, 0);
		  break;
	    case 'me':
	    default:
		  this.initMyTaskList();
		  break;
	  }
	  this.initActions($root);
  },

/*  setUser : function(user_id){
	  this.settings.user_id=user_id;
  },*/

  initMyTaskList : function(page){
	  var $root=$(this.settings.root);
	  if(typeof(page)=='undefined'){
	      var  page = 1;
	  }
	  $.getJSON('/api/tasks',{focusField:FocusField.get(),page:page,perPage:10},function(data){
	    	var tasks=new Array();
	    	$root.html(MainPanel.settings.taskContentUI.render());
	    	$.each(data.tasks,function(i,item){
	    		tasks.push(new Task(item));
	    	});
	    	MainPanel.settings.taskContentUI.insertItems(new TaskList(tasks).getParents());
	  });
  },
  //TODO
  initProjectDetail : function(project){
	  var $root=$(this.settings.root);
  	  $root.html(this.settings.taskContentUI.render());
  	  
  	  
  	  this.settings.taskContentUI.initProjectInfo(project);
  	  $.getJSON('/api/tasks',{focusField:'inProject',project_id:project._id},function(data){
  		  var tasks=new Array();
		  $.each(data.tasks,function(i,item){
			  tasks.push(new Task(item));
		  });
		  MainPanel.settings.taskContentUI.insertItems(new TaskList(tasks));
	  });
  },
  initOurTaskList : function(page,user_id){
	  var $root=$(this.settings.root);
	  $root.html(this.settings.taskContentUI.render());
	  this.settings.user_id=user_id|| this.settings.user_id;
	  $.getJSON('/api/Multitasks/', {
			userId : this.settings.user_id,
			page : page||1,
			perPage : 10
		}, function(data) {
			 var tasks=new Array();
			 $.each(data.tasks,function(i,item){
				 tasks.push(new Task(item));
			 });
			 MainPanel.settings.taskContentUI.insertItems(new TaskList(tasks).getParents().getUsers());
		});

  },
  initTaskDetail : function(task){
	 
	  var $root=$(this.settings.root);
	  this.settings.content=$root.html();
	  $root.html(this.settings.taskContentUI.render());
	  this.settings.taskContentUI.initTaskInfo(task);

/*	  $('#goback').live('click',function(){
		  var field_before=FocusField.get();
		  FocusField.set('us');
		  Dispacher.notify('field.change',
				{current_page:Number($('#current-page').html()),user_id:MainPanel.settings.user_id,field_before:field_before});
	  });*/
  },
 
  initActions : function($root){
	  $('.task-list li').live('click',function(){
		  $('.task-list li.selected').removeClass('selected');
		  $('.task-list li.done-selected').removeClass('done-selected');
		  if($(this).hasClass('done')){
		      $(this).addClass("done-selected");
		  }else{
			  $(this).addClass('selected');
		  }
		 if(FocusField.get()!=='us'){
			  Toolbar.formatButtons();
		  }
	  });
	  
	  $('.task-list li').live('dblclick',function(){
		  var field_before=FocusField.get();
		  if($(this).data("task").isProject()){
			  FocusField.set('inProject');
			  Dispacher.notify('field.change',{project:$(this).data("task"),field_before:field_before});
		  }
		  else if(FocusField.get()=='us'){
			  FocusField.set('inTask');
			  Dispacher.notify('field.change',{task:$(this).data("task"),field_before:field_before});
		  }
		  else{
		     $("#edit-task").click();
		  }
	  });
	  //TODO if error
	  $('.checkbox', '.task-list').live('click', function() {
		    var task=$(this).parent().data("task");
		    if(!task.isArchived()){
		    	task.edit({done :(task.isDone())?'false':'true'},function(data){
		    			Dispacher.notify('task.edit',{task:new Task(data.task),task_before:task});
		    	});
		    }
	  });
	  
	  $('.comment-flag').live('click',function(){
		  var task_id=$(this).attr('id').split('-')[1];
		 TextDialog.open({type:'comment',task_id:task_id});
	  });
	  
	  $('.progress-bar').live('click',function(){
		  var field_before=FocusField.get();
		  FocusField.set('inProject');
		  Dispacher.notify('field.change',{project:$(this).parent().data('task'),field_before:field_before});
		  //MainPanel.initProjectDetail($(this).parent().data('task'));
	  });
	  $('#add-comment').live('click',function(){
		  if($('#comment').val()!==''){
			  $.post('/api/Comments/create', {
				  taskId : $('.task-detail').attr('id').split('-')[1],
				  comment : $('#comment').val()
			  }, function(data) {
				 $.getJSON('/api/Comments/load', {
					id : data
				 }, function(data) {
					$('.comment-list').prepend(new CommentUI(data).render());
				 });

			  }, 'json');
			  $('#comment').val('');
			}
	  });
	  $(document).keypress(function(event){
		  if(!NewEditDialog.isOpen()&&!DateDialog.isOpen()&&document.activeElement.type!='textarea' ){
		      if(event.keyCode==46){   //delete
			      $('#delete-task').click();
		      }
		      if(event.keyCode==38){  // up
			     var children= $('.task-list li');
			     if(typeof(getCurrentTask())=='undefined'){
				      ($('.task-list li:last').hasClass('done'))?$('.task-list li:last').addClass('done-selected'):$('.task-list li:last').addClass('selected');
			     }else{
			          $.each(children,function(i,item){
				          if($(item).data('task')._id==getCurrentTask()._id){
					          if($(children[i-1]).length>0){
					              $(item).removeClass('selected').removeClass('done-selected');
					              ($(children[i-1]).hasClass('done'))?$(children[i-1]).addClass('done-selected'):$(children[i-1]).addClass('selected');
					           }
					          return false;
			              }
			         });
		         } 
		      }
             if(event.keyCode==40){  // down
        	     var children= $('.task-list li');
			     if(typeof(getCurrentTask())=='undefined'){
				     ($('.task-list li:first').hasClass('done'))?$('.task-list li:first').addClass('done-selected'):$('.task-list li:first').addClass('selected');
			     }else{
			         $.each(children,function(i,item){
				         if($(item).attr('id')==$('.task-list li.selected').attr('id')||$(item).attr('id')==$('.task-list li.done-selected').attr('id')){
					         if($(children[i+1]).length>0){
					            $(item).removeClass('selected').removeClass('done-selected');
					            ($(children[i+1]).hasClass('done'))?$(children[i+1]).addClass('done-selected'):$(children[i+1]).addClass('selected');
					         }
					         return false;
			             }
			         });
		         }
		     }
             if(event.which==99){//C
        	     $('.task-list li.selected').children('.checkbox').click();
        	     $('.task-list li.done-selected').children('.checkbox').click();
             }
             if(event.which==32){
        	     $('#new-task').click();
             }
             if(event.which==13){
        	     $('#edit-task').click();
             }
             Toolbar.formatButtons();
		  }
          
	  });

	
	  
	 /* $('.prev').click(function(){
		  $.getJSON('/api/tasks/',{focusField:'archived',page:})
	  });
	  $('.next').click(function(){});*/
  }
  
};

