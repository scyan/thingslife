<?php

require_once 'Thingslife/User/Dao/Impl/UserBaseDao.php';
require_once 'Thingslife/User/Dao/ISessionDao.php';

class SessionDaoImpl extends UserBaseDao implements ISessionDao {
    protected $table = 'session';

    public function deleteWithModifiedLessThen ($time) {
        return $this->queryHelper()->delete($this->table, 'modified < ?', array(
            $time
        ));
    }

}