
/**
 * 
 * 使用
 * SidebarPanel.init({type : "me", root : "#sidebar"});
 * 
 */
var SidebarPanel = {
	settings : {
		type : "me",
		/**
		 * sidebar的最外层容器,比如：<div id="sidebar"></div>
		 */
		root : null
	},

	/**
	 * @access public
	 */
	init : function(options) {
		$.extend(this.settings, options);

		switch (this.settings.type) {
		case "me":

			$root = $(this.settings.root);

			this.initCollectBundle($root);
			this.initWorkflowBundle($root);
			this.initProjectsBundle($root);
			this.initAreasBundle($root);
			this.initArchiveBundle($root);
			break;
		case "our":
			break;
		default:
			break;
		}
	},

	/**
	 * @access private
	 */
	initCollectBundle : function($root) {
		/**
		 * 收集
		 */

		var html = '';
		html += '<ul><li>收集箱</li></ul>';
		$root.append(html);
		// 取收集箱未完成的任务的数量，并在界面上显示。

	},

	/**
	 * @access private
	 */
	initWorkflowBundle : function($root) {
		/**
		 * 今日、下一步、日程、择日、项目
		 */

	},

	/**
	 * @access private
	 */
	initProjectsBundle : function($root) {
		/**
		 * 活动的项目
		 */
	},

	/**
	 * @access private
	 */
	initAreasBundle : function($root) {
		/**
		 * 区域，暂时不考虑
		 */

	},

	/**
	 * @access private
	 */
	initArchiveBundle : function($root) {
		/**
		 * 归档 跟 垃圾箱
		 */

	}
};

var Toolbar = {

};

var TopPanel = {

}

var MainPanel = {

}

/**
 * 封装Task的业务逻辑
 * 
 * var testRawTask = {id: 1, name: "task_1"};
 * 
 * var task1 = new Task(rawTask);
 * 
 * alert(task1.id);
 * alert(task1.name);
 * 
 * task1.isToday();
 * 
 * @param rawTask
 *            从数据库中来的原始的task对象
 * @returns {Task}
 */
function Task(rawTask) {
	$.extend(this, rawTask);

	if (typeof Task._initialized == 'undefined') {
		Task.prototype.isToday = function() {

		};

		Task.prototype.isNext = function() {

		};

	}
	Task._initialized = true;
}

/**
 * 封装Task的界面逻辑
 * 
 * new TaskUI(task).render();
 * 
 * @param task
 *            Task对象
 * @param focus
 *            当前是在哪个focus: today, next, someday...
 * @returns {TaskUI}
 */
function TaskUI(task, focus) {
	this.task = task;
	this.focus = focus;

	if (typeof Task._initialized == 'undefined') {
		TaskUI.prototype.render = function() {

		};
	}
	Task._initialized = true;
}