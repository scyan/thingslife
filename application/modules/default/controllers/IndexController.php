<?php

require_once dirname(__FILE__) . '/BaseController.php';

class IndexController extends Default_BaseController {

    public function init () {
        parent::init();
    }

    public function indexAction () {
        $this->_redirect($this->_helper->url('', 'me', 'default'));
    }

/*     private function getTaskService () {
        require_once 'Thingslife/Task/Service/TaskServiceFactory.php';
        return TaskServiceFactory::getInstance()->createTaskService();
    } */
}