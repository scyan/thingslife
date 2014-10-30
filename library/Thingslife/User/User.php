<?php

require_once 'Thingslife/Util/Toolkit.php';

class User {
    
    const SESSION_KEY = '__U';
    
    public $id;
    
    public $username;
    
    public $nickname;
    
    public $avatar;
    
    public $roles;
    
    public $ip;

    public function __construct () {
        $this->ip = Toolkit::getOnlineIp();
        $this->roles = array();
    }

    public function initialize (array $user) {
        $this->fromArray($user);
    }

    public function fromArray (array $user) {
        $this->id = empty($user['_id']) ? 0 : $user['_id'];
        $this->username = empty($user['username']) ? '' : $user['username'];
        $this->nickname = empty($user['nickname']) ? '' : $user['nickname'];
        
        $avatar = array();
        $avatar['small'] = empty($user['smallAvatar']) ? '' : $user['smallAvatar'];
        $avatar['normal'] = empty($user['middleAvatar']) ? '' : $user['middleAvatar'];
        $avatar['large'] = empty($user['largeAvatar']) ? '' : $user['largeAvatar'];
        
        $this->avatar = $avatar;
        return $this;
    }

    public function becomeGuest ($writeToSession = true) {
        $this->id = 0;
        $this->username = '';
        $this->nickname = '';
        $this->avatar = '';
        if ($writeToSession === true) {
            $this->toSession();
        }
        return $this;
    }

    public function isLogin () {
        return $this->id > 0;
    }

    public function fromSession () {
        if (empty($_SESSION[self::SESSION_KEY]) || ! is_array($_SESSION[self::SESSION_KEY])) {
            $this->becomeGuest();
        }
        
        $userId = (int) $_SESSION[self::SESSION_KEY]['_id'];
        
        if (empty($userId)) {
            $this->becomeGuest(false);
        }
        
        $this->fromArray($_SESSION[self::SESSION_KEY]);
        
        return $this;
    
    }

    public function toSession ($reGenerateId = false) {
        if ($reGenerateId === true) {
            session_regenerate_id(true);
        }
        $session = array(
            '_id' => $this->id , 
            'username' => $this->username , 
            'nickname' => $this->nickname , 
            'avatar' => $this->avatar
        );
        $_SESSION[self::SESSION_KEY] = $session;
        
        return $this;
    }

    public function setRoles (array $roles) {
        $this->roles = $roles;
    }

}