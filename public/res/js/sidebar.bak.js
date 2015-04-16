/**
 * 
 * 使用
 * SidebarPanel.init({type : "me", root : "#sidebar"});
 * 
 */
var SidebarPanel = {
	settings : {
		type : "me",
		/**
		 * sidebar的最外层容器,比如：<div id="sidebar"></div>
		 */
		root : null,
		
		user_id : 0,
		observers:new Array()
	},
   
	/**
	 * @access public
	 */

	init : function(options) {
		$.extend(this.settings, options);
        Dispacher.connect('tasks.delete', function(event,args){
        	$.each(args.tasklist,function(i,item){
        		if(item.focusType_before=='undefined'){
        			SidebarPanel.changeCounter(item.focusType,'deleted',item);
        		}else{
        			SidebarPanel.changeCounter(item.focusType_before,'deleted',item);
        		}
        		
        		if(item.isProject()){
        			SidebarPanel.removeProject(item._id);
        		}
        	});
      /*  	$.each(args.back,function(i,item){
        		SidebarPanel.changeCounter(item.focusType,'deleted',item);
        		if(item.isProject()){
        			SidebarPanel.removeProject(item._id);
        		}
        	});*/
        });
        Dispacher.connect('task.create',function(event,args){
        	SidebarPanel.changeCounter('',args.task.focusType,args.task);
        	if(args.task.isProject()){
        		SidebarPanel.insertProject(new Task(args.task));
        	}
        });
        Dispacher.connect('task.edit',function(event,args){
        	if(args.task_before){
        		SidebarPanel.changeCounter(args.task_before.focusType, '', args.task_before);
        	}
            if(args.task){
            	 SidebarPanel.changeCounter('',args.task.focusType,args.task);
            	 if(args.task.isProject()){
             		args.task.isActive()?SidebarPanel.insertProject(args.task):SidebarPanel.removeProject(args.task._id);
             	 }
            }
        	
        });

        Dispacher.connect('field.change',function(event,args){
        	if(args.user_id===undefined){
        		if(FocusField.get()!=='inTask'&&FocusField.get()!=='us'){
            	  $('.focus-bundle li.current').removeClass('current');
        		}
            }else{
            	$('.focus-bundle li.current').removeClass('current');
            }
        	
            $('#focus-'+FocusField.get(),'.focus-bundle').addClass('current');
            $('#user-'+args.user_id,'.focus-bundle').addClass('current');
            if(FocusField.get()==='inProject'){
            	args.project.isActive()?$('#focus-inProject-'+args.project._id,'.focus-bundle').addClass('current'):$('#focus-project','.focus-bundle').addClass('current');
            }
      
        });
		switch (this.settings.type) {
		case "me":

			$root = $(this.settings.root);

			this.initCollectBundle($root);
			this.initWorkflowBundle($root);
			this.initProjectsBundle($root);
			//this.initAreasBundle($root);
			this.initArchiveBundle($root);
			this.initCounter();
			break;
		case "us":
			$root = $(this.settings.root);
			
			this.initUsersBundle($root,0);
			break;
		default:
			break;
		}
		this.initActions();
	},

	/**
	 * @access private
	 */
	initCollectBundle : function($root) {
		/**
		 * 收集
		 */

		var html = '';
		
		html+='<div class="focus-bundle collect-bundle">'+
	            '<h3>收集</h3>'+
	            '<ul>'+
	              '<li id="focus-inbox">'+
	                '<div class="focus-name inbox">收集箱</div>'+
	                '<div class="focus-counter">'+
	                  '<span class="counter due-counter">0</span>'+
	                  '<span class="counter todo-counter">0</span>'+
	                '</div>'+
	              '</li>'+
	            '</ul>'+
	          '</div>';
		$root.html(html);
		/*$.getJSON('/api/tasks/countinbox',{},function(data){
			$('#count-inbox').html(data);
		});*/
		// 取收集箱未完成的任务的数量，并在界面上显示。
	},

	/**
	 * @access private
	 */
	initWorkflowBundle : function($root) {
		/**
		 * 今日、下一步、日程、择日、项目
		 */
		var html='';
		html+='<div class="focus-bundle workflow-bundle">'+
	            '<h3>焦点</h3>'+
	            '<ul>'+
	            
	              '<li id="focus-today">'+
	                '<div class="focus-name today">今日待办</div>'+
	                '<div class="focus-counter">'+
	                  '<span class="counter due-counter">0</span>'+
	                  '<span class="counter todo-counter">0</span>'+
	                '</div>'+
	              '</li>'+
	              
	              '<li id="focus-next">'+
	                '<div class="focus-name next">下一步行动</div>'+
	   
	              '</li>'+
	              
	              '<li id="focus-schedule">'+
	                '<div class="focus-name schedule">日程</div>'+
	              '</li>'+
	              
	              '<li id="focus-someday">'+
	                '<div class="focus-name someday">择日待办</div>'+
	              '</li>'+
	              
	              '<li id="focus-project">'+
	                '<div class="focus-name projects">项目</div>'+
	              '</li>'+
	              
	            '</ul>'+
	          '</div>';
		$root.append(html);
		
	},

	/**
	 * @access private
	 */
	initProjectsBundle : function($root) {
		/**
		 * 活动的项目
		 */
		var html='<div class="focus-bundle projects-bundle ">'+
	               '<h3 class="opened"><span class="icon">+</span><span class="heading"></span></h3>'+
	               '<ul></ul>'+
	             '</div>';
		$root.append(html);
		
		$.getJSON('/api/tasks/listactiveproject',{},function(data){
			if($.isEmptyObject(data)){
				$('.projects-bundle').hide();
			}
			$.each(data,function(i,project){
				SidebarPanel.insertProject(new Task(project));
			});
		});
		
	},

	/**
	 * @access private
	 */
	initAreasBundle : function($root) {
		/**
		 * 区域，暂时不考虑
		 */
/*		var html='<div class="focus-bundle contact-bundle">'+
	               '<h3 class="opened"><span class="icon">+</span><span class="heading">成员</span></h3>'+
	               '<ul>'+
	                 '<li><div class="focus-name project">member A</div></li>'+
	                 '<li><div class="focus-name project">member B</div></li>'+
	               '</ul>'+
	             '</div>';
		$root.append(html);*/

	},
	/**
	 * 用户列表
	 * @access private
	 */
	initUsersBundle : function($root,user_id){
		var html='<div class="focus-bundle contact-bundle">'+
                   '<h3 class="opened"><span class="icon">+</span><span class="heading">成员</span></h3>'+
                   '<ul >'+
	                 '<li id="user-0"><div class="focus-name member"><a href="#userId=0&page=1" >全部</a></div></li>'+
		           '</ul>'+
                 '</div>';
        $root.html(html);
		$.getJSON('/api/Multitasks/listusers',{},function(data){
			var html=' ';
			if (!$.isEmptyObject(data)) {
				$.each(data, function(i, user) {
					html += '<li id="user-' + user._id + '"><div class="focus-name member"><a href="#userId='+user._id+'&page=1">' + user.username + '</a></div></li>';
				});
			}
		    $('.contact-bundle').children('ul').append(html);
		});
		$('#user-'+user_id).addClass('current');
	},
	/**
	 * @access private
	 */
	initArchiveBundle : function($root) {
		/**
		 * 归档 跟 垃圾箱
		 */
		var html='<div class="focus-bundle archive-bundle"  style="margin-top: 160px;">'+
                   '<ul>'+
                     '<li id="focus-archived"><div class="focus-name archive">归档</div></li>'+
                     '<li id="focus-deleted"><div class="focus-name trash">垃圾箱</div></li>'+
                   '</ul>'+
                 '</div>';
		$root.append(html);
    
	},
	initCounter : function(){
		$('.focus-counter').children('.counter').hide();
		$.getJSON('/api/tasks/counter',{},function(data){
			SidebarPanel._checkCounter('inbox',data.inboxTodo, data.inboxDue);
			SidebarPanel._checkCounter('today',data.todayTodo, data.todayDue);
		});
	},
	_checkCounter : function(focusField,todo_num,due_num){
		var counter=$('.focus-counter','#focus-'+focusField);
		var counter_todo=$('.focus-counter','#focus-'+focusField).children('.todo-counter');
		var counter_due=$('.focus-counter','#focus-'+focusField).children('.due-counter');
		todo_num=(todo_num===''||todo_num<0)?Number(counter_todo.html()):todo_num;
		due_num=(due_num===''||due_num<0)?Number(counter_due.html()):due_num;
		
		counter_todo.html(todo_num);
		counter_due.html(due_num);
		
		(todo_num>0)?counter_todo.show():counter_todo.hide();
		(due_num>0)?counter_due.show():counter_due.hide();
		
		if(todo_num>0&&due_num>0){
			counter.removeClass('one-counter').addClass('two-counter');
		}else if(todo_num>0||due_num>0){
			counter.removeClass('two-counter').addClass('one-counter');
		}
	},
	changeCounter : function(fromFocusField,toFocusField,task){
		var todo_minus='';
		var due_minus='';
		var todo_add='';
		var due_add='';
		if(task.isDone()){
			return;
		}
		if(task.isProject()&&task.items>0){
			if(toFocusField=='today'){
			    todo_add=Number($('.focus-counter','#focus-today').children('.todo-counter').html())+(task.items_next)?task.items_next.unDue:0;
			    due_add=Number($('.focus-counter','#focus-today').children('.due-counter').html())+(task.items_next)?task.items_next.due:0;
			    SidebarPanel._checkCounter('today', todo_add, due_add);
			}
			if(toFocusField=='next'||toFocusField=='someday'||toFocusField=='schedule'||toFocusField=='project'||toFocusField=='deleted'){
				todo_minus=Number($('.focus-counter','#focus-today').children('.todo-counter').html())-(task.items_today)?task.items_today.unDue:0;
				due_minus=Number($('.focus-counter','#focus-today').children('.due-counter').html())-(task.items_today)?task.items_today.due:0;
				SidebarPanel._checkCounter('today', todo_minus, due_minus);
			}
		}else{
			due_minus=task.isDue()?Number($('.focus-counter','#focus-'+fromFocusField).children('.due-counter').html())-1:'';
			todo_minus=task.isDue()?'':Number($('.focus-counter','#focus-'+fromFocusField).children('.todo-counter').html())-1;
			this._checkCounter(fromFocusField, todo_minus, due_minus);
			due_add=task.isDue()?Number($('.focus-counter','#focus-'+toFocusField).children('.due-counter').html())+1:'';
			todo_add=task.isDue()?'':Number($('.focus-counter','#focus-'+toFocusField).children('.todo-counter').html())+1;
			this._checkCounter(toFocusField, todo_add, due_add);
		}
		
	},
	
	/**
	 * 
	 * 在sidebar中插入一条活动的项目，若该项目已存在则不添加
	 */
	insertProject : function(project){
		($('ul','.projects-bundle').children('#focus-inProject-'+project._id).length==0)?$('ul','.projects-bundle').prepend('<li id="focus-inProject-'+project._id+'" class="ui-droppable"><div class="focus-name project">'+project.title+'</div></li>'):'';
		$('#focus-inProject-'+project._id,'.projects-bundle').data("task",project);
		
		$('#focus-inProject-'+project._id,'.projects-bundle').droppable({
			accept: function(d){
			  if(d.hasClass('project')){
				return false;
			  }
			  return true;
		    },
			hoverClass : 'hover',
			drop : function(event,ui){
				var task=clone($(ui.draggable).data("task"));
				var parentTitle=$('.focus-name',this).html();
				//TODO  
				task.edit({
					parent : project._id,
					focusField : 'inProject'
				},function(data){
					data.task.parent=$('#focus-inProject-'+project._id,'.projects-bundle').data('task');
					Dispacher.notify('task.edit',{task:data.task,task_before : task});
				});
			}
		});
		$('.projects-bundle').show();
		
	},
	removeProject : function(project_id){
		$('ul','.projects-bundle').children('#focus-inProject-'+project_id).remove();
		($('ul','.projects-bundle').children().length==0)?$('.projects-bundle').hide():$('.projects-bundle').show();
	},
	initActions : function(){
		$('#focus-'+FocusField.get()).addClass('current');
		$('.icon','.opened').click(function(){
			$(this).parent().parent().find('ul').toggle();
		});
		$('.focus-bundle li').click(function() {
			    var field_before=FocusField.get();
			    FocusField.set($(this).attr('id').split('-')[1]);
			    Dispacher.notify('field.change',{field_before:field_before});
			
		});
		
		$('.projects-bundle li').live('click',function(){
			var field_before=FocusField.get();
			$('.focus-bundle li.current').removeClass('current');
			$(this).addClass('current');
			FocusField.set('inProject');
			Dispacher.notify('field.change',{project:$(this).data('task'),field_before:field_before});
			/*
		    MainPanel.initProjectDetail($(this).data('task'));*/
		});
		$('.focus-bundle li').droppable( {
			accept : function(d) {
			    var toFocusField= $(this).attr('id').split('-')[1];
			    if(d.data("task")){
			    	
			       if(d.data("task").focusType==toFocusField&&d.data("task").focusType!='schedule'){
			    	  return false;
			       }
			    
				  if (toFocusField == 'archived' && !d.hasClass('done')) {
					  return false;
				  }
				  if(toFocusField=='project'&&d.data("task").isSubTask()){
					  return false;
				  }
				  if(toFocusField=='inbox'&&d.data("task").isProject()){
					  return false;
				  }
			    }
				/*if(FocusField.get()=='inProject'&&!$('.title-bar').hasClass('active')&&(toFocusField=='next'||toFocusField=='today')){
					TextDialog.open({type:'active-parent',task:d.data("task"),toFocusField:toFocusField});
					return false;
				}*/
				return true;
			},
			hoverClass : 'hover',
			drop : function(event, ui) {
				var toFocusField= $(this).attr('id').split('-')[1];
				var task=clone($(ui.draggable).data("task"));
				if(toFocusField=='schedule'){
					DateDialog.open(task);
				}else if(FocusField.get()=='inProject'&&!$('.project-info').data('task').isActive()&&(toFocusField=='next'||toFocusField=='today')){
					TextDialog.open({type:'active-parent',task:task,toFocusField:toFocusField});
				}else{
					task.edit({
						focusField:toFocusField
					},function(data){
						Dispacher.notify('task.edit',{task:data.task,task_before:task});
					});
				}
			}
		});
		$('.contact-bundle li').live('click',function(){
			var field_before=FocusField.get();
			FocusField.set('us');
			Dispacher.notify('field.change', {page:1,user_id:$(this).attr('id').split('-')[1],field_before:field_before});
			/*$('.contact-bundle li.current').removeClass('current');
			$(this).addClass('current');
			MainPanel.initOurTaskList(1,$(this).attr('id').split('-')[1]);
			Toolbar.formatPageTools();*/
		});
		
	}
};