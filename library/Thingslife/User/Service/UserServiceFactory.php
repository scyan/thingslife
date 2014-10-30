<?php
require_once 'Thingslife/Common/BaseFactory.php';

class UserServiceFactory extends BaseFactory {
    
    const SCOPE = 'UserService';
    
    private static $instance;

    /**
     * @return UserServiceFactory
     */
    public static function getInstance () {
        if (! self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * @return IUserService
     */
    public function createUserService () {
        return $this->container->createObjectInstance(self::SCOPE, 'UserServiceImpl', 'Thingslife/User/Service/Impl/UserServiceImpl.php');
    }

    /**
     * @return ILoginService
     */
    public function createLoginService () {
        return $this->container->createObjectInstance(self::SCOPE, 'LoginServiceImpl', 'Thingslife/User/Service/Impl/LoginServiceImpl.php');
    }
   /**
     * @return IMessageService
     */
    public function createMessageService () {
        return $this->container->createObjectInstance(self::SCOPE, 'MessageServiceImpl', 'Thingslife/User/Service/Impl/MessageServiceImpl.php');
    }
}

