<?php

require_once 'Thingslife/User/Util/SessionSaveHandler.php';
require_once 'Thingslife/User/Dao/UserDaoFactory.php';

class DefaultSessionSaveHandler implements SessionSaveHandler {

    public function open ($save_path, $name) {
        return true;
    
    }

    
    public function close () {
        return true;
    }

    
    public function read ($id) {
        $return = '';
        $row = $this->getSessionDao()->load($id);
        if (! empty($row)) {
            if ($this->getExpirationTime($row) > time()) {
                $return = $row['data'];
            } else {
                $this->destroy($id);
            }
        }
        return $return;
    }

    
    public function write ($id, $data) {
        $return = false;
        $row = array();
        $row['modified'] = time();
        $row['data'] = $data;
        
        $found = $this->getSessionDao()->load($id);
        if ($found) {
            if ($this->getSessionDao()->update($row, $id)) {
                $return = true;
            }
        } else {
            $row['_id'] = $id;
            if ($this->getSessionDao()->add($row)) {
                $return = true;
            }
        }
        
        return $return;
    }

    
    public function destroy ($id) {
        $return = false;
        if ($this->getSessionDao()->delete($id)) {
            $return = true;
        }
        return $return;
    }

    public function gc ($lifetime) {
        $this->getSessionDao()->deleteWithModifiedLessThen(time() - $lifetime);
        return true;
    }

    public function __destruct () {
        session_write_close();
    }

    private function getSessionDao () {
        return UserDaoFactory::getInstance()->createSessionDao();
    }

    private function getExpirationTime ($row) {
        return $row['modified'] + (int) ini_get('session.gc_maxlifetime');
    }
}


