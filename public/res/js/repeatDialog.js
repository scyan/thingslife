var RepeatDialog=function(){
	var isOpen=false;
	var $root=$('<div  class="dialog hidden" style="display:none"></div>');
    var _this={};
    _this.render=function(){
  /*  	if(editDialog.isOpen()){
    		_this.repeat=editDialog.task().repeat;
    	}else if(newDialog.isOpen){
    		_this.repeat=newDialog.task().repeat;
    	}*/
    	$root.html(template(Templates.repeatDialog(),_this.repeat));
		$root.dialog( {
			modal : true,
	  		width : 500,
			buttons:{
				'确定':_this.submit,
				'取消':_this.close,
			},
			close:_this.close
		});
    };
    _this.submit=function(){
    	var queryData=formToJson($('#repeat_form'));
    	_this.repeat.set(queryData);
    	if(editDialog.isOpen()){
    		editDialog.changeRepeat();
    	}else if(newDialog.isOpen){
    		newDialog.changeRepeat();
    	}
    	$root.remove();
		isOpen=false;
    };
    _this.close=function(){
    	$root.remove();
		isOpen=false;
    };
    return {
    	open:function(repeat){
    		if(isOpen){
				return;
			}
    		_this.repeat=repeat;
			isOpen=true;
    		_this.render();
    	}
    };
}();
