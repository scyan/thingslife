<?php

require_once 'Juzi/Dao/IDao.php';

interface IPersistentLoginDao extends IDao {
	
	public function create($fields);
	
	public function loadByUserIdAndSeries($userId, $series);
	
	public function deleteByUserIdAndSeries($userId, $series);
	
	public function deleteByUserId($userId);
	
}