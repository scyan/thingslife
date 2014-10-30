<?php
require_once dirname(__FILE__) . '/BaseController.php';

class SignupController extends Default_BaseController {

    public function init () {

    }

    public function preDispatch () {
        $this->_helper->layout()->disableLayout();
    }

    public function indexAction () {
        $contextUser = $this->getUser();
        if ($contextUser->isLogin() == true) {
            $this->_redirect('/');
        }
        
        if ($this->getRequest()->isPost()) {
            $this->signup();
            return;
        }
        
        $this->view->go = $this->getJumpUrl();
    
    }
 
    private function signup () {
        $username = $this->getRequest()->getPost('username');
        $password = $this->getRequest()->getPost('password');
        
        require_once 'Thingslife/Util/Validator.php';
        if (Validator::username($username) == false) {
            return $this->showMessage('用户名不正确');
        }
        if ($this->getUserService()->isUsernameAvailable($username) == false) {
            return $this->showMessage('该用户名已经存在');
        }
        if (Validator::password($password) == false) {
            return $this->showMessage('密码含有非法字符');
        }
        
        $fields = array();
        $fields['username'] = $username;
        $fields['password'] = $password;
        $fields['email'] = strtolower($this->getRequest()->getPost('email', ''));
        
        $newuser = $this->getUserService()->registerUser($fields);
        $this->getLoginService()->login($username, $password, false);
        $this->_redirect('/');
        /*      require_once 'Thingslife/Util/Filter.php';
        $this->view->go = $go = Filter::jumpUrl($this->getRequest()->getPost('go', ''));*/
        return true;
        
    //        return $this->showMessage('注册成功!正在为您跳转页面!', $go);
    }
    
    private function getLoginService () {
        return UserServiceFactory::getInstance()->createLoginService();
    }
}