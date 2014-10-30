<?php
require_once 'Thingslife/Common/BaseFactory.php';

class TaskDaoFactory extends BaseFactory {
    
    const SCOPE = 'TaskDao';
    
    private static $instance;

    /**
     * @return TaskDaoFactory
     */
    public static function getInstance () {
        if (! self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * @return ITaskDao
     */
    public function createTaskDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'TaskDaoImpl', 'Thingslife/Task/Dao/Impl/TaskDaoImpl.php');
    }

    /**
     * @return ICommentsDao
     */
    public function createCommentsDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'CommentsDaoImpl', 'Thingslife/Task/Dao/Impl/CommentsDaoImpl.php');
    }

    public function createRepeatDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'RepeatDaoImpl', 'Thingslife/Task/Dao/Impl/RepeatDaoImpl.php');
    }
    
    public function createTagsDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'TagsDaoImpl', 'Thingslife/Task/Dao/Impl/TagsDaoImpl.php');
    }
    public function createSoundDao () {
        return $this->container->createObjectInstance(self::SCOPE, 'SoundDaoImpl', 'Thingslife/Task/Dao/Impl/SoundDaoImpl.php');
    }
}

