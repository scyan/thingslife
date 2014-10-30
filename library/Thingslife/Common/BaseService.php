<?php

class BaseService {
	
	private static $_idGenerator;
	
    private static $context = null;

    static public function setContext (Context $context) {
        self::$context = $context;
    }

    /**
     * @return Context
     */
    public function context () {
        return self::$context;
    }
	
}
