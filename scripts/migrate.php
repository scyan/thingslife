<?php

define('APPLICATION_ENV', 'development');

// Define path to application directory
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library') , 
    get_include_path()
)));

header("Content-type: text/html; charset=utf-8"); 
/** Zend_Application */

require_once 'Zend/Application.php';

$application = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
$application->bootstrap('service');


require_once 'Thingslife/Task/Dao/TaskDaoFactory.php';
//$pdo = $taskService = TaskDaoFactory::getInstance()->createTaskDao()->getConnection();

$db = TaskDaoFactory::getInstance()->createTaskDao()->getConnection();

$tasks2=$db->query("select * from task2")->fetchAll(PDO::FETCH_ASSOC);
$i=0;
foreach($tasks2 as $item){
  $i++;
  if($item['box']=='today'){
    $item['focusType']='today';
    $item['focus']='next';
  }else{
    $item['focus']=$item['focusType']=$item['box'];
  }
  $item['focusLevel']=0;
  unset($item['_id']);
  unset($item['box']);
  foreach($item as $key=>$value){
    $task_values[]="'$value'";
    $task_keys[]=$key;
  }

  $task_keys=implode(',',$task_keys);
  $task_values=implode(',',$task_values);
  
  $db->exec("insert into task ($task_keys)VALUES($task_values)");
  unset($task_keys);
  unset($task_values);
}

var_dump($i);
