<?php

require_once dirname(__FILE__) . '/BaseController.php';

class ProviderController extends Default_BaseController {
    public function init () {
    }
    public function preDispatch () {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
    }

    public function checkusernameAction () {
        $username = $this->getRequest()->getQuery('username', '');
        if (empty($username)) {
            echo 'false';
        }
        echo $this->getUserService()->isUsernameAvailable($username) == true ? 'true' : 'false';
    }
    
     public function checkemailAction () {
        $email = $this->_request->getQuery('email', '');
        if (empty($email)) {
            echo 'false';
        }
        echo $this->getUserService()->isEmailAvailable($email) == true ? 'true' : 'false';
    }
    
}
