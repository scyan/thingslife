<?php

require_once 'Thingslife/User/Dao/Impl/UserBaseDao.php';
require_once 'Thingslife/User/Dao/IPersistentLoginDao.php';

class PersistentLoginDaoImpl extends UserBaseDao implements IPersistentLoginDao {
    protected $table = 'user_persistent_login';

    public function create ($fields) {
        return $this->add($fields);
    }

    public function loadByUserIdAndSeries ($userId, $series) {
        return $this->queryHelper()->load($this->table, null, 'userId=? AND series=?', array(
            $userId , 
            $series
        ));
    }

    public function deleteByUserIdAndSeries ($userId, $series) {
        return $this->queryHelper()->delete($this->table, 'userId=? AND series=?', array(
            $userId , 
            $series
        ));
    }

    public function deleteByUserId ($userId) {
        return $this->queryHelper()->delete($this->table, 'userId=?', array(
            $userId
        ));
    }
}