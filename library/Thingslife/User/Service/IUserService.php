<?php

interface IUserService {

    public function load ($id);

    public function listUsers ($offset=null, $limit=null);

    public function update (array $fields, $id);

    public function registerUser ($fields);//注册用户

    public function isUsernameAvailable ($username);//注册时检查用户名是否已被注册

    public function loadByUsername ($username);

    public function loadByEmail ($email);

    public function checkPassword ($user, $password);//验证密码

}