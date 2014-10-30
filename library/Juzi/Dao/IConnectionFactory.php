<?php

interface IConnectionFactory {
	
	/**
	 * @return PDO
	 */
	public function getConnection();
}

