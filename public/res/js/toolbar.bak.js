
/**
 * 
 * 使用
 * Toolbar.init({type : "me", root : "#toolbar"});
 * 
 */
var Toolbar = {
		
	settings : {
	  type : "me",
	/**
	 * sidebar的最外层容器,比如：<div id="sidebar"></div>
	 */
	  root : null
    },

    init:function(options){
    	$.extend(this.settings, options);
    	$root=$(this.settings.root);
        Dispacher.connect('task.edit  tasks.delete tasks.archive',function(){
        	Toolbar.formatButtons();
        });
        Dispacher.connect('field.change',function(event,args){
        	if(FocusField.get()==='us'){
        		Toolbar.formatPageTools(args.current_page,args.total_page);
        	}else if(FocusField.get()==='archived'){
        		Toolbar.formatButtons();
        		Toolbar.formatPageTools(args.current_page,args.total_page);
        		
        	}else if(FocusField.get()!=='inTask'){
        		Toolbar.formatButtons();
        	}
        });
    	switch(this.settings.type){
    	case 'me':
    		this.initButtons($root);
    		break;
    	case 'us':
    		this.initPageTool($root);
    		break;
    	default:
    		break;
    	}
    	this.initActions();
    },
    formatButtons : function(){
    	//this.settings.focusField=(typeof focusField=='undefined')?$('.focus-bundle li.current').attr('id').split('-')[1]:focusField;

    	$('.leftbar').empty();
    	$('.centerbar').empty();
    	$('.pager').empty();
    	
    	var new_task='<a href="javascript:void(0);" id="new-task" class="newtask">新增</a>';
    	var new_repeating='<a href="javascript:void(0);" id="new-repeating" class="newrepeating">新增重复</a>';
    	var new_project='<a href="javascript:void(0);" id="new-project" class="addproject">新增项目</a>';
    	var edit_task='<a href="javascript:void(0);" id="edit-task" class="edittask disabled">编辑</a>';
    	var delete_task='<a href="javascript:void(0);" id="delete-task" class="deltask disabled">删除</a>';
    	
    	var schedule_task='<a href="javascript:void(0);" id="schedule-task"class="schedule disabled">计划</a>';
    	var today_task='<a href="javascript:void(0);" id="today-task" class="today disabled hidden">今日</a>';
    	var notToday_task='<a href="javascript:void(0);" id="notToday-task" class="today disabled ">改日</a>';
    	var active_project='<a href="javascript:void(0);" id="active-project"class="active disabled hidden">激活</a>';
    	var inactive_project='<a href="javascript:void(0);" id="inactive-project"class="inactive disabled">冷冻</a>';
    	var archive_task='<a href="javascript:void(0);" id="archive-task" class="logcompleted disabled">归档</a>';
    	var showinproject='<a href="javascript:void(0);" class="showinproject hidden">显示项目</a>';
    	var clear_trash='<a href="javascript:void(0);" id="clear-trash" class="newtask">清空垃圾箱</a>';
    	var page_tool='<a href="javascript:void(0);"class="newtask "><span id="current-page">1</span>/<span id="total-page">1</span> 页</a>&nbsp;&nbsp;'+
                      '<a id="pre-page" class="newtask">上页</span>'+
                      '<a id="next-page" class="newtask">下页</span>';
  
    	//TODO
    	switch(FocusField.get()){
    	case 'inbox':
    		$('.leftbar').html(new_task+edit_task+delete_task);
    		$('.pager').empty();
    		break;
    	case 'today':
    		$('.leftbar').html(new_task+edit_task+delete_task);
    		$('.centerbar').html(notToday_task+schedule_task+archive_task);
    		$('.pager').empty();
    		break;
    	case 'next':
    		$('.leftbar').html(new_task+edit_task+delete_task);
    		$('.centerbar').html(today_task+notToday_task+archive_task);
    		$('.pager').empty();
    		break;
    	case 'schedule':
    		$('.leftbar').html(new_task+new_repeating+edit_task+delete_task);
    		$('.centerbar').html(schedule_task);
    		$('.pager').empty();
    		break;
    	case 'someday':
    		$('.leftbar').html(new_task+edit_task+delete_task);
    		$('.pager').empty();
    		break;
    	case 'project':
    		$('.leftbar').html(new_project+edit_task+delete_task);
    		$('.centerbar').html(today_task+notToday_task+inactive_project+active_project);
    		$('.pager').empty();
    		break;
    	case 'inProject':
    		$('.leftbar').html(new_task+edit_task+delete_task);
    		$('.centerbar').html(today_task+notToday_task+archive_task);
    		$('.pager').empty();
    		break;
    	case 'archived':
    		$('.leftbar').html(delete_task+showinproject);
    		//$('.centerbar').html(page_tool);
    		$('.pager').html(page_tool);
    		break;
    	case 'deleted':
    		$('.leftbar').html(clear_trash);
    		$('.pager').empty();
    		break;
    	default:
    		break;
    	}
    	
    	($('.task-list').children('.done').length>0)?$('#archive-task').removeClass('disabled'):'';
    	if(typeof(getCurrentTask())!=='undefined'){
    		$('#edit-task').removeClass('disabled');
    		$('#delete-task').removeClass('disabled');
    		$('#schedule-task').removeClass('disabled');
    		$('#notToday-task').removeClass('disabled');
    		$('#today-task').removeClass('disabled');
    		$('#active-project').removeClass('disabled');
    		$('#inactive-project').removeClass('disabled');
    		var task=getCurrentTask();
    		if(task.isToday()){
    			$('#notToday-task').removeClass('hidden');
    			$('#today-task').addClass('hidden');
    		}else{
    			$('#notToday-task').addClass('hidden');
    			$('#today-task').removeClass('hidden');
    		}
    		if(task.isActive()){
    			$('#active-project').addClass('hidden');
    			$('#inactive-project').removeClass('hidden');
    		}else{
    			$('#active-project').removeClass('hidden');
    			$('#inactive-project').addClass('hidden');
    		}
    		if(task.isSubTask()){
    			$('.showinproject').removeClass('hidden');
    		}else{
    			$('.showinproject').addClass('hidden');
    		}
    	}
    	
    	/*$.each($('.task-list').not('.archived-list').children('li'),function(i,item){
    		console.log($(item));
    		if($(item).data('task').isDone()){
    			console.log('aaa');
    			$('.archived-task').removeClass('disabled');
    			return false;
    		}
    	});*/
     
    },
    formatPageTools : function(current_page,total_page){
      switch(FocusField.get()){
    	  case 'us':
    		  $('#current-page').html(current_page||1);
    		 
    		  if(typeof total_page=='undefined'){
    			  var user_id=$('.contact-bundle li.current').attr('id').split('-')[1];
        		  $.getJSON('/api/Multitasks/getpage',{userId:user_id,perPage:10},function(data){
        	   		  $('#total-page').html(data);	
        	   	  });
    		  }else{
    			  $('#total-page').html(total_page);	
    		  }
    	
    		  break;
    	  case 'archived':
    		  $('#current-page').html(current_page||1);
    		  if(typeof total_page=='undefined'){
    		    $.getJSON('/api/tasks/getpage',{perPage:10},function(data){
    		
    	   		  $('#total-page').html(data);	
    	   	    });
    		  }else{
    			  $('#total-page').html(total_page);	
    		  }
    		  break;
    	  default:
    	      break;
      }
   	  
    },
    initButtons : function($root){
    	var html='';
    	html+='<div class="leftbar"></div>'+
    	      '<div class="pager"></div>'+
              '<div class="centerbar"></div>'+
              '<div class="rightbar">'+
               // '<a href="#" class="quickentry">快速添加</a>'+
              '</div>';
    	$root.html(html);
    	
    	this.formatButtons();
    },
  
    initPageTool : function($root){
  	    var html='<div class="pager">'+
  	    	        '<a href="javascript:void(0);"class="newtask"><span id="current-page">1</span>/<span id="total-page">1</span> 页</a>&nbsp;&nbsp;'+
  	    	        '<a id="first-page" class="">首页</span>&nbsp;&nbsp;'+
  	                '<a id="pre-page" class="">上一页</span>&nbsp;&nbsp;'+
  	                '<a id="next-page" class="">下一页</span>&nbsp;&nbsp;'+
  	                '<a id="last-page" class="">尾页</span>&nbsp;&nbsp;'+
  	             '</div>';
  	  $root.html(html);
  	  this.formatPageTools();
    },
    initActions : function(){
    	$('#new-task').live('click',function() {
    		/*NewEditDialog.open({type:'new'});*/
    		newDialog.open();
		});
    	$('#new-project').live('click',function(){
    		new Task().create({title:'project',focusField:'project'}, function(data){
    			Dispacher.notify('task.create', {task:data.task});
    		});
    	});
    	$('#new-repeating').live('click',function(){
    		NewEditDialog.open({type:'new'});
    		RepeatDialog.open();
    	});
    	$('#edit-task').live('click',function(){
    		if(!$(this).hasClass('disabled')){
    			editDialog.open();
    		}
    		/*if(!$(this).hasClass('disabled')){
    		   NewEditDialog.open({type:'edit'});
    		}*/
    	});
    	
    	$('#delete-task').live('click',function(){
    		if(!$(this).hasClass('disabled')){
    		   var tasklist=new Array();
    		   $.each($('.task-list li.selected,.task-list li.done-selected'),function(i,item){
    				tasklist.push($(item).data('task'));
    		   });
    		   new TaskList(tasklist).remove(function(data){
    			   Dispacher.notify('tasks.delete', {tasklist : data});
    		   });
    		}
    	});
    	
    	$('#archive-task').live('click',function(){
    		if(!$(this).hasClass('disabled')){
    		   new TaskList().archive(function(data){
    			   Dispacher.notify('tasks.archive',{tasklist : data});
    		   });
    		}
    	});
    	
    	$('#today-task').live('click',function(){
    		if(!$(this).hasClass('disabled')){
    		   var task=getCurrentTask();
    		   if(FocusField.get()=='inProject'&&!$('.project-info').data('task').isActive()){
    			   TextDialog.open({type:'active-parent',task:task,toFocusField:'today'});
    		   }else{
    		       task.edit({focusField:'today'},function(data){
    		        Dispacher.notify('task.edit',{task:data.task,task_before:task});
    		       });
    		  }
    		}
    	});
    	
    	$('#notToday-task').live('click',function(){
    		if(!$(this).hasClass('disabled')){
    		   getCurrentTask().edit({focusField:'next'},function(data){
    			   Dispacher.notify('task.edit',{task:data.task,task_before:getCurrentTask()});
    			
    		   });
    		}
    	});
    	
    	$('#active-project').live('click',function(){
    		if(!$(this).hasClass('disabled')){
    		   getCurrentTask().edit({focusField:'next'},function(data){
    			   Dispacher.notify('task.edit',{task:data.task,task_before:getCurrentTask()});
    		   });
    		}
    	});
    	$('#inactive-project').live('click',function(){
    		if(!$(this).hasClass('disabled')){
    		   getCurrentTask().edit({focusField : 'someday'},function(data){
    			   Dispacher.notify('task.edit',{task:data.task,task_before:getCurrentTask()});
    		   });
    		}
    	});
    	$('#schedule-task').live('click',function(){
    		if(!$(this).hasClass('disabled')){
    		  //TODO
    			if(getCurrentTask().isTemplate()){
    				getCurrentTask().show(function(data){
    					Repeat.set(data.repeat);
    					RepeatDialog.open(true);
    				});
    			}else{
    			  DateDialog.openForDrag(getCurrentTask(),'schedule');
    			}
    		}
    	});
    	
    	$('.showinproject').live('click',function(){
    		var field_before=FocusField.get();
    		FocusField.set('inProject');
    		Dispacher.notify('field.change', {project:new Task(getCurrentTask().parent),field_before:field_before});
    	});
    	$('#clear-trash').live('click',function(){
    		   var tasklist=new Array();
    		   $.each($('.task-list li'),function(i,item){
    				tasklist.push($(item).data('task'));
    		   });
    		   new TaskList(tasklist).remove(function(data){
    			   Dispacher.notify('tasks.delete',{tasklist:tasklist});
    		   });
    	});
    	
    	$('.quickentry').live('click',function(){
    		CanvasDialog.open();
    		//alert("Coming soon...");
    	});
    	$("#next-page").live('click',function() {
    	     current_page=Number($('#current-page').html());
    		 total_page=Number($('#total-page').html());
    		 console.log(current_page);
    		 console.log(current_page+1);
    	     if(current_page<total_page){
    	    	 Dispacher.notify('field.change',{current_page:current_page+1,total_page:total_page,field_before:FocusField.get()});
    	     }
    			//url ='userId='+userId+'&page='+(Number(page)+1);
    		//$.history.load(url);
    	});
    	$("#pre-page").live('click',function(){
    		 current_page=Number($('#current-page').html());
    		 total_page=Number($('#total-page').html());
    		 if(current_page>1){
    			 Dispacher.notify('field.change',{current_page:current_page-1,total_page:total_page,field_before:FocusField.get()});
    		 }
    	 });
    	 $("#first-page").live('click',function(){
    		 current_page=Number($('#current-page').html());
    		 total_page=Number($('#total-page').html());
    		 if(current_page>1){
    			 Dispacher.notify('field.change',{current_page:1,total_page: total_page,field_before:FocusField.get()});
    		 }
    	 });
    	 $("#last-page").live('click',function(){
    		 current_page=Number($('#current-page').html());
    		 total_page=Number($('#total-page').html());
    		 if(current_page<total_page){
    			 Dispacher.notify('field.change',{current_page:total_page,total_page:total_page,field_before:FocusField.get()});
    		 }
    	 });
    }
};