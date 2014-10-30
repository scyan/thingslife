<?php

require_once 'Thingslife/User/Service/UserServiceFactory.php';

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap {

    public function _initService () {
        $this->bootstrap('FrontController');
        $front = $this->getResource('FrontController');
        
        date_default_timezone_set('Asia/Shanghai');
        
        require_once 'Juzi/Util/ConfigLoader.php';
        require_once 'Juzi/Dao/ConnectionFactory.php';
        require_once 'Thingslife/Common/Context.php';
        
        $config = array(
            'env' => APPLICATION_ENV , 
            'config.dir' => dirname(__FILE__) . '/configs'
        );
        $context = Context::createInstance($config);
        $connFactory = ConnectionFactory::getInstance()->setConfig($context->loadConfig('databases'));
        
        require_once 'Thingslife/Common/BaseService.php';
        BaseService::setContext($context);
        $front->setParam('context', $context);
    }

    public function _initContextUser () {
        $this->bootstrap('service');
        
        require_once 'Thingslife/User/Util/DefaultSessionSaveHandler.php';
        $sessionHandler = new DefaultSessionSaveHandler();
        session_set_save_handler(array(
            &$sessionHandler , 
            'open'
        ), array(
            &$sessionHandler , 
            'close'
        ), array(
            &$sessionHandler , 
            'read'
        ), array(
            &$sessionHandler , 
            'write'
        ), array(
            &$sessionHandler , 
            'destroy'
        ), array(
            &$sessionHandler , 
            'gc'
        ));
        unset($sessionHandler);
        
        session_name('_VSID');
        session_start();
        
        $loginService = UserServiceFactory::getInstance()->createLoginService();
        $user = $loginService->initialize();
        
        $front = $this->getResource('FrontController');
        
        $context = $front->getParam('context');
        $context->setUser($user);
    }
}
