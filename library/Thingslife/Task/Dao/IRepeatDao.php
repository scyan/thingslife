<?php
require_once 'Juzi/Dao/IDao.php';

interface IRepeatDao extends IDao {

    public function loadByTaskId ($taskId);

    public function updateByTaskId (array $fields, $taskId);
}