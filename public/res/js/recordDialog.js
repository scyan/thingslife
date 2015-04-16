var RecordDialog={
		settings:{
			root:null
			
		},
		init: function(options){
			  $.extend(this.settings,options);
			  var $root=$(this.settings.root);
			  this.initCall();
			  this.initRecord($root);
			  this.initActions();
			 // this.initActions();
			  $root.dialog( {
		  			width : 500,
		  			height : 300,
		  		
		  			autoOpen : false,
		  			buttons:{
		  				'关闭':function(){
				  $root.dialog('close');
		  				}
		  			
		  			}
		  		});
		},
		
		initRecord : function($root){
			$root.html(
			'<div id="flashContent"></div>'

			);
		},
		initCall :function(){
			var InternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
			function TestRecorder_DoFSCommand(command, args){
			  //var myFlashObj = InternetExplorer ? TestRecorder : document.TestRecorder;
			  //console.log(args);
			 alert (args);
			}
			if (navigator.appName && navigator.appName.indexOf("Microsoft") != -1 && 
			  navigator.userAgent.indexOf("Windows") != -1 && navigator.userAgent.indexOf("Windows 3.1") == -1) {
			  document.write('<SCRIPT LANGUAGE=VBScript\> \n');
			  document.write('on error resume next \n');
			  document.write('Sub myFlash_FSCommand(ByVal command, ByVal args)\n');
			  document.write(' call myFlash_DoFSCommand(command, args)\n');
			  document.write('end sub\n');
			  document.write('</SCRIPT\> \n');
			} 
		},
		initActions:function(){

			   var swfVersionStr = "10.0.0";
	            var xiSwfUrlStr = "playerProductInstall.swf";
	            var flashvars = {};
	            var params = {};
	            params.quality = "high";
	            params.bgcolor = "#ffffff";
	           // params.allowscriptaccess = "sameDomain";
	            params.allowfullscreen = "true";
	            params.swLiveConnect="true";
	            params.allowScriptAccess="always";
	            params.swliveconnect="true";
	            var attributes = {};
	            attributes.id = "TestRecorder";
	            attributes.name = "TestRecorder";
	            attributes.align = "middle";
	            swfobject.embedSWF(
	                "/res/swf/TestRecorder.swf", "flashContent", 
	                "320", "200", 
	                swfVersionStr, xiSwfUrlStr, 
	                flashvars, params, attributes);
				swfobject.createCSS("#flashContent", "display:block;text-align:left;");
		},
		  open: function(){
		  
					$(this.settings.root).dialog('open');
		  }
};