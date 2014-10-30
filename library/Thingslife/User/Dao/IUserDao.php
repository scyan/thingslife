<?php
require_once 'Juzi/Dao/IDao.php';

interface IUserDao extends IDao {

    public function listAll ($offset=null, $limit=null);

    public function countAll ();

    public function listByIds (array $ids);

    public function loadByEmail ($email);

    public function loadByUsername ($username);
}