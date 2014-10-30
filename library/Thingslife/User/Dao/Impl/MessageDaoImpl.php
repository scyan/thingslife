<?php
require_once 'Thingslife/User/Dao/IMessageDao.php';
require_once 'Thingslife/User/Dao/Impl/UserBaseDao.php';
class MessageDaoImpl extends UserBaseDao implements IMessageDao {
protected $table = 'message';
}