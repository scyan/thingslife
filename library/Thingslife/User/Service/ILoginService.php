<?php
interface ILoginService {
	
	public function login($name, $password, $isPersistent = false);//登陆
	
	public function logout();//退出
	
	public function initialize();//初始化session

}