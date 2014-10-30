<?php

class ObjectContainer {
	
	private $objs = array ();
	
	private static $_inst = null;
	
	public static function instance() {
		if (self::$_inst === null) {
			self::$_inst = new self();
		}
		return self::$_inst;
	}
	
	/**
	 * 
	 * 创建对象的单例
	 * 
	 * @param string $scope
	 * @param string $class
	 * @param string $classFilePath 请给出基于inclue_path的class路径
	 */
	public function createObjectInstance($scope, $class, $classFilePath) {
		$instance = $this->getObject($scope, $class);
		if ($instance !== null) {
			return $instance;
		}
		require_once $classFilePath;
		$instance = new $class();
		$this->setObject($scope, $class, $instance);
		return $this->getObject($scope, $class);
	}
	
	private function setObject($scope, $class, $obj) {
		$this->objs [$this->getClassKey ( $scope, $class )] = $obj;
	}
	
	private function getObject($scope, $class) {
		if ($this->hasCreated ( $scope, $class )) {
			return $this->objs [$this->getClassKey ( $scope, $class )];
		}
		return null;
	}
	
	private function hasCreated($scope, $class) {
		return isset ( $this->objs [$this->getClassKey ( $scope, $class )] ) && ! is_null ( $this->objs [$this->getClassKey ( $scope, $class )] );
	}
	
	private function getClassKey($scope, $class) {
		return $scope . '_' . $class;
	}
	
	private function __clone() {
		
	}
	
	
	private function __construct() {
		
	}
}

