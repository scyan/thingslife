Date.prototype.setISO8601 = function(dString) {
	var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
	if (dString.toString().match(new RegExp(regexp))) {
		var d = dString.match(new RegExp(regexp));
		var offset = 0;
		this.setUTCDate(1);
		this.setUTCFullYear(parseInt(d[1], 10));
		this.setUTCMonth(parseInt(d[3], 10) - 1);
		this.setUTCDate(parseInt(d[5], 10));
		this.setUTCHours(parseInt(d[7], 10));
		this.setUTCMinutes(parseInt(d[9], 10));
		this.setUTCSeconds(parseInt(d[11], 10));
		if (d[12])
			this.setUTCMilliseconds(parseFloat(d[12]) * 1000);
		else
			this.setUTCMilliseconds(0);
		if (d[13] != 'Z') {
			offset = (d[15] * 60) + parseInt(d[17], 10);
			offset *= ((d[14] == '-') ? -1 : 1);
			this.setTime(this.getTime() - offset * 60 * 1000);
		}
	} else {
		this.setTime(Date.parse(dString));
	}
	return this;
};
var Dispacher={
		connect : function(event,fun){
			$("body").bind(event,fun);
		},
        notify : function(event,args){
        	$("body").trigger(event,args);
        }
};


var TimeMachine = {
	today : function(type) {
	    var today=new Date();
    	switch (type){
    	case 'Y-m-d':
    		today=today.getUTCFullYear()+'-'+(today.getUTCMonth()+1)+'-'+today.getUTCDate();
    		today=today.replace(/\b(\w)\b/g, '0$1');
    		return today;
    		break;
    	default:
    	     today=today.getTime();
		    return today;
    		break;
    	}
	},
    tomorrow : function(type){
		 var myDate=new Date();
		 myDate.setUTCDate(myDate.getUTCDate()+1);
	    	switch (type){
	    	case 'Y-m-d':
	    		myDate=myDate.getUTCFullYear()+'-'+(myDate.getUTCMonth()+1)+'-'+(myDate.getUTCDate());
	    		myDate=myDate.replace(/\b(\w)\b/g, '0$1');
	    		return myDate;
	    		break;
	    	default:
	    		myDate=myDate.getTime();
			    return myDate;
	    		break;
	    	}
	},
	fullTime : function(date){
		var myTime = new Date();
		myTime.setISO8601(date);
		return myTime.getFullYear() + '-' +
		       (myTime.getUTCMonth() + 1) + '-' +
		       myTime.getUTCDate() + ' '+ 
		       myTime.getHours() + ':' +
		       myTime.getMinutes();
	},
	custom : function(timestamp,type){
		var myDate=new Date(timestamp);
		myDate=myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate();
		return myDate.replace(/\b(\w)\b/g, '0$1');
	},
	timestamp : function(date){
		var myDate=new Date(date.split('-')[0],(date.split('-')[1]-1),date.split('-')[2]);
		return myDate.getTime();
	}
};

var Comments={
	makeList : function(comments){
	  var html = '';
	  $.each(comments, function(i, comment) {
		html += new CommentUI(comment).render();
	  });
	  return html;
    }
};
var Messages={
	makeList : function(messages){
	  var html = '<ul class="comment-list" id="message-list">';
	  $.each(messages, function(i, message) {
		html +=  '<li id="message-'+message._id+'"><div class="message">' + message.content + '</div></li>';
	  });
	  html += '</ul>';
	  return html;
    },
    getIds : function(){
    	var message_ids='';
		var i=1;
		while(i<= $('#message-list').children().length){
			message_ids=message_ids+','+$('#message-list :nth-child('+i+')').attr('id').split('-')[1];
			  i++;
		}
		return message_ids.substr(1);
    }
};
var FocusField={
	  focusField:'today',
	  get:function(){
    	  return this.focusField;
      },
	  set:function(focusField){
    	  this.focusField=focusField;
      }
};
var Repeat={
	settings : {
	  type : 'daily',
	  frequency : 1,
	  days : '',
	  edit_repeat : false
    },
    init : function(){
    	this.settings.type='daily';
    	this.settings.frequency=1;
    	this.settings.days='';
    	this.settings.edit_repeat=false;
    },
	set : function(options){
    	$.extend(this.settings,options);
    	if(this.settings.type=='weekly'&&this.settings.frequency>=1&&this.settings.days!='')
    		this.settings.edit_repeat=true;
    	var $type;
    	switch(this.settings.type){
    	  case 'weekly':
    		$type='周';
    		break;
    	  case 'monthly':
    		$type='月';
    		break;
    	  case 'yearly':
    		$type='年';
    		break;
    	  case 'daily':
    	  default:
    		$type='日';
    		break;
    		
    	}
    	$("#repeat-info").html(' ' + '<span>每' + this.settings.frequency + $type+'</span>' + ':');
		var $days=this.settings.days.split(',');
    	for ( var i in $days) {
			$("#repeat-info").append('星期' + $days[i] + ' ');
		}
    },
    get : function(){
    	return this.settings;
    }
};
function clone(myObj){  
	    if(typeof(myObj) != 'object' || myObj == null) return myObj;  
	    var newObj = new Object();  
	    for(var i in myObj){  
	      newObj[i] = clone(myObj[i]);
	    }  
	    return newObj;  
	} 
function getCurrentProject(){
	return clone($('.project-info').data("task"));
}
function getCurrentTask(){
    return clone($('.task-list li.selected, .task-list li.done-selected').data('task'));
}




//$(#delete-btn).click(Toolbar.deleteButtonHander);

/*Toolbar.deleteButtonHander = function() {
	if (TaskUIList.getSelectedItem()) {
		TaskUIList.deleteItem(TaskUIList.getSelectedItem());
	}
}*/





function CommentUI(comment){
	this.comment=comment;
	var html='';
	if (typeof CommentUI._initialized == 'undefined') {
		CommentUI.prototype.render=function(){
			var html = '';
			var createdTime = new Date();

			createdTime.setISO8601(this.comment.createdTime);
			html += '<li>' + 
			          '<div class="meta">'+
			            '<span class="author">' + this.comment.username + '</span>'+
			            '<span class="created">' + createdTime.getFullYear() + '-'+ (createdTime.getUTCMonth() + 1) + '-' + createdTime.getUTCDate() + ' ' + createdTime.getHours() + ':' + createdTime.getMinutes() + ':'+ createdTime.getSeconds() + '</span>'+
			          '</div>' + 
			          '<div class="message">' + this.comment.content + '</div>' + 
			        '</li>';
			return html;
		};
	}
	CommentUI._initialized = true;
}

var T = {
	init : function() {
	    //this._initLayout();
	    var type=(window.location.href.split('/')[3]=='us')?'us':'me';
	    if(type=='us'){
	    	FocusField.set('us');
	    }else{
	        FocusField.set( ($.isEmptyObject(window.location.href.split('#')[1])) ? 'today' : window.location.href.split('#')[1]);
	    }
	    TopPanel.init({type : type, root : '#header'});
	    MainPanel.init({type : type, root : '#content'});
		SidebarPanel.init({type : type, root : '#focus-panel'});
		Toolbar.init({type : type, root : '#toolbar'});
		
		
		DateDialog.init({root:'#date-dialog'});
		NewEditDialog .init({type : 'new',root : '#new-edit-dialog'});
		RepeatDialog.init({type:'daily',root:'#repeat-dialog'});
		TextDialog.init({root:'#text-dialog'});
		CanvasDialog.init({root:'#canvas-dialog'});
		RecordDialog.init({root:'#Record-dialog'});
   }
	
};
	$(function() {
		T.init();
	});