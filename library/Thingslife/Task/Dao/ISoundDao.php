<?php
require_once 'Juzi/Dao/IDao.php';

interface ISoundDao extends IDao {
  public function deleteByTaskId($taskId);
}