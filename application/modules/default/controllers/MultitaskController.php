<?php

require_once dirname(__FILE__) . '/BaseController.php';

class MultitaskController extends Default_BaseController {

    public function init () {
        parent::init();
        $users = $this->getUserService()->listUsers(0, 100);
        $this->view->users = $users;
        $this->view->tab = 'our';
    }

    public function indexAction () {

    }
}