<?php

require_once 'Juzi/Dao/QueryHelper.php';
require_once 'Juzi/Dao/IDao.php';
require_once 'Juzi/Dao/ConnectionFactory.php';

abstract class BaseDao implements IDao {
	
	private $_queryHelper;
	
	protected $table;
	
	protected $connectionName;
	
	public function add(array $fields) {
		return $this->queryHelper()->insert($this->table, $fields);
	}

	public function delete($id) {
		return $this->queryHelper()->delete($this->table, '_id=?', array($id));
	}

	public function load($id) {
		return $this->queryHelper()->load($this->table, null, '_id=?', array($id));
	}

	public function update(array $fields, $id) {
		return $this->queryHelper()->update($this->table, $fields, '_id=?', array($id));
		
	}
	
    /**
     * @return QueryHelper
     */
    public function queryHelper() {
        if (!$this->_queryHelper) {
            $this->_queryHelper = new QueryHelper($this->getConnection());
        }
        return $this->_queryHelper;
    }

    /**
     * @return QueryBuilder
     */
    public function queryBuilder() {
    	require_once 'Juzi/Dao/QueryBuilder.php';
    	$builder = new QueryBuilder($this->table, $this->getConnection());
    	return $builder;
    }
    
    /**
     * @return PDO
     */
	public function getConnection() {
		if (empty($this->connectionName)) {
			throw new Exception("Connect name not set in". __CLASS__ . ';');
		}
		return ConnectionFactory::getInstance()->getConnection($this->connectionName);
	}
}