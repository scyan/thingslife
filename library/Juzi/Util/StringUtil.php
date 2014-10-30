<?php

class StringUtil {

    /**
     * 统一换行符为Linux的换行符
     * Windowns的换行符为”\r\n"
     * Linunx的换行符为"\n"
     * Mac OS的换行符为"\r"
     * @param string $string
     */
    public static function normalizeNewlineCharacter ($string) {
        return str_replace("\r", "\n", str_replace("\r\n", "\n", $string));
    }

    public static function strImplodeBlank ($string) {
        return implode(' ', array_filter(explode('	', implode(' ', array_filter(explode(' ', $string))))));
    }

    public static function strImplodeBlankToOne ($string) {
        $str = self::strImplodeBlank($string);
        $str = preg_replace('/\s+/', ' ', $str);
        return $str;
    }
}