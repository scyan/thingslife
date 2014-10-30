<?php

require_once 'Juzi/Common/Runtime.php';

class ConfigLoader {
    
    private $_basePath;

    public function __construct ($basePath) {
        $this->_basePath = $basePath;
    }

    public function load ($name) {
        $filePath = $this->getConfigFilePath($name);
        if (! file_exists($filePath)) {
            throw new Exception("Confige file {$name} not exist");
        }
        $config = include ($filePath);
        if (! is_array($config)) {
            throw new Exception("Config must be array.");
        }
        return $config;
    }

    private function getConfigFilePath ($name) {
        $fileName = $name . '.' . Runtime::$level . '.php';
        return $this->_basePath . DIRECTORY_SEPARATOR . $fileName;
    }
}