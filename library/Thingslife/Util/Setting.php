<?php

require_once 'Thingslife/Util/Service/UtilServiceFactory.php';

class Setting {
	
	public static function get($key, $default = null) {
		return UtilServiceFactory::getInstance()->createSettingService()->get($key, $default);
	}
	
	public static function set($key, $value) {
		return UtilServiceFactory::getInstance()->createSettingService()->set($key, $value);
	}
	
	public static function delete($key) {
		
	}
	
}