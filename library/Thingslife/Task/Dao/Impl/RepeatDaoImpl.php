<?php
require_once 'Thingslife/Task/Dao/IRepeatDao.php';
require_once 'Thingslife/Task/Dao/Impl/TaskBaseDao.php';

class RepeatDaoImpl extends TaskBaseDao implements IRepeatDao {
    protected $table = 'task_repeat';

    public function updateByTaskId (array $fields, $taskId) {
        return $this->queryHelper()->update($this->table, $fields, 'taskId=?', array(
            $taskId
        ));
    }

    public function loadByTaskId ($taskId) {
        return $this->queryHelper()->load($this->table, null, 'taskId=?', array(
            $taskId
        ));
    }
}