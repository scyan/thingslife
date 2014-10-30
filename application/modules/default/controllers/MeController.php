<?php

require_once dirname(__FILE__) . '/BaseController.php';

class MeController extends Default_BaseController {

    public function init () {
        parent::init();
        $this->view->mode='me';
        $this->_helper->layout()->setLayout('layout3');
    }

    public function indexAction () {
    	
    }

    private function getTaskService () {
        require_once 'Thingslife/Task/Service/TaskServiceFactory.php';
        return TaskServiceFactory::getInstance()->createTaskService();
    }
}