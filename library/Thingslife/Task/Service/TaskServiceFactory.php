<?php
require_once 'Thingslife/Common/BaseFactory.php';

class TaskServiceFactory extends BaseFactory {
    
    const SCOPE = 'TaskService';
    
    private static $instance;

    /**
     * @return TaskServiceFactory
     */
    public static function getInstance () {
        if (! self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * @return ITaskService
     */
    public function createTaskService () {
        return $this->container->createObjectInstance(self::SCOPE, 'TaskServiceImpl', 'Thingslife/Task/Service/Impl/TaskServiceImpl.php');
    }
}

