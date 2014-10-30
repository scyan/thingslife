<?php

require_once ('Thingslife/User/Service/ILoginService.php');
require_once ('Thingslife/Common/BaseService.php');
require_once 'Thingslife/User/Dao/UserDaoFactory.php';
require_once 'Thingslife/User/User.php';


class LoginServiceImpl extends BaseService implements ILoginService {
    
    const COOKIE_NAME = 'PL';
    
    const COOKIE_VERSION = 'a';

    public function initialize () {
        $user = new User();
        $user->fromSession();
        
        $loginFromCookie = false;
        if (! $user->isLogin()) {
            $user = $this->getUserFromCookie();
            //             var_dump($user); exit();
            if ($user->isLogin()) {
                $loginFromCookie = true;
            }
        }
        
        if ($user->isLogin()) {
            $rawUser = $this->getUserService()->load($user->id);
            if (empty($rawUser)) {
                $this->clearPersistentLoginCookie();
                $user->becomeGuest(true);
            } else {
                // 如果user来自cookie，那么需要重新生成session id;
                $user->fromArray($rawUser)->toSession($loginFromCookie);
            }
        }
        
/*        if ($user->isLogin()) {
            $roles = $this->getUserRoleDao()->listByUserId($user->id);
            $user->setRoles($roles);
        }*/
        return $user;
    }

    public function logout () {
        $cookie = $this->decryptCookie();
        if ($cookie) {
            $this->clearPersistentLoginCookie();
            $this->getPersistentLoginDao()->deleteByUserIdAndSeries($cookie['userId'], $cookie['series']);
        }
        
        $return = $this->context()->getUser()->becomeGuest(true);
        return $return;
    }

    
    public function login ($username, $password, $isPersistent = false) {
        $rawUser = $this->getUserService()->loadByUsername($username);
        
        if (empty($rawUser)) {
            require_once 'ThingsLife/Common/ServiceException.php';
            throw new ServiceException('User not exist.');
        }
        
        if ($this->getUserService()->checkPassword($rawUser, $password) == false) {
            require_once 'ThingsLife/Common/ServiceException.php';
            throw new ServiceException('User password is error.');
        }
        
        if ($isPersistent === true) {
            $this->setPersistentLoginIdentifier($rawUser['_id']);
        }
        
        $user = new User();
        
/*        $roles = $this->getUserRoleDao()->listByUserId($rawUser['_id']);
        $user->setRoles($roles);*/
        
        $return = $user->fromArray($rawUser)->toSession(true);
        
        return $return;
    }

    public function syncLogin ($userId) {
        $rawUser = $this->getUserService()->load($userId);
        if (empty($rawUser)) {
            require_once 'ThingsLife/Common/ServiceException.php';
            throw new ServiceException('User not exist.');
        }
        
        $this->setPersistentLoginIdentifier($rawUser['_id']);
        
        $user = new User();
        
        return $user->fromArray($rawUser)->toSession(true);
    }

    
    private function clearPersistentLoginCookie () {
        $params = session_get_cookie_params();
        setcookie(self::COOKIE_NAME, '', time() - 864000, $params['path'], $params['domain'], $params['secure'], true);
    }

    private function getUserFromCookie () {
        $user = new User();
        $cookie = $this->decryptCookie();
        
        if (empty($cookie) || ! $this->validateCookie($cookie)) {
            return $user->becomeGuest(false);
        }
        
        return $user->fromArray(array(
            '_id' => $cookie['userId']
        ));
    }

    private function setPersistentLoginIdentifier ($userId, $currentIdentifier = null) {
        $identifier = array();
        $identifier['userId'] = $userId;
        $identifier['series'] = $this->generatePersistentLoginSeries($currentIdentifier);
        $identifier['token'] = $this->generatePersistentLoginToken();
        $identifier['expires'] = time() + 630720000;
        
        $cookie = $identifier;
        $cookie['version'] = self::COOKIE_VERSION;
        
        $cookie = $this->encryptCookie($cookie);
        
        $params = session_get_cookie_params();
        setcookie(self::COOKIE_NAME, $cookie, $identifier['expires'], $params['path'], $params['domain'], $params['secure'], true);
        
        if (! empty($currentIdentifier)) {
            $this->getPersistentLoginDao()->deleteByUserIdAndSeries($userId, $currentIdentifier['series']);
        }
        
        $this->getPersistentLoginDao()->create($identifier);
    }

    private function encryptCookie (array $cookie) {
        $appKey = 'abqtgq786ctgr78ewcxgbqf';
        $cookie = "{$cookie['userId']}|{$cookie['series']}|{$cookie['token']}|{$cookie['expires']}|{$cookie['version']}";
        $sign = md5($appKey . $cookie . $appKey);
        return "{$cookie}|{$sign}";
    }

    private function validateCookie ($cookie) {
        if (empty($cookie['userId']) || empty($cookie['series']) || empty($cookie['token']) || empty($cookie['expires']) || empty($cookie['version']) || empty($cookie['sign'])) {
            $this->clearPersistentLoginCookie();
            return false;
        }
        
        $persistentLogin = $this->getPersistentLoginDao()->loadByUserIdAndSeries($cookie['userId'], $cookie['series']);
        
        if (empty($persistentLogin)) {
            $this->clearPersistentLoginCookie();
            return false;
        }
        
        if ($cookie['token'] != $persistentLogin['token']) {
            //TODO log thift cookie warnning.
            $this->getPersistentLoginDao()->deleteByUserId($cookie['userId']);
            return false;
        }
        
        $this->setPersistentLoginIdentifier($cookie['userId'], $persistentLogin);
        
        return true;
    }

    private function decryptCookie () {
        if (empty($_COOKIE[self::COOKIE_NAME])) {
            return null;
        }
        
        $cookie = array();
        list ($cookie['userId'], $cookie['series'], $cookie['token'], $cookie['expires'], $cookie['version'], $cookie['sign']) = explode('|', $_COOKIE[self::COOKIE_NAME], 6);
        
        //TODO: check sign.
        


        return $cookie;
    
    }

    private function generatePersistentLoginSeries ($currentIdentifier) {
        if (isset($currentIdentifier['series']) && ! empty($currentIdentifier['series'])) {
            return $currentIdentifier['series'];
        }
        
        $appKey = 'abqtgq786ctgr78ewcxgbqf';
        return md5(uniqid(mt_rand(), TRUE) . $appKey);
    }

    private function generatePersistentLoginToken () {
        $appKey = 'abqtgq786ctgr78ewcxgbqf';
        return md5($appKey . uniqid(mt_rand(), TRUE));
    }

    private function getUserDao () {
        return UserDaoFactory::getInstance()->createUserDao();
    }

    private function getPersistentLoginDao () {
        return UserDaoFactory::getInstance()->createPersistentLoginDao();
    }

    private function getUserService () {
        return UserServiceFactory::getInstance()->createUserService();
    }

/*    private function getUserRoleDao () {
        return UserDaoFactory::getInstance()->createUserRoleDao();
    }*/

}