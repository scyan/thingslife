<?php

class Context {

    protected static $instance = null;

    protected $user;

    protected $environment;

    protected $config;
    
    /**
     * @return Context
     * @param array $config
     */
    public static function createInstance (Array $config) {
        self::$instance = new self();
        self::$instance->initialize($config);
        return self::$instance;
    }

    /**
     * @return Context
     */
    public static function getInstance () {
        if (! self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function setUser ($user) {
        $this->user = $user;
    }

    /**
     * @return Vane\User\User;
     */
    public function getUser () {
        return $this->user;
    }

    public function loadConfig ($name) {
        $configDir = $this->config['config.dir'];
        return include "{$configDir}/{$name}.{$this->environment}.php";
    }

    private function initialize ($config) {
        $this->config = $config;
        $this->environment = $config['env'];
    }

}
