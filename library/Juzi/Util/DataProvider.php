<?php

class DataProvider {
    private $_data;
    private $_connection;
    
    public function __construct(Array $data) {
        $this->_data = $data;
    }
    
    public function tablaName() {
        return $this->_data['table'];
    }
    
    public function row() {
        return $this->_data['rows'][array_rand($this->_data['rows'], 1)];
    }
    
    public function allRows() {
        return $this->_data['rows'];
    }
    
    public function setConnection($connection) {
        $this->_connection = $connection;
    }
    
    public function truncateTable() {
        $sql = "TRUNCATE TABLE {$this->tablaName()}";
        $this->_connection->exec($sql);
    }
    
    public function __get($key) {
        return $this->_data[$key];
    }
}