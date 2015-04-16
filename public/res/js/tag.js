function TagClass(obj){
	var settings = {
			name:null,
			img:null,
			path:null,
			edit_tag: false
		};
	$.extend(this,settings,obj);
	if (typeof TagClass._initialized == 'undefined') {
		TagClass.prototype.set=function(obj){
			$.extend(this,obj);
			this.edit_tag=true;
		};
		TagClass.prototype.get=function(){
			var obj={};
			for(var name in this){
				if(typeof name!=='function'&&this.hasOwnProperty(name)){
					obj[name]=this[name];
				}
			}
			return obj;
		};
		TagClass._initialized=true;
	}
}