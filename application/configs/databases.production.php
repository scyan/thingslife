<?php
return array(
     '_default' => array(
        'dns' => $_SERVER['DB_DNS'], 
        'username' => $_SERVER['DB_USERNAME'] , 
        'password' => $_SERVER['DB_PASSWORD']
    ) , 
    'user' => array(
        'use' => '_default'
    ) , 
    'task' => array(
        'use' => '_default'
    )
);