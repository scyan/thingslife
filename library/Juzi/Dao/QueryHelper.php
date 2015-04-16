<?php

class QueryHelper {
	
	/**
	 * @var PDO
	 */
	private $connection;
	
	public function __construct(PDO $connection) {
		$this->connection = $connection;
	}
	
	/**
	 * 
	 * @param $tableName
	 * @param $columns 
	 * @param $selection 
	 * @param $selectionArgs
	 * @param $groupBy GROUP BY
	 * @param $having HAVING
	 * @param $orderBy ORDERBY
	 * @param $offset OFFSET
	 * @param $limit LIMINT
	 * @return Array
	 */
	public function query($tableName, $columns = null, $selection = null, $selectionArgs = null, $groupBy = null, $having = null, $orderBy = null, $limit = null, $offset = null, $lock = false) {
		$sql = $this->_buildQuerySql ( $tableName, $columns, $selection, $groupBy, $having, $orderBy, $limit, $offset, $lock );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $selectionArgs );
		$stmt->execute ();
		return $stmt->fetchAll ( PDO::FETCH_ASSOC );
	}
	public function loadGroup($tableName, $columns = null, $selection = null, $selectionArgs = null, $groupBy = null, $having = null, $orderBy = null, $limit = null, $offset = null, $lock = false) {
		$sql = $this->_buildQuerySql ( $tableName, $columns, $selection, $groupBy, $having, $orderBy, $limit, $offset, $lock );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $selectionArgs );
		$stmt->execute ();
		return $stmt->fetchAll ( PDO::FETCH_GROUP );
	}
	public function listColumn($tableName, $columns = null, $selection = null, $selectionArgs = null, $groupBy = null, $having = null, $orderBy = null, $limit = null, $offset = null) {
		$sql = $this->_buildQuerySql ( $tableName, $columns, $selection, $groupBy, $having, $orderBy, $limit, $offset );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $selectionArgs );
		$stmt->execute ();
		return $stmt->fetchAll ( PDO::FETCH_COLUMN );
	}
	
	public function loadColumn($tableName, $columns = null, $selection = null, $selectionArgs = null) {
		$sql = $this->_buildQuerySql ( $tableName, $columns, $selection, null, null, null, 1 );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $selectionArgs );
		$stmt->execute ();
		return $stmt->fetchColumn ();
	}
	
	public function load($tableName, $columns = null, $selection = null, $selectionArgs = null, $lock = false) {
		$sql = $this->_buildQuerySql ( $tableName, $columns, $selection, null, null, null, 1, 0, $lock );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $selectionArgs );
		$stmt->execute ();
		$row = $stmt->fetch ( PDO::FETCH_ASSOC );
		return ! empty ( $row ) ? $row : null;
	}
	
	public function update($tableName, $values, $whereClause = null, $whereArgs = null) {
		$sql = $this->_buildUpdateSql ( $tableName, $values, $whereClause );
		
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $values );
		$this->_bindParams ( $stmt, $whereArgs, count ( $values ) );
		$stmt->execute ();
		return $stmt->rowCount ();
	}
	
	public function wave($tableName, $values, $whereClause = null, $whereArgs = null) {
		$sql = $this->_buildWaveSql ( $tableName, $values, $whereClause );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $whereArgs);
		$stmt->execute ();
		return $stmt->rowCount ();
	}
	
	public function insert($table, Array $values) {
		$sql = $this->_buildInsertSql ( $table, $values );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $values );
		$stmt->execute ();
		return $this->connection->lastInsertId ();
	}
	
	public function delete($table, $whereClause = null, $whereArgs = null, $limit = null) {
		$sql = $this->_buildDeleteSql ( $table, $whereClause, $limit );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $whereArgs );
		$stmt->execute ();
		return $stmt->rowCount ();
	}
	
	public function count($tableName, $column = null, $whereClause = null, $whereArgs = null) {
		$sql = $this->_buildCountSql ( $tableName, $column, $whereClause );
		$stmt = $this->connection->prepare ( $sql );
		$this->_bindParams ( $stmt, $whereArgs );
		$stmt->execute ();
		return intval ( $stmt->fetchColumn () );
	}
	
	private function _buildQuerySql($tableName, $columns = null, $selection = null, $groupBy = null, $having = null, $orderBy = null, $limit = null, $offset = null, $lock = false) {
		$sql = 'SELECT ';
		$sql .= empty ( $columns ) ? '* ' : $columns . ' ';
		$sql .= 'FROM ' . $tableName . ' ';
		$sql .= empty ( $selection ) ? '' : 'WHERE ' . $selection . ' ';
		$sql .= empty ( $groupBy ) ? '' : 'GROUP BY ' . $groupBy . ' ';
		//TODO HAVING
		$sql .= empty ( $having ) ? '' : 'HAVING ' . $having . ' ';
		$sql .= empty ( $orderBy ) ? '' : 'ORDER BY ' . $orderBy . ' ';
		if (! empty ( $limit ) && $limit > 0) {
			$offset = (empty ( $offset ) || $offset < 0) ? 0 : $offset;
			$sql .= 'LIMIT ' . $offset . ', ' . $limit;
		}
		if ($lock === true) {
			$sql .= ' FOR UPDATE';
		}
		
		return $sql;
	}
	
	private function _buildUpdateSql($tableName, $values, $whereClause) {
		$sql = 'UPDATE ' . $tableName . ' ';
		$sql .= 'SET ';
		foreach ( array_keys ( $values ) as $key ) {
			$sql .= $key . '=?,';
		}
		$sql = rtrim ( $sql, ',' ) . ' ';
		$sql .= empty ( $whereClause ) ? '' : 'WHERE ' . $whereClause;
		
		return $sql;
	}
	
	private function _buildWaveSql($tableName, $values, $whereClause) {
		$sql = 'UPDATE ' . $tableName . ' ';
		$sql .= 'SET ';
		foreach ($values as $key => $value ) {
			$sql .= "{$key} = {$key} + {$value},";
		}
		$sql = rtrim ( $sql, ',' ) . ' ';
		$sql .= empty ( $whereClause ) ? '' : 'WHERE ' . $whereClause;
		
		return $sql;
	}
	
	private function _buildInsertSql($table, $values) {
		$sql = "INSERT INTO {$table} (";
		foreach ( array_keys ( $values ) as $key ) {
			$sql .= "`{$key}`,";
		}
		$sql = rtrim ( $sql, ',' ) . ') VALUES (';
		$sql .= join ( array_fill ( 0, count ( $values ), '?' ), ',' );
		$sql .= ')';
		return $sql;
	}
	
	private function _buildDeleteSql($table, $whereClause, $limit) {
		$sql = 'DELETE FROM ' . $table . ' ';
		$sql .= empty ( $whereClause ) ? '' : 'WHERE ' . $whereClause;
		$limit = (int) $limit;
		$sql .= empty($limit) ? '' : ' LIMIT ' . $limit;
		return $sql;
	}
	
	private function _buildCountSql($tableName, $column, $whereClause) {
		$sql = 'SELECT COUNT(';
		$sql .= empty ( $column ) ? '*' : $column;
		$sql .= ') FROM ' . $tableName . ' ';
		$sql .= empty ( $whereClause ) ? '' : 'WHERE ' . $whereClause;
		return $sql;
	}
	
	private function _bindParams(&$stmt, $values, $startIndex = 0) {
		$values = empty ( $values ) ? array () : array_values ( $values );
		for($i = 0; $i < count ( $values ); $i ++) {
			$stmt->bindParam ( $startIndex + $i + 1, $values [$i] );
		}
	}
}