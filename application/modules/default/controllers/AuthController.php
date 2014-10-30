<?php
require_once dirname(__FILE__) . '/BaseController.php';

class AuthController extends Default_BaseController {

    public function init () {

    }

    public function preDispatch () {
        $this->_helper->layout()->disableLayout();
    }

    public function loginAction () {
        if ($this->getUser()->isLogin()) {
            $this->_redirect('/');
        }
        
        $this->view->username = '';
        $this->view->rememberMe = false;
        $this->view->errorMessage = '';
        
        if ($this->getRequest()->isPost()) {
            $login = $this->_processLogin();
            if ($login) {
                $this->_redirect($this->_helper->url('', 'me', 'default'));
                exit();
            }
        }
    }

    private function _processLogin () {
        $username = trim($this->getRequest()->getPost('username'));
        $password = trim($this->getRequest()->getPost('password'));
        $rememberMe = $this->getRequest()->getPost('rememberMe', 'false') == 'true' ? true : false;
        $rememberMe = true;        
        if (empty($username) || empty($password)) {
            echo '用户名或者密码错误！';
            //$this->view->errorMessage = '用户名或者密码错误！';
            return;
        }
        
        require_once 'Thingslife/Util/Validator.php';
        if (Validator::email($username)) {
            $user = $this->getUserService()->loadByEmail($username);
        } else {
            $user = $this->getUserService()->loadByUsername($username);
        }
        
        if (empty($user)) {
            echo '帐户名不存在!';
            return false;
            /*            $this->view->username = $username;
            $this->view->rememberMe = $rememberMe;
            $this->view->errorMessage = '帐户名不存在!';*/
            return false;
        }
        
        if ($this->getUserService()->checkPassword($user, $password) == false) {
            echo '密码错误';
            /*            $this->view->username = $username;
            $this->view->rememberMe = $rememberMe;
            $this->view->errorMessage = '密码错误！';*/
            return false;
        }
        
        $contextUser = $this->getLoginService()->login($user['username'], $password, $rememberMe);
        
        require_once 'Thingslife/Util/Filter.php';
        $go = Filter::jumpUrl($this->getRequest()->getPost('go', ''));
        $this->view->goUrl = $go;
        return true;
    }

    public function logoutAction () {
        $this->getLoginService()->logout();
        return $this->_redirect('/');
    }

    public function getLoginService () {
        require_once 'Thingslife/User/Service/UserServiceFactory.php';
        return UserServiceFactory::getInstance()->createLoginService();
    }
}
