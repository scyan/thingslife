<?php

class ArrayUtil {

    public static function pullColumn ($fieldName, array $items) {
        $result = array();
        foreach ($items as $item) {
            if (isset($item[$fieldName])) {
                $result[] = $item[$fieldName];
            }
        }
        return $result;
    }

    public static function group ($fieldName, array $items) {
        $result = array();
        foreach ($items as $item) {
        	if (!isset($result[$item[$fieldName]])) {
        		$result[$item[$fieldName]] = array();
        		$result[$item[$fieldName]][] = $item;
        	} else {
        		$result[$item[$fieldName]][] = $item;
        	}
        }
        return $result;
    }
    
    public static function filterColums(array $fieldNames, array $items) {
        $result = array();
        foreach ($items as $item) {
        	$item2 = array();
        	foreach ($fieldNames as $fieldName) {
        		$item2[$fieldName] = $item[$fieldName];
        	}
        	$result[] = $item2;
        }
        return $result;
    }
    
    public static function filterKeys(array $keys, array $items) {
    	$result = array();
    	foreach ($keys as $key) {
    		if (isset($items[$key])) {
    			$result[$key] = $items[$key];
    		}
    	}
    	return $result;
    }
    
    
     public static function path($array, $path, $default = NULL) {
         if (array_key_exists($path, $array)) {
         	return $array[$path];
         }
         
         $delimiter = ".";
         //$path = trim($path, "{$delimiter}* ");
         $keys = explode($delimiter, $path);
         do {
         	$key = array_shift($keys);
         
         	if (isset($array[$key])) {
         		if ($keys) {
         			if (is_array($array[$key])) {
         				$array = $array[$key];
         			} else {
         				break;
         			}
         		} else {
         			return $array[$key];
         		}
         	} elseif ($key === '*') {
         		$values = array();
         		$inner_path = implode($delimiter, $keys);
         		foreach ($array as $arr) {
         			$value = is_array($arr) ? self::path($arr, $inner_path) : $arr;
         			if ($value) {
         				$values[] = $value;
         			}
         		}
         
         		if ($values) {
         			return $values;
         		} else {
         			break;
         		}
         	} else {
         		break;
         	}
         } while ($keys);
         
         return $default;
     }
}