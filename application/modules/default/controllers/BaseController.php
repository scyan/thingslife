<?php
require_once 'Thingslife/User/Service/UserServiceFactory.php';
require_once APPLICATION_PATH . '/base/BaseController.php';

abstract class Default_BaseController extends BaseController {

    public function init () {
        parent::init();
        $this->checkLogin();
        $this->view->user = $this->getFrontController()->getParam('context')->getUser();
        $this->view->tab = 'me';
        $this->view->countMessage=$this->getMessageService()->countUnRead($this->view->user->id);
    }

 /*   public function preDispatch() {
    	parent::preDispatch();
    	// @todo
    }*/
    
    public function getMessageService () {
        require_once 'Thingslife/User/Service/UserServiceFactory.php';
        return UserServiceFactory::getInstance()->createMessageService();
    }

}