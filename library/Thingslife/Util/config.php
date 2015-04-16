<?php
require_once 'Juzi/Util/ArrayUtil.php';
class Config {
    public static function get($key) {
        static $config = array();
        
        if (strpos($key, '.') !== false) {
        	list($file, $path) = explode('.', $key, 2);
        }else{
        	$file = $key;
        }
        
        if (!isset($config[$file])) {
        	$config[$file] = self::load($file);
        }
        
        if (isset($path)) {
        	$val = ArrayUtil::path($config[$file], $path, "#not_found#");
        	/* if ($val === "#not_found#"){
        		throw new Comm_Exception_Program("config key not exists:" . $key);
        	} */
        
        	return $val;
        }else{
        	// 获取整个配置
        	return $config[$file];
        }
    }
    public static function load($file){
    	return require_once 'Thingslife/Configs/'.$file.'.php';
    }
}
