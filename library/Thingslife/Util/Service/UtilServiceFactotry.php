<?php
require_once 'Thingslife/Common/BaseFactory.php';

class UtilServiceFactory extends BaseFactory {
    
    const SCOPE = 'UtilService';
    
    private static $instance;

    /**
     * @return UtilServiceFactory
     */
    public static function getInstance () {
        if (! self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    
    /**
     * @return IUtilService
     */
    public function createUtilService () {
        return $this->container->createObjectInstance(self::SCOPE, 'UtilServiceImpl', 'Yueheng/Util/Service/Impl/UtilServiceImpl.php');
    }

    
    /**
     * @return ISettingService
     */
    public function createSettingService () {
        return $this->container->createObjectInstance(self::SCOPE, 'SettingServiceImpl', 'Yueheng/Util/Service/Impl/SettingServiceImpl.php');
    }

}

