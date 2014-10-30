<?php
require_once 'Juzi/Dao/IDao.php';

interface ITaskDao extends IDao {
	public function listByParentId($parentId);
	public function listByUserIdAndDoneAndDeleted($userId, $done, $deleted, $offset, $limit);
	
	public function listByDoneAndDeleted($done, $deleted, $offset, $limit);
	
	public function countByUserIdAndDoneAndDeleted($userId, $done, $deleted);
	
	public function countByDoneAndDeleted($done, $deleted);
	
	public function wave(array $fileds, $id);
}