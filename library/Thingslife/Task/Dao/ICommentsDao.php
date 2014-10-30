<?php
require_once 'Juzi/Dao/IDao.php';

interface ICommentsDao extends IDao {

    public function listByTaskId ($taskId, $offset, $limit);

    public function countByTaskId ($taskId);
}