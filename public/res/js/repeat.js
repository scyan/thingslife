function RepeatClass(obj){
	var settings = {
		  type : 'daily',
		  typeName:'日',
		  frequency : 1,
		  days : '',
		  daysArr:[],
		  edit_repeat : false,
		  empty:true,
	};
	$.extend(this,settings,obj);
	var typeMap={
			'weekly':'周',
			'monthly':'月',
			'yearly':'年',
			'daily':'日',
	};
	var init=function(){
		if(this.days.trim()!=''){
			this.empty=false;
			var $days=this.days.trim().split(',');
			this.daysArr=$days.sort();
		}
	
		this.daysMap=[
		      {name:'星期一',checked:false},
		      {name:'星期二',checked:false},
		      {name:'星期三',checked:false},
		      {name:'星期四',checked:false},
		      {name:'星期五',checked:false},
		      {name:'星期六',checked:false},
		      {name:'星期日',checked:false},
		];
		for(var i=0;i<this.daysArr.length;i++){
			this.daysMap[this.daysArr[i]-1].checked=true;
			this.daysArr[i]=this.daysMap[this.daysArr[i]-1].name;
		}
		this.typeName=typeMap[this.type];
	};
	init.call(this);
	if (typeof RepeatClass._initialized == 'undefined') {
		RepeatClass.prototype.set=function(obj){
			$.extend(this,obj);
			init.call(this);
			if(!this.frequency||!this.days){
				this.empty=true;
				this.edit_repeat=false;
			}else{
				this.empty=false;
				this.edit_repeat=true;
			}
			
		};
		RepeatClass.prototype.get=function(){
			var obj={};
			for(var name in this){
				if(typeof name!=='function'&&this.hasOwnProperty(name)){
					obj[name]=this[name];
				}
			}
			return obj;
		};
		RepeatClass._initialized=true;
	}
};
