<?php

class Filter {

    public static function jumpUrl ($value) {
        $host = parse_url($value, PHP_URL_HOST);
        
        if (empty($host)) {
            return '/';
        }
        
        $hostDomain = self::getDomain($host);
        $httpHostDomain = self::getDomain($_SERVER['HTTP_HOST']);
        if ($hostDomain != $httpHostDomain) {
            return '/';
        }
        
        return $value;
    
    }

    public static function getDomain ($url) {
        $pattern = "/[\w-]+\.(com|net|org|gov|cc|biz|info|cn|co)(\.(cn|hk))*/";
        if (preg_match($pattern, $url, $matches)) {
            return $matches[0];
        }
        return null;
    }
}