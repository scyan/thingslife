var Templates={
	
	newDialog:function(){
		return Templates.title()+Templates.box()+Templates.note()+Templates.tag()+Templates.repeat()+Templates.due();
	},
	editDialog:function(){
		return Templates.title()+Templates.box()+Templates.note()+Templates.tag()+Templates.repeat('edit')+Templates.due();
			//return this.title()+this.box()+this.note()+this.tag()+this.repeat()+this.due();
	},
	/*new/edit dialog*/
	title:function(){
		return '<div class="row">'+
		'<label for="title-field">任务</label> <input type="text"  id="title-field" name="title" value="<%=obj.title%>" node-type="check" check-data="notEmpty&请输入标题"/><span tip-for="title" class="error_tip"></span>'+
		'</div>';
	},
	box:function(){
		return 	'<%if(!obj.isTemplate()&&obj.type!="repeat"){%><div id="belongto" class="row">'+
		'<label for="focus-field">放入</label>'+
		'<select id="focus-field" name="focusField">'+
		'<%if(obj.focusField!="inproject"){%>'+
			'<option <%if(obj.isInbox()){%> selected="selected" <%}%> value="inbox">收集箱</option>'+
		'<%}%>'+
		'<option <% if(obj.isToday()) {%>selected="selected"<%}%> value="today">今日待办</option>'+
		'<option <%if(obj.isNext()){%> selected="selected" <%}%> value="next">下一步行动</option>'+
		'<option <%if(obj.isSchedule()){%> selected="selected" <%}%> value="schedule">日程</option>'+
		'<option <%if(obj.isSomeday()){%> selected="selected" <%}%> value="someday">择日待办</option>'+
		'</select> '+
		'<%if(obj.isSchedule()){%>'+
		Templates.exeDate()+
		'<%}%>'+
		'</div><%}%>';
	},
	exeDate:function(){
		return '<input id="date-field" name="exeDate" type="text" readonly="readonly" value="<%=obj.exeDate%>" ></input>';
	}
	,
	note:function(){
		return '<div class="row">'+
		'<label for="note-field">备注</label>'+
		'<textarea id="note-field" name="note"><%=obj.note%></textarea>'+
		'</div>';
	},
	
	tag:function(){
		return '<div class="row">'+
		'<label for="tag-field">标签</label>'+
		'<a class="edit-dialog-icons set-tag" href="javascript:void(0);" id="setTag"></a>'+
		'<span class=" tag-bar " id="tag-info">'+
		'<%if(obj.hasTag()){%>'+
		this.tag_info()+
		'<%}%>'+
		'</span>'+
		'</div>';
	},
	tag_info:function(){
		return '<img width="30" height="20" id="tag-field" src="<%=obj.tagObj.path%>"/>'+
		'<a class=" clear-tag" href="javascript:void(0);"id="clear-tag"></a>';
	},
	repeat:function(type){
		if(type=='edit'){
			return '<%if(obj.isTemplate()){%><div class="row">'+
			'<label>重复</label>'+
			'<p>'+
			'<a href="javascript:void(0);" id="setRepeat">设置</a>'+
			'<span id="repeat-info">'+
			'<%if(obj.isRepeat()){%>'+
			this.repeat_info()+
			'<%}%>'+
			'</span>'+
			'</p>'+
			'</div><%}%>';
		}else{
			return '<div class="row">'+
			'<label>重复</label>'+
			'<p>'+
			'<a href="javascript:void(0);" id="setRepeat">设置</a>'+
			'<span id="repeat-info">'+
			'<%if(obj.isRepeat()){%>'+
			this.repeat_info()+
			'<%}%>'+
			'</span>'+
			'</p>'+
			'</div>';
		}
	},
	repeat_info:function(){
		return  '<%if(!obj.repeat.empty){%><span>每<%=obj.repeat.frequency+obj.repeat.typeName%>：</span>'+
		'<%=obj.repeat.daysArr.join("，")%><%}%>';
	},
	due:function(){
		return '<%if(obj.repeatId<=0||!obj.repeatId){%><div class="row">'+
		'<label for="due-date-field">过期时间</label> '+
	//	'<a class="edit-dialog-icons due-date" href="javascript:void(0)" id="due-date" name="dueDate"></a> '+
		'<input id="due-date-field" name="dueDate" <%if(obj.hasDueDate()){%>value="<%=obj.dueDate.substr(0,10)%>"<%}%>/>'+
		'<a class=" clear-tag " href="javascript:void(0);"action-type="clear-dueDate"></a>'+
/*		'<span class=" dueDate-bar ">'+
		'<%if(obj.hasDueDate()){%>'+
		this.due_info()+
		'<%}%>'+
		'</span>'+*/
		'</div><%}%>';
	},
	due_info:function(){
		return 	'<span id="dueDate-info"><%=obj.dueDate.substr()%></span>'+
		'<a class=" clear-tag " href="javascript:void(0);" action-type="clear-dueDate"> </a>';
	},
	/*------end---new/edit dialog*/
	repeatDialog:function(){
		return '<div id="repeat_form">' + 
	    		'<p><b>重复方式:</b></p>' + 
	    			'<select name="type" id="repeat-type">' + 
	    				//  '<option <%if(obj.type=="daily"){%>selected="selected "<%}%> value="daily">按日</option>'+ 
	    				'<option <%if(obj.type=="weekly"){%>selected="selected "<%}%> value="weekly">按周</option>' + 
	    					//  '<option <%if(obj.type=="monthly"){%>selected="selected "<%}%> value="monthly">按月</option>' + 
	    				//  '<option <%if(obj.type=="yearly"){%>selected="selected "<%}%> value="yearly">按年</option>' + 
	    			'</select>' + 
	    			'<div id="repeat-detail"></div>' + 
	    		//	'<p>重复频率：每<input name="frequency" id="frequency" type="text" size="3" value="1"></input>周</p>' + 
	    			'<div id="repeat-days">重复日'+
	    				'<%for(var i=0;i<obj.daysMap.length;i++){%>'+
	    				'<input name="days" type="checkbox" <%if(obj.daysMap[i].checked){%>checked="checked"<%}%> id="weekday-<%=i+1%>"value="<%=i+1%>"/><%=obj.daysMap[i].name%>&nbsp;'+
	    				'<%}%>'+
	    				'</div>'+
	    				'</div>';
	},
	canvasDialog:function(){
		return '<div class="color_box">'+
        		'<ul class="color">'+
        		'<li class="red">红色</li>'+
        		'<li class="orange">橙色</li>'+
        		'<li class="yellow">黄色</li>'+
        		'<li class="green">绿色</li>'+
        		'<li class="scyan">青色</li>'+
        		'<li class="blue">蓝色</li>'+
        		'<li class="purple">紫色</li>'+
        		'</ul>'+
        		'</div>'+
        		'<canvas id="myCanvas" width="400" height="200" style="background:#FFF">'+'</canvas>';
	},
	sidebar:function(){
		return this.collectBundle();
	},
	/*---start---sidebar*/
	collectBundle:function(){//收集箱
		return '<div class="focus-bundle collect-bundle">'+
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
	},
	workflowBundle:function(){//今日、下一步、日程、择日、项目
		return '<div class="focus-bundle workflow-bundle">'+
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
	},
	projectsBundle:function(){//项目列表
		return '<div class="focus-bundle projects-bundle ">'+
        	'<h3 class="opened"><span class="icon">+</span><span class="heading"></span></h3>'+
        	'<ul>'+
        	'<%for(var i=0;i<obj.projects.length;i++){%>'+
        		'<li id="focus-inProject-<%=obj.projects[i]["_id"]%>" node-type="droppable" action-data="<%=obj.projects[i]%>"></li>'+
        	'<%}%>'+
        	'</ul>'+
        '</div>';
	},
	usersBundle:function(){
		return '<div class="focus-bundle contact-bundle">'+
        '<h3 class="opened"><span class="icon">+</span><span class="heading">成员</span></h3>'+
        '<ul >'+
          '<li id="user-0"><div class="focus-name member"><a href="#userId=0&page=1" >全部</a></div></li>'+
          '<%for(var i=0;i=obj.users.length;i++){%>'+
          '<li id="user-<%=obj.users[i]["_id"]%>"><div class="focus-name member"><a href="#userId=<%=obj.users[i]["_id"]%>&page=1"><%=obj.users[i]["username"]%></a></div></li>';
          '<%}%>'+
        '</ul>'+
      '</div>';
	},
	archiveBundle:function(){//归档 跟 垃圾箱
		return '<div class="focus-bundle archive-bundle"  style="margin-top: 160px;">'+
        '<ul>'+
        '<li id="focus-archived"><div class="focus-name archive">归档</div></li>'+
        '<li id="focus-deleted"><div class="focus-name trash">垃圾箱</div></li>'+
        '</ul>'+
        '</div>';
	}
};