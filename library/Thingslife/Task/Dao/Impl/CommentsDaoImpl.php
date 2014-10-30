<?php
require_once 'Thingslife/Task/Dao/ICommentsDao.php';
require_once 'Thingslife/Task/Dao/Impl/TaskBaseDao.php';

class CommentsDaoImpl extends TaskBaseDao implements ICommentsDao {
    protected $table = 'comments';

    public function listByTaskId ($taskId, $offset, $limit) {
        return $this->queryHelper()->query($this->table, null, 'taskId=?', array(
            $taskId
        ), null, null, '_id DESC', $limit, $offset);
    }
 
    public function countByTaskId ($taskId) {
        return $this->queryHelper()->count($this->table, null, 'taskId=?', array(
            $taskId
        ));
    }
    
}