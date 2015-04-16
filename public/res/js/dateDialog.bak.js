var DateDialog = {
	settings : {
		root : null,
		type :null,
		task:null,
		task_id:0,
		toFocusField:'',
		subject :null
	},
	init : function (options){
	 $.extend(this.settings,options);
	 $root=$(this.settings.root);
	 $root.datepicker( {
			dateFormat : 'yy-mm-dd',
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
			dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ]
			//minDate : 1
		});
	 $root.dialog( {
 		modal : true,
 		autoOpen : false
		});
	// this.initButtons($root);
	 this.initActions($root);
    },
    initButtons : function($root){
        var html='<div class="row buttons-row"></div>';
        $('.buttons-row',this.settings.root).remove();
        $root.append(html);
        switch(this.settings.type){
           case 'drag':
        	   $('.buttons-row',this.settings.root).html('<input type="button" id="drag-ensure" value="确定" />'+
                                     '<input type="button" id="drag-cancel" value="取消" />');
        	   break;
           case 'dueDate':
        	   $('.buttons-row',this.settings.root).html('<input type="button" id="dueDate-ensure" value="确定"/>'+
        		                     '<input type="button" id="dueDate-cancel" value="取消"/>');
        	   break;
        	   default:
        		   break;
        }
    },
    initActions : function($root){
    	$('#drag-ensure').live('click',function(){
    		DateDialog.settings.task.edit({
    			focusField:'schedule',
    			exeDate : $root.val()
    		},function(data){
    			Dispacher.notify('task.edit',{task:data.task,task_before:DateDialog.settings.task});
    		});
 			$root.dialog("close");
         });
        
        $('#drag-cancel').live('click',function(){
         	$root.dialog("close");
         });
        
        $('#dueDate-ensure').live('click',function(){
    		$('#dueDate-info').html($root.val());
    		Dispacher.notify('dueDateField.change');
			$root.dialog('close');
        });
        $('#dueDate-cancel').live('click',function(){
        	$root.dialog('close');
        });
    },
    isOpen : function(){
    	return $(this.settings.root).dialog('isOpen');
    },
	openForDrag : function (task,toFocusField){
    	$root=$(this.settings.root);
    	this.settings.task=task;
    	this.settings.toFocusField=toFocusField;
    	this.settings.type='drag';
    	this.initButtons($root);
    	$root.datepicker('option','minDate',1);
    	$root.dialog('open');
    	
    },
    openForDueDate : function(){
    	$root=$(this.settings.root);
    	this.settings.type='dueDate';
    	this.initButtons($root);
    	$.datepicker.setDefaults($.datepicker.regional['']);
    	$root.datepicker('option','minDate','-3m');
    	$root.dialog('open');
    }
};