<?php
require_once ('Thingslife/User/Service/IUserService.php');
require_once ('Thingslife/Common/BaseService.php');
require_once 'Thingslife/User/Dao/UserDaoFactory.php';

class UserServiceImpl extends BaseService implements IUserService {

    public function load ($id) {
        return $this->getUserDao()->load($id);
    }

    public function listUsers ($offset=null, $limit=null) {
        return $this->getUserDao()->listAll($offset, $limit);
    }

    public function update (array $fields, $id) {
        unset($fields['username']); // cann't update username field.
        require_once 'Juzi/Util/ArrayUtil.php';
        $filtered = ArrayUtil::filterKeys($this->userFields, $fields);
        
        if (empty($filtered)) {
            return;
        }
        
        if ($this->_validateUserFields($filtered) == false) {
            require_once 'Thingslife/Common/ServiceException.php';
            throw new ServiceException('user fields invalid.');
        }
        
        return $this->getUserDao()->update($filtered, $id);
    }
    
    private $userFields = array(
        'username' , 
        'password' , 
        'email'
    );

    public function registerUser ($fields) {
        $contextUser = $this->context()->getUser();
        
        if (empty($fields['username']) || empty($fields['password'])) {
            require_once 'Thingslife/Common/ServiceException.php';
            throw new ServiceException('username or password is empty.');
        }
        
        if ($this->_validateUserFields($fields) == false) {
            require_once 'Thingslife/Common/ServiceException.php';
            throw new ServiceException('user fields invalid.');
        }
        
        if (! empty($fields['email']) && ! $this->isEmailAvailable($fields['email'])) {
            require_once 'Thingslife/Common/ServiceException.php';
            throw new ServiceException('email is not availabele.');
        }
        
        $userFields = array();
        $userFields['username'] = $fields['username'];
        $userFields['password'] = md5($fields['password']);
        $userFields['email'] = $fields['email'];
        $userFields['createdTime'] = time();
        $userFields['updatedTime'] = time();
        
        $this->getUserDao()->add($userFields);
        
        return $userFields;
    }

    private function _validateUserFields ($fields) {
        require_once 'Thingslife/Util/Validator.php';
        if (! empty($fields['username']) && ! Validator::username($fields['username'])) {
            return false;
        }
        
        if (! empty($fields['password']) && ! Validator::password($fields['password'])) {
            return false;
        }
        
        if (! empty($fields['email']) && ! Validator::email($fields['email'])) {
            return false;
        }
        
        return true;
    }

    public function isUsernameAvailable ($username) {
        $user = $this->loadByUsername($username);
        return empty($user) ? true : false;
    }

    public function isEmailAvailable ($email, $forModify = false) {
        if (empty($email)) {
            return false;
        }
        $user = $this->getUserDao()->loadByEmail($email);
        if (empty($user)) {
            return true;
        }
        
        if ($forModify != true) {
            return false;
        }
        
        $contextUser = $this->context()->getUser();
        if (! $contextUser->isLogin()) {
            return false;
        }
        
        if ($user['_id'] == $contextUser->id) {
            return true;
        }
        return false;
    }

    public function loadByUsername ($username) {
        return $this->getUserDao()->loadByUsername($username);
    }

    public function loadByEmail ($email) {
        return $this->getUserDao()->loadByEmail($email);
    }

    public function checkPassword ($user, $password) {
        if (! is_array($user)) {
            $user = $this->getUserDao()->loadUserByName($user);
        }
        if (empty($user)) {
            return false;
        }
        return $user['password'] == md5($password) ? true : false;
    }

    private function getUserDao () {
        return UserDaoFactory::getInstance()->createUserDao();
    }

    private function getPersistentLoginDao () {
        return UserDaoFactory::getInstance()->createPersistentLoginDao();
    }

}

