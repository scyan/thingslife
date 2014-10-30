<?php
require_once 'Thingslife/Common/BaseFactory.php';

class UserDaoFactory extends BaseFactory {
    
    const SCOPE = 'UserDao';
    
    private static $instance;

    /**
     * @return UserDaoFactory
     */
    public static function getInstance () {
        if (! self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * @return IUserDao
     */
    public function createUserDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'UserDaoImpl', 'Thingslife/User/Dao/Impl/UserDaoImpl.php');
    }

    /**
     * @return ISessionDao
     */
    public function createSessionDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'SessionDaoImpl', 'Thingslife/User/Dao/Impl/SessionDaoImpl.php');
    }

    /**
     * @return IPersistentLoginDao
     */
    public function createPersistentLoginDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'PersistentLoginDaoImpl', 'Thingslife/User/Dao/Impl/PersistentLoginDaoImpl.php');
    }

    /**
     * @return IMessageDao
     */
    public function createMessageDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'MessageDaoImpl', 'Thingslife/User/Dao/Impl/MessageDaoImpl.php');
    }
}

