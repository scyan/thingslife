<?php

require_once ('Juzi/Dao/PropelPDO.php');

class ConnectionFactory {
    protected static $instance = null;
    protected $config = array();
    protected $pool = array();

    /**
     * @return ConnectionFactory
     */
    public static function getInstance () {
        if (! self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function setConfig (array $config) {
        $this->config = $config;
    }

    /**
     * @return PDO
     */
    public function getConnection ($name) {
    	$name = $this->getRealConnectionName($name);
        $connection = $this->pullConnection($name);
        
        if (empty($connection)) {
            $connection = $this->createConnection($name);
            $this->pushConnection($name, $connection);
        }
        return $connection;
    }

    public function closeConnection ($name) {
        if ($this->hasConnection($name) == true) {
            $this->pool[$name] = null;
        }
    }

    private function createConnection ($name) {
        $config = $this->config[$name];
        $connection = new PropelPDO($config['dns'], $config['username'], $config['password'], array(
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true
        ));
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $connection->exec('SET NAMES UTF8');
        return $connection;
    }

    private function hasConnection ($name) {
        return isset($this->pool[$name]) && ($this->pool[$name] instanceof PropelPDO);
    }

    private function pullConnection ($name) {
        if ($this->hasConnection($name)) {
            return $this->pool[$name];
        }
        return null;
    }

    private function pushConnection ($name, $connection) {
        $this->pool[$name] = $connection;
    }
    
    private function getRealConnectionName ($name) {
        if ($this->checkConnectionName($name) == false) {
            throw new Exception("Connection `{$name} not exists, or config error!");
        }
        if (isset($this->config[$name]['use'])) {
            $realName = $this->config[$name]['use'];
            if ($this->checkConnectionName($realName) == false) {
                throw new Exception("Connection `{$realName} not exists, or config error!");
            }
            return $realName;
        }
        return $name;
    }

    private function checkConnectionName ($name) {
        return isset($this->config[$name]) && is_array($this->config[$name]) && ! empty($this->config[$name]);
    }

    private function __construct () {}

    public function __clone () {
        throw new Exception('deny Clone.');
    }
}

