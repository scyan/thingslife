<?php
require_once 'Juzi/Dao/IDao.php';

interface ITagsDao extends IDao {
  public function deleteByTaskId($taskId);
}