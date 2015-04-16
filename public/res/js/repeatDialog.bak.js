var RepeatDialog={
	settings:{
	  type : 'daily',
	  post : false,
	  root : null
    },
    init : function(options){
    	$.extend(this.settings,options);
    	$root=$(this.settings.root);
    	this.initRepeatType($root);
    	this.initRepeatDetail($root);
    	
    	$root.dialog( {
  		  modal : true,
  		  width : 500,
  		  autoOpen: false,
          buttons:{
      		'确定':function(){
      		    var days='';
      		    var weekdayArray=new Array();
      		    $.each($(':checkbox','#repeat-days'),function(i,item){
      		    	if($(item).attr("checked")==true){
      		    		weekdayArray.push($(item).attr('id').split('-')[1]);
      		    	}
      		    });
      		    days=weekdayArray.join(',');
      		    Repeat.set({type:$('#repeat-type').val(),frequency:$('#frequency').val(),days:days});
      		    if(RepeatDialog.settings.post==true){
      		    	getCurrentTask().edit({},function(data){});
      		    	RepeatDialog.settings.post=false;
      		    }
      		    $(this).dialog('close');
      	    },
      		'取消':function(){
      		    $(this).dialog('close');
      	    }
      	  }
  		});
    },
    /**
	 * @access private
	 */
    initRepeatType : function ($root){
    	var html = '<div id="repeat_form">' + 
    	              '<p><b>重复方式:</b></p>' + 
    	              '<select id="repeat-type">' + 
    	                '<option value="daily">按日</option>'+ 
    	                '<option value="weekly">按周</option>' + 
    	                '<option value="monthly">按月</option>' + 
    	                '<option value="yearly">按年</option>' + 
    	              '</select>' + 
    	              '<div id="repeat-detail"></div>' + 
    	           '</div>';
        
    	$root.html(html);
    	$('#repeat-type').change(function(){
    		($(this).val()=='weekly')?$('#repeat-detail').show():$('#repeat-detail').hide();
    		//this.initRepeatDetail()
    	});
    },
    /**
	 * @access private
	 */
    initRepeatDetail : function($root){
    	html = '<p>重复频率：每<input id="frequency" type="text" size="3" value="1"></input>周</p>' + 
    	       '<div id="repeat-days">重复日'+
    	          '<input name="weekday" type="checkbox" id="weekday-1"value="1">周一</input>&nbsp;'+
    	          '<input name="weekday" type="checkbox" id="weekday-2"value="2">周二</input>&nbsp;'+
    	          '<input name="weekday" type="checkbox" id="weekday-3"value="3">周三</input>&nbsp;'+
    	          '<input name="weekday" type="checkbox" id="weekday-4"value="4">周四</input>&nbsp;'+
    	          '<input name="weekday" type="checkbox" id="weekday-5"value="5">周五</input>&nbsp;'+
    	          '<input name="weekday" type="checkbox" id="weekday-6"value="6">周六</input>&nbsp;'+
    	          '<input name="weekday" type="checkbox" id="weekday-7"value="7">周日</input>&nbsp;'+
    	       '</div>';
    	$('#repeat-detail').html(html);
    	//($('#repeat-type').val()=='weekly')?$('#repeat-detail').show():$('#repeat-detail').hide();
    },
    /**
	 * @access public
	 */
    open : function (post){
    	this.settings.post=post||false;
    	//this.settings.task_id=task_id||0;
    	$root=$(this.settings.root);
    	var repeat=Repeat.get();
    	RepeatDialog.clear();
    	RepeatDialog.set(repeat.type,repeat.frequency,repeat.days);
        $root.dialog('open');
    },

    /**
	 * @access public
	 * clear dialog
	 */
   clear : function(){
    	$('#repeat-type').val('daily');
    	$('#frequency').val(1);
    	$('#repeat-days checkbox').attr('checked',false);
    	/*for(var x in $('#repeat-days').children()){
			$('#repeat-days :nth-child('+x+')').attr('checked',false);
		}*/
    },
    set : function($type,$frequency,$days){
    	$('#repeat-type').val($type);
    	($type=='weekly')?$('#repeat-detail').show():$('#repeat-detail').hide();
    	$('#frequency').val($frequency);
    	$days=$days.split(',');
    	for ( var i in $days) {
			$('#weekday-' + $days[i]).attr('checked', true);
		}
    }
};
