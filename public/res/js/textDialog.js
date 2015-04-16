
var TextDialog={
	settings:{
	type : 'comment',
	root:null,
	task_id:0,
	task:null,
	toFocusField:null
    },
    init : function(options){
    	$.extend(this.settings,options);
    	var $root=$(this.settings.root);
    	$(this.settings.root).dialog( {
  			width : 500,
  			height : 300,
  			autoOpen : false
  		});
    	this.initActions($root);
    },

    initButtons : function($root){
    	var html='';
    	if(this.settings.type=='message'){
    	  html+='<div class="row buttons-row " >'+
                  '<input type="button" id="read" class="fr mr" value="我知道了" />'+
                '</div>';
    	}
    	if(this.settings.type=='active-parent'){
    		html+='<div class="row buttons-row " >'+
                    '<input type="button" id="active-ensure"  value="确定" />'+
                    '<input type="button" id="active-cancel"  value="取消" />'+
                  '</div>';
    	}
    	if(this.settings.type=='done-children'){
    		html+='<div class="row buttons-row " >'+
                    '<input type="button" id="active-ensure"  value="确定" />'+
                    '<input type="button" id="active-cancel"  value="取消" />'+
                  '</div>';
    	}
        $root.append(html);
     
    },
    initActions : function($root){
    	 $('#read').live('click',function(){
      	    $.post('/api/tasks/read', {
  				messageIds : Messages.getIds()
  			}, function(data) {
  			});
      	   $root.dialog("close");
         });
         $('#active-ensure').live('click',function(){
        	 getCurrentProject().edit({focusField:'next'},function(data){
        		 Dispacher.notify('task.edit',{task:data.task});
        		 TextDialog.settings.task.edit({focusField:TextDialog.settings.toFocusField},function(data){
        		     Dispacher.notify('task.edit',{task:data.task});
        			 $root.dialog("close");
        		 });
        	 });
         });
         $('#active-cancel').live('click',function(){
        	 $root.dialog("close");
         });
    },
    open : function(options){
      $.extend(this.settings,options);
	  var $root=$(this.settings.root);
	  var title;

	  switch(this.settings.type){
	    case 'comment':
	    	title='评论';
	    	$root.html('正在载入评论......');
		    $.getJSON("/api/tasks/listComments", {
				taskId : this.settings.task_id
			}, function(data) {
				$root.html(Comments.makeList(data));
			});
	    	break;
	    case 'message':
	    	title='未读消息';
	    	$root.html('正在载入消息......');
	    	$.getJSON('/api/tasks/listmessages',{},function(data){
	    		$root.html(Messages.makeList(data));
	    		if(!$.isEmptyObject(data))
	    		   TextDialog.initButtons($root);
	    	});
	    	break;
	    case 'active-parent':
	    	title='是否激活项目？';
	    	$root.html('如果不激活项目此操作将不能执行，要激活项目吗？');
	    	break;
	    case 'done-children':
	    	title='是否完成所有子任务？';
	    	var x=0;
	    	$.each($('.task-list'),function(i,item){
	    		if(!$(item).hasClass('done'))
	    			i++;
	    	});
	    	$root.html('还有'+x+'条子任务没有完成，要完成他们吗？');
	    	break;
	    default:
	    	break;
	  }
	  $root.dialog('option','title',title);
	  $root.dialog('open');
	  this.initButtons($root);
    }
};