var toppanel=function(){
	var _this={
			initActions:function(){
				$('.signout').click(function(){
		        	location.href="/auth/logout";
		        });
				 $('.message').click(function(){
			        	TextDialog.open({type:'message'});
			        });
			}
	};
	return {
		init:function(){
			_this.initActions();
		}
	};
}();
toppanel.init();