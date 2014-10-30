<?php

class Validator {

    public static function username ($value) {
        if (strlen($value) > 20 || strlen($value) < 4) {
            return false;
        }
        return preg_match('/^[\x{4e00}-\x{9fa5}\w]+$/u', $value);
    }

    public static function truename ($value) {
        if (strlen($value) > 18 || strlen($value) < 6) {
            return false;
        }
        return preg_match('/^[\x{4e00}-\x{9fa5}\w]+$/u', $value);
    }

    public static function password ($value) {
        if (strlen($value) > 32 || strlen($value) < 4) {
            return false;
        }
        return ctype_print($value);
    }

    public static function vsacount ($value) {
    	if (strlen($value) > 32) {
    		return false;
    	}
    	return ctype_alnum(str_replace(array('_'), '', $value));
    }

    public static function qq ($value) {
    	if (strlen($value) > 16 || strlen($value) < 4) {
    		return false;
    	}
    	return ctype_digit($value);
    }

    public static function mobile ($value) {
    	if (strlen($value) != 11) {
    		return false;
    	}
    	return ctype_digit($value);
    }

    public static function idcardno ($value) {
    	if (strlen($value) > 20 || strlen($value) < 15) {
    		return false;
    	}
    	return ctype_alnum($value);
    }

    public static function email ($value) {
    	if (strlen($value) > 128) {
    		return false;
    	}
    	require_once 'Zend/Validate/EmailAddress.php';
    	$validator = new Zend_Validate_EmailAddress();
    	return $validator->isValid($value);
    }

    public static function sex ($value) {
    	return in_array($value, array('male', 'female', 'secret'));
    }
    
    public static function questionAnswer($value) {
        if (strlen($value) < 3 || strlen($value) > 768) {
            return false;
        }
        return preg_match('/^[\x{4e00}-\x{9fa5}\w]+$/u', $value);
    }
}