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
function isArray(v){
	if(typeof v=='object'&&v.constructor==Array){
		return true;
	}
	return false;
}
function formToJson($form){
	var json={};
	$('[name]',$form).each(function(i,item){
		if($(item).attr('type')=='checkbox'){
			if(!json[$(item).attr('name')]){
				json[$(item).attr('name')]=[];
			}
			if($(item).attr('checked')=='checked'){
				json[$(item).attr('name')].push($(item).val());
			}
		}else{
			json[$(item).attr('name')]=$(item).val();
		}
	});
	$.each(json,function(i,item){
		if( typeof item=='object'&&item.constructor==Array){
			json[i]=item.join(',');
		}
	});
	return json;
}
function queryToJson(str){
	var json={};
	var qList=str.split('&');
	for(var i=0;i<qList.length;i++){
		var item=qList[i].split('=');
		var key=item[0];
		var value=item[1];
		if(!json[key]){
			json[key]=value;
		}else{
			if(isArray(json[key])){
				json[key].push(value);
			}else{
				var tempValue=json[key];
				json[key]=[];
				json[key].push(tempValue);
				json[key].push(value);
			}
		}
	}
	return json;
}

String.prototype.toJson=function(){
	return eval('('+this+')');
};
Array.prototype.find=function(t){
	for(var i=0;i<this.length;i++){
		if(this[i]==t){
			return i;
		}
	}
	return -1;
};
var Dispacher={
		connect : function(event,fun){
			$("body").bind(event,fun);
		},
        notify : function(event,args){
        	$("body").trigger(event,args);
        }
};
String.prototype.trim=function(){
	return this.replace(/^\s+|\s$/g,'');
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

var FocusField=function(){
	var settings={
		focusField:'today',
	};
	Dispacher.connect('changeField',function(e,data){
		if(!data.focusField){
			return;
		}
		$.extend(settings,data);
	});
	return {
		get:function(){
			return settings;
		}
	};
}();
var Repeat={
	settings : {
	  type : 'daily',
	  frequency : 1,
	  days : '',
	  daysArr:[],
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
		this.settings.daysArr=$days.sort();
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
    return clone($('[node-type=taskItem].selected').data('task'));
}

/* jshint ignore:start */
// Blows up jshint errors based on the new Function constructor
//Templating methods
//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
function template(templateString, valuesObject){
	 // If templateString is function rather than string-template - call the function for valuesObject
	if(templateString instanceof Function){
	 	return templateString(valuesObject);
 	}

	var cache = {};
	function tmpl(str, data){
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
		cache[str] = cache[str] :
		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +

			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +

			// Convert the template into pure JavaScript
			str
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'") +
			"');}return p.join('');"
		);
		// Provide some basic currying to the user
		return data ? fn( data ) : fn;
	}
	return tmpl(templateString,valuesObject);
}

$.fn.extend({
	checkform:function(options) {
		if($(this).data('checkform')){
			var checkObj=$(this).data('checkform');
		}else{
			var checkObj=new CheckForm($(this));
			$(this).data('checkform',checkObj);
		}
		checkObj.valid=true;
		$(this).find('input').each(function(){
			var name=$(this).attr('name');
			var tipNode=$('[tip-for='+name+']');
			var check_data=$(this).attr('check-data');
			if(!check_data){
				return;
			}
			check_data=check_data.split('&');
			var funs=check_data[0].split('|');
			var msgs=check_data[1].split('|');
			
			for(var i=0;i<funs.length;i++){
				var fun=funs[i];
				if(typeof checkObj[fun]=='function'){
					var value=$(this).val();
					if(!checkObj[fun](value)){
						tipNode.html(msgs[i]).show();
						checkObj.valid=false;
						return false;
					}
				}
				
			}
		});
		return checkObj;
	}
});
var CheckForm=function ($root){
	$root.find('input').each(function(){
		var name=$(this).attr('name');
		var tipNode=$('[tip-for='+name+']');
		$(this).focusin(function(){
			tipNode.hide();
		});
	});
	this.valid=true;
	this.notEmpty=function(val){
		var value=val.trim();
		return !(value=='');
	};
};

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
		var hash=window.location.hash;
		hash=hash.substring(1);
		var data=null;
		if(hash){
			 data=queryToJson(hash);
		}
		if(!data){
			data=FocusField.get();
		}
		Dispacher.notify('changeField',data);
   }
	
};
	$(function() {
		T.init();
	});