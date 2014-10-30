<?php

require_once 'Juzi/Util/ObjectContainer.php';

class BaseFactory {
	/**
	 * @var ObjectContainer
	 */
	protected $container;
	
	protected function __construct() {
		$this->container = ObjectContainer::instance();
	}
	
	protected function __clone() {
		throw new RuntimeException('You can not copy this object.');
	}
}