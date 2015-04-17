<?php
require_once 'Thingslife/Task/Dao/ITaskDao.php';
require_once 'Thingslife/Task/Dao/Impl/TaskBaseDao.php';

class TaskDaoImpl extends TaskBaseDao implements ITaskDao {
    protected $table = 'task';

    public function count_inbox_and_today ($uid) {
        $sql = <<<EOF
        select count(case when focus='next' and focusType='today'
            and done='false' then 1 else NULL end) as today,
        count(case when focus='next' and focusType='today'
        and `done`='false' and dueDate>0 and DATE(dueDate)<=CURDATE() then 1 else NULL end) as todayDue,
        count(case when focus='inbox' and focusType='inbox'
        and done='false' then 1 else NULL end) as inbox,
        count(case when focus='inbox' and focusType='inbox'
        and done='false' and dueDate>0 and DATE(dueDate)<=CURDATE() then 1 else NULL end) as inboxDue
        from $this->table where userId=?;
EOF;
        try {
            $st = $this->getConnection()->prepare($sql);
            $st->execute(array($uid
            ));
            $res = $st->fetchAll(PDO::FETCH_ASSOC);
            return $res[0];
        } catch (Exception $e) {
            return false;
        }
    }

    public function list_templates () {
        $sql = <<<EOF
        select a._id as template_id,a.*,b.* from `task` a ,`task_repeat` b 
            where a.repeatId>0 AND a.focus='schedule' AND (isnull(b.executeTime) or b.executeTime<>CURDATE()) AND a.show=1 AND a.repeatId=b._id
            ;
EOF;
        try {
            $st = $this->getConnection()->prepare($sql);
            $st->execute();
            return $st->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return false;
        }
    }

    public function count_children ($taskId) {
        $sql = <<<EOF
        select count(*) as items,
        count(case when done='true' then 1 else NULL end) as `doneItems`,
        count(case when  dueDate>0 and DATE(dueDate)<=CURDATE() then 1 else NULL end) as dueItems
        from task where parent=? AND focusType<>'deleted';
EOF;
        try {
            $st = $this->getConnection()->prepare($sql);
            $st->execute(array($taskId
            ));
            $res = $st->fetchAll(PDO::FETCH_ASSOC);
            return $res[0];
        } catch (Exception $e) {
            return false;
        }
    }
	//定时任务用
    public function move_to_today(){
    	$sql=<<<EOF
    	update $this->table set focus='next' , focusType=(CASE WHEN focusLevel='1' THEN 'next' ELSE 'today' END)
    	     where DATE(exeDate)=CURDATE();
EOF;
    	try {
    		$st = $this->getConnection()->prepare($sql);
    		return $st->execute();
    		
    	} catch (Exception $e) {
    		return false;
    	}
    }
    public function delete_by_ids_and_uid ($uid, $ids = array()) {
        if (! empty($ids)) {
            $st = $this->getConnection()->prepare('delete from ' . $this->table . ' where focusType="deleted" AND userId=? AND _id in (' . implode(',', $ids) . ')');
        } else {
            $st = $this->getConnection()->prepare('delete from ' . $this->table . ' where focusType="deleted" AND userId=? ');
        }
        return $st->execute(array($uid
        ));
    }

    public function load_by_id_and_uid ($id, $uid) {
        $res = $this->queryHelper()->query($this->table, null, '`_id`=? AND userId=? ', array(
            $id , $uid
        ));
        if ($res && isset($res[0])) {
            return $res[0];
        } else {
            return $res;
        }
    }

    public function update_by_id_and_uid ($fields, $id, $uid) {
        return $this->queryHelper()->update($this->table, $fields, "`_id`=? AND `userId`=? ", array(
            $id , $uid
        ));
    }

    public function multiUpdate ($fields, $conditions) { // 2.0
        $whereArr = array();
        $whereValueArr = array();
        if (! $conditions || empty($conditions)) {
            return false;
        }
        foreach ($conditions as $key => $value) {
            array_push($whereArr, $key . ' = ?');
            array_push($whereValueArr, $value);
        }
        // var_dump(implode(' and ', $whereArr));exit;
        return $this->queryHelper()->update($this->table, $fields, implode(' and ', $whereArr), $whereValueArr);
    }
    
	/**
	 * 创建实例
	 * @param unknown_type $fields
	 * @param unknown_type $tplId
	 * @param unknown_type $repeatId
	 * @return boolean
	 */
    public function createInstance ($fields, $tplId, $repeatId) {
        $db = $this->getConnection();
        try {
            
            $db->beginTransaction();
            $sql = "INSERT INTO {$this->table} (";
            foreach (array_keys($fields) as $key) {
                $sql .= "`{$key}`,";
            }
            $sql = rtrim($sql, ',') . ') VALUES (';
            $sql .= join(array_fill(0, count($fields), '?'), ',');
            $sql .= ')';
            $fields = empty($fields) ? array() : array_values($fields);
            $stmt = $db->prepare($sql);
            
            $id = $stmt->execute($fields);
            
            $updateSql = <<<EOF
		update `task` set `instance`=$id where _id=?;
EOF;
            $stmt = $db->prepare($updateSql);
            $stmt->execute(array(
                $tplId
            ));
            
            $updateRepeat = <<<EOF
		update `task_repeat` set executeTime=CURDATE() where _id=?;
EOF;
            $stmt = $db->prepare($updateRepeat);
           return $stmt->execute(array(
                $repeatId
            ));
            
        } catch (Exception $e) {
            $db->rollback();
            return false;
        }
    }

    public function listByParentId ($parentId) {
        return $this->queryHelper()->query($this->table, null, 'parent=?', array(
            $parentId
        ));
    }

    public function listByUserIdAndDoneAndDeleted ($userId, $done, $deleted, $offset, $limit) {
        return $this->queryHelper()->query($this->table, null, 'userId=? AND done=? AND deleted=? AND repeatId=0', array(
            $userId , $done , $deleted
        ), null, null, '`exeDate` DESC', $limit, $offset);
    }

    public function listByDoneAndDeleted ($done, $deleted, $offset, $limit) {
        return $this->queryHelper()->query($this->table, null, 'done=? AND deleted=? AND repeatId=0', array(
            $done , $deleted
        ), null, null, '`exeDate` DESC', $limit, $offset);
    }

    public function countByUserIdAndDoneAndDeleted ($userId, $done, $deleted) {
        return $this->queryHelper()->count($this->table, null, 'userId=? AND done=? AND deleted=? AND repeatId=0', array(
            $userId , $done , $deleted
        ));
    }

    public function countByDoneAndDeleted ($done, $deleted) {
        return $this->queryHelper()->count($this->table, null, 'done=? AND deleted=? AND repeatId=0', array(
            $done , $deleted
        ));
    }

    public function loadDeleted ($userid) {
        return $this->queryHelper()->query($this->table, null, 'userId=? and deleted=?', array(
            $userid , 'true'
        ));
    }

    public function wave (array $fields, $id) {
        return $this->queryHelper()->wave($this->table, $fields, '_id=?', array(
            $id
        ));
    }
}