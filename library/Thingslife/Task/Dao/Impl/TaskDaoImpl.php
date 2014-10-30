<?php
require_once 'Thingslife/Task/Dao/ITaskDao.php';
require_once 'Thingslife/Task/Dao/Impl/TaskBaseDao.php';

class TaskDaoImpl extends TaskBaseDao implements ITaskDao {
    protected $table = 'task';
    public function listByParentId($parentId){
      return $this->queryHelper()->query($this->table,null,'parent=?',array($parentId));
    }
    public function listByUserIdAndDoneAndDeleted ($userId, $done, $deleted, $offset, $limit) {
        return $this->queryHelper()->query($this->table, null, 'userId=? AND done=? AND deleted=? AND repeatId=0', array(
            $userId , 
            $done , 
            $deleted
        ), null, null, '`exeDate` DESC', $limit, $offset);
    }

    public function listByDoneAndDeleted ($done, $deleted, $offset, $limit) {
        return $this->queryHelper()->query($this->table, null, 'done=? AND deleted=? AND repeatId=0', array(
            $done , 
            $deleted
        ), null, null, '`exeDate` DESC', $limit, $offset);
    }

    public function countByUserIdAndDoneAndDeleted ($userId, $done, $deleted) {
        return $this->queryHelper()->count($this->table, null, 'userId=? AND done=? AND deleted=? AND repeatId=0', array(
            $userId , 
            $done , 
            $deleted
        ));
    }

    public function countByDoneAndDeleted ($done, $deleted) {
        return $this->queryHelper()->count($this->table, null, 'done=? AND deleted=? AND repeatId=0', array(
            $done , 
            $deleted
        ));
    }

    public function loadDeleted ($userid) {
        return $this->queryHelper()->query($this->table, null, 'userId=? and deleted=?', array(
            $userid,
            'true'
        ));
    }

    public function wave (array $fields, $id) {
        return $this->queryHelper()->wave($this->table, $fields, '_id=?', array(
            $id
        ));
    }
}