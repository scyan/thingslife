<?php

require_once dirname(__FILE__) . '/BaseController.php';
class Api_ScriptsController  extends Api_BaseController {
    public function createtaskAction(){
    	if($_SERVER["REMOTE_ADDR"]!='127.0.0.1'){
    		return;
    	}
    	$this->_helper->layout()->disableLayout();
    	$this->_helper->viewRenderer->setNoRender(true);
    	$this->getTaskService()->createTaskFromRepeat();
    }
    public function movetotodayAction(){
    	if($_SERVER["REMOTE_ADDR"]!='127.0.0.1'){
    		return;
    	}
    	$this->_helper->layout()->disableLayout();
    	$this->_helper->viewRenderer->setNoRender(true);
    	$this->getTaskService()->moveToToday();
    }
}
