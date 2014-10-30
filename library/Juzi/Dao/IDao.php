<?php

interface IDao {
	/**
	 * 根据id读取一行记录
	 * 
	 * @param int $id
	 */
	public function load($id);
	
	/**
	 * 添加一行记录
	 * 
	 * @param array $fields
	 */
	public function add(array $fields);
	
	/**
	 * 更新一行记录
	 * 
	 * @param array $fields
	 * @param array $id
	 */
	public function update(array $fields, $id);
	
	/**
	 * 删除一行记录
	 * 
	 * @param int $id
	 */
	public function delete($id);
	
	/**
	 * 获取数据库连接
	 * 
	 * @return PDO
	 */
	public function getConnection();
}