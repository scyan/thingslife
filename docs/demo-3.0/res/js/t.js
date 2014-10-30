var SidebarPanel = {
	settings : {
		type : "focus"
	},

	/**
	 * @access public
	 */
	bootstrap : function(config) {
		$.extend(this.settings, config);

		switch (this.settings.type) {
		case "focus":
			$(window).resize(this.resizeFocusPanel);

			this.initCollectBundle();
			this.initWorkflowBundle();
			this.initProjectsBundle();
			this.initAreasBundle();
			this.initArchiveBundle();

			break;
		default:
			break;
		}

		$(".project-info textarea").autogrow({
			expandTolerance : 0
		});

	},

	/**
	 * @access private
	 */
	initCollectBundle : function() {

	},

	/**
	 * @access private
	 */
	initWorkflowBundle : function() {

	},

	/**
	 * @access private
	 */
	initProjectsBundle : function() {
		$(".projects-bundle h3").click(function() {
			if ($(this).hasClass("opened")) {
				$(this).removeClass("opened").addClass("closed").parent().find("ul").hide();
			} else {
				$(this).removeClass("closed").addClass("opened").parent().find("ul").show();
			}
			SidebarPanel.resizeFocusPanel();
		});

	},

	/**
	 * @access private
	 */
	initAreasBundle : function() {

	},

	/**
	 * @access private
	 */
	initArchiveBundle : function() {

	},

	/**
	 * @access private
	 */
	resizeFocusPanel : function() {
		var height = 0;
		$(".focus-bundle").each(function(i) {
			height += $(this).outerHeight(true);
		});

		height -= $(".focus-bundle:last").outerHeight(true) - $(".focus-bundle:last").outerHeight();

		var panelHeight = $("#focus-panel").height();

		var marginTop = panelHeight - height < 10 ? 10 : panelHeight - height + 20;
		$(".focus-bundle:last").css("margin-top", marginTop);
	},

	showProjectsBundle : function() {
		$(".projects-bundle").show();
	},
	hideProjectsBundle : function() {
		$(".projects-bundle").hide();
	},
	addProject : function(project) {

	},
	removeProject : function(project) {

	}
};

var Toolbar = {
	bootstrap : function() {
		$(window).resize(this.resizeToolbar);
	},
	
	resizeToolbar : function() {
		var position = {};
		position.left = $("#toolbar").find(".leftbar").position().left + $("#toolbar").find(".leftbar").outerWidth(true);
		position.right = $("#toolbar").innerWidth() - $("#toolbar").find(".rightbar").position().left;
		$("#toolbar").find(".centerbar").css(position);
	}
	
};

var TopPanel = {

}

var MainPanel = {

}

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

function TaskUI(task, focus) {
	this.task = task;
	this.focus = focus;

	if (typeof Task._initialized == 'undefined') {
		TaskUI.prototype.render = function() {

		};
	}
	Task._initialized = true;
}