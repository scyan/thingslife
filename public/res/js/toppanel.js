
var TopPanel = {
	
	settings : {
	  type : "me",
	    /**
	    * top-panel的最外层容器,比如：<div id="top-panel"></div>
	    */
	   root : null
     },
     init : function(options){
       $.extend(this.settings,options);
       $root = $(this.settings.root);
       this.initTopLinks($root,this.settings.type);
     },
     /**
 	 * @access private
 	 */
     initTopLinks : function($root,$type){
    	 var selectMe=($type=='me')?'selected="selected"':'';
    	 var selectUs=($type=='us')?'selected="selected"':'';
    	 var html='<div class="top-links">'+
                     '<span class="login-info">您好，<a href="#" class="user-nick"></a></span>'+
                     '<span class="pipe">|</span>'+
                     
                     '<select name="showMode" id="showMode">'+
                       '<option value="me"'+selectMe+'>我的任务</option>'+
                       '<option value="us"'+selectUs+'>大家的任务</option>'+
                     '</select>'+
                     
                     '<span class="pipe">|</span>'+
                     '<a href="#" class="message">消息<span id="message-counter"></span></a>'+
                     '<span class="pipe">|</span>'+
                     
                     '<a href="#" class="signout">退出</a>'+
                  '</div>';
        $root.append(html);
        
       $.getJSON('/api/tasks/getuserinfo',{},function(data){
          $('.user-nick').html(data.userName);
          $('#message-counter').html(data.unreadMessages);
        });
       
        $('#showMode').change(function(){
   		   if($(this).val()=='us'){
   			 location.href="/us/";
   		   }else{
   			 location.href="/me/";
   		   }
   	    });
        
        $('.message').click(function(){
        	TextDialog.open({type:'message'});
        });
        
        $('.signout').click(function(){
        	location.href="/auth/logout";
        });
     
     }
};