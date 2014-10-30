<?php
require_once 'Thingslife/Task/Dao/ITagsDao.php';
require_once 'Thingslife/Task/Dao/Impl/TaskBaseDao.php';

class TagsDaoImpl extends TaskBaseDao implements ITagsDao {
    protected $table = 'tags';
   public function deleteByTaskId($taskId){
      return $this->queryHelper()->delete($this->table, 'taskId=?', array($taskId));
    }
  
    
}