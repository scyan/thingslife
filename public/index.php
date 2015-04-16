<?php

// Define path to application directory
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

defined('RUNTIME_PATH') || define('RUNTIME_PATH', realpath(dirname(__FILE__) . '/../runtime'));
defined('TEMP_PATH') || define('TEMP_PATH', realpath(RUNTIME_PATH . '/tmp'));

// Define application environment
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library') ,
    get_include_path()
)));

/*自动加载*/
define("DS", DIRECTORY_SEPARATOR);
$base_path = rtrim(dirname((dirname(__FILE__))), DS);
define('TOOLPATH', $base_path . DS . 'library'.DS.'Juzi'.DS.'Util');
function auto_load($class) {
	/*
	 for security concerns, we should check the illegal chars.
	the reason of using trim instead of preg_match('/^\w$/iD', $class), is that
	even a trim(a_big_charlist) is a bit faster(~10%) than preg_match('\w')
	*/
	if (trim($class, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz1234567890')) {
		return false;
	}
	$file = str_replace('_', '/', strtolower($class));


	$path = TOOLPATH . DIRECTORY_SEPARATOR . $file . '.php';
	if(file_exists($path)){
		require $path;
	}
	//最后再检查一次类是否已经正确加载，如果为false,说明类名与swift的加载规则不兼容，需要返回false以使后续程序能够正确处理。
	return class_exists($class, false);
	//smarty还定义了一个auto load方法，不能就此打住
}

spl_autoload_register('auto_load');
/** 自动加载*/

/** Zend_Application */

require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$application = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
$application->bootstrap()->run();