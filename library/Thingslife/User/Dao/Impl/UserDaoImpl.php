<?php
require_once 'Thingslife/User/Dao/IUserDao.php';
require_once 'Thingslife/User/Dao/Impl/UserBaseDao.php';

class UserDaoImpl extends UserBaseDao implements IUserDao {
    protected $table = 'user';

    public function listAll ($offset=null, $limit=null) {
        return $this->queryHelper()->query($this->table, null, null, null, null, null, '`_id` desc', $limit, $offset);
    }

    public function loadByUsername ($username) {
        return $this->queryHelper()->load($this->table, null, 'username=?', array(
            $username
        ));
    }

    public function loadByEmail ($email) {
        return $this->queryHelper()->load($this->table, null, 'email=?', array(
            $email
        ));
    }

    public function countAll () {
        return $this->queryHelper()->count($this->table);
    }

    public function listByIds (array $ids) {
        $ids = implode(',', $ids);
        return $this->queryHelper()->query($this->table, null, "`_id` IN({$ids})", null, null, null, '`_id` DESC');
    }
}

