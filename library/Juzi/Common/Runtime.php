<?php

class Runtime {
    
    const PRODUCTION = 'prod';
    const DEVELOPMENT = 'dev';
    const TEST = 'test';
    
    public static $level = self::DEVELOPMENT;
    
    public static function setLevel($level) {
    	if (!in_array($level, array(self::PRODUCTION, self::DEVELOPMENT, self::TEST))) {
    		throw new Exception('Runtime level error!');
    	}
    	self::$level = $level;
    }
}


