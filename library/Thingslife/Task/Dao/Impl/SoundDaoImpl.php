<?php
require_once 'Thingslife/Task/Dao/ISoundDao.php';
require_once 'Thingslife/Task/Dao/Impl/TaskBaseDao.php';

class SoundDaoImpl extends TaskBaseDao implements ISoundDao {
    protected $table = 'sound';
   public function deleteByTaskId($taskId){
      return $this->queryHelper()->delete($this->table, 'taskId=?', array($taskId));
    }
}