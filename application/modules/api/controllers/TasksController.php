<?php

require_once dirname(__FILE__) . '/BaseController.php';
require_once 'Thingslife/Util/config.php';
class Api_TasksController extends Api_BaseController {
    public function init () {
        parent::init();
    }
  	public function newtemplateAction(){
  	    $task = array();
  	    $task['userId'] = $this->getUser()->id;
  	    $task['title'] = $this->getRequest()->getPost('title','');
  	    $task['note'] = $this->getRequest()->getPost('note','');
  	    $task['focusType'] = $this->getRequest()->getPost('focusField');
  	    $task['exeDate'] = $this->getRequest()->getPost('exeDate',null);
  	    $task['dueDate'] = $this->getRequest()->getPost('dueDate',null);
  	    $task['parent']=$this->getRequest()->getPost('parent',0);
  	    $tag=$this->getRequest()->getPost('tag');
  	    if($tag&&$tag['edit_tag']=='true'){
  	    	if($tag['edit_tag']=='true'){
  	    		if($this->getTaskService()->moveTagFile($tag['name'])){
  	    			$task['tag']=$tag['name'];
  	    		}
  	    	}
  	    }
  	    $repeat=$this->getRequest()->getPost('repeat');
  	    if($repeat&&$repeat['edit_repeat']=='true'){
  	    	$template=$task;
  	    	$template['userId']=$this->getUser()->id;
  	    	//创建重复
  	    	$template['repeatId'] = (int) $this->getTaskService()->addRepeat($repeat);
  	    	//创建重复任务模板
  	    	$template=$this->getTaskService()->createTemplate($template);
  	    }
  	    if($template){
  	    	return 	$this->setSuccess();
  	    }else{
  	    	return $this->setError();
  	    }
  	}
    public function newAction () { //2.0
        $task = array();
        $task['userId'] = $this->getUser()->id;
        $task['title'] = $this->getRequest()->getPost('title','');
        $task['note'] = $this->getRequest()->getPost('note','');
        $task['focusType'] = $this->getRequest()->getPost('focusField');
        $task['exeDate'] = $this->getRequest()->getPost('exeDate',null);
        $task['dueDate'] = $this->getRequest()->getPost('dueDate',null);
        $task['parent']=$this->getRequest()->getPost('parent',0);
        $tag=$this->getRequest()->getPost('tag');
        if($tag&&$tag['edit_tag']=='true'){
        	if($tag['edit_tag']=='true'){
        		if($this->getTaskService()->moveTagFile($tag['name'])){
        		    $task['tag']=$tag['name'];
        		}
        	}
        }
        
        $taskT= $this->getTaskService()->create($task);
        
        if(!$taskT['_id']){
        	return $this->setError();
        }
        $taskId=$taskT['_id'];
        $repeat=$this->getRequest()->getPost('repeat');
        if($repeat&&$repeat['edit_repeat']=='true'){
        		$template=$task;
        		$template['userId']=$this->getUser()->id;
        		$template['instance']=$taskId;
        		//创建重复
        		$template['repeatId'] = (int) $this->getTaskService()->addRepeat($repeat);
        		
        		if(isset($template['tag'])){
        			$newTagName=md5($template['userId'].'template'.time().rand()).'.png';
        			$tag_floder=$_SERVER['TAG_FOLDER'];
        			$flag=copy($tag_floder.$template['tag'], $tag_floder.$newTagName);
        			if($flag){
        				$template['tag']=$newTagName;
        			}
        		}
        		//创建重复任务模板
        		$template=$this->getTaskService()->createTemplate($template);
        }
        return $this->setSuccess();
      

    }
	public function showinfoAction(){ //2.0
	    // $this->_helper->viewRenderer->setNoRender(false);
	    $uid= $this->getUser()->id;
	    $repeat =$tag= 0;
	    $task['_id'] = $this->getRequest()->getQuery('taskId');
	    $task = $this->getTaskService()->load_by_id_and_uid($task['_id'],$uid);
	   $task['exeDate']=$task['exeDate']=='0000-00-00 00:00:00'?0:$task['exeDate'];
	   $task['dueDate']=$task['dueDate']=='0000-00-00 00:00:00'?0:$task['dueDate'];
	
	    $this->setRepeatInfo($task);
	   	$this->setTag($task);
	    $return = array(
	    		'task' => $task ,
	    		'repeat' => $repeat,
	    		'tag'=>$tag
	    );
	    return $this->setJsonData($return);
	}

	public function doneAction(){ //2.0
	    $uid= $this->getUser()->id;
		$taskId=$this->getRequest()->getQuery('taskId',0);
		$res=$this->getTaskService()->update_by_taskid_and_uid(array('doneTime'=>date('Y-m-d'),'done'=>'true'), $taskId,$uid);
		$this->getTaskService()->update_by_params(array('doneTime'=>date('Y-m-d'),'done'=>true),array('parent'=>$taskId));
		if($res){
			return  $this->setSuccess();
		}
		 return $this->setError();
	}
	public function undoneAction(){ //2.0
	    $uid= $this->getUser()->id;
	    $taskId=$this->getRequest()->getQuery('taskId',0);
	    $task=$this->getTaskService()->load($taskId,$uid);
	    if($task&&$task['parent']){
	    	$this->getTaskService()->update_by_taskid_and_uid(array('doneTime'=>0,'done'=>'false'), $task['parent'],$uid);
	    }
		$res=$this->getTaskService()->update_by_taskid_and_uid(array('doneTime'=>0,'done'=>'false'), $taskId,$uid);
		if($res){
		   return  $this->setSuccess();
		}
		return $this->setError();
	}
    public function editAction () { //2.0
        $uid= $this->getUser()->id;
        if ($this->getRequest()->isPost()) {
            $taskId = $this->getRequest()->getPost('taskId',0);
           
        	$task['toFocusType']=$this->getRequest()->getPost('focusField');
        	if($task['toFocusType']=='inproject'){
        		unset($task['toFocusType']);
        		$task['parent']=$this->getRequest()->getPost('id');
        	}
          
            $task['title'] = $this->getRequest()->getPost('title',null);
            $task['note'] = $this->getRequest()->getPost('note',null);
            $task['exeDate']=$this->getRequest()->getPost('exeDate',null);
            $task['dueDate']=$this->getRequest()->getPost('dueDate',null);
            $editDuedate=false;
            foreach ($task as $key=>$value){
            	if($value===null){
            		unset($task[$key]);
            	}
            }
           
            if(isset($task['dueDate'])&&empty($task['dueDate'])){
                $task['dueDate']=null;
                $editDuedate=true;
            }
            $repeat=$this->getRequest()->getPost('repeat');
         	if($repeat&&$repeat['edit_repeat']=='true'){
       			$oldTask=$this->getTaskService()->load_by_id_and_uid($taskId,$uid);
       			if($oldTask['repeatId']){
       				$this->getTaskService()->updateRepeat($repeat, $oldTask['repeatId']);
       			}
         	}
         	
         	$tag=$this->getRequest()->getPost('tag');
        	if($tag&&$tag['edit_tag']=='true'){
        	    if(!$tag['name']){
        	        if(!isset($oldTask)){
        	        	$oldTask=$this->getTaskService()->load_by_id_and_uid($taskId,$uid);
        	        }
        	        $this->getTaskService()->deleteTagFile($oldTask['tag']);
        	        $task['tag']=0;
        	    }else{
           			if($this->getTaskService()->moveTagFile($tag['name'])){
           		    	$task['tag']=$tag['name'];
           			}
        	    }
           		
        	}
        	$uid= $this->getUser()->id;
            $task=$this->getTaskService()->update_by_taskid_and_uid($task, $taskId,$uid);
            if($task&&$editDuedate){
                $childrenRes=$this->getTaskService()->update_by_params(array('dueDate'=>$task['dueDate']),array('parent'=>$taskId));
            }
             $this->setSuccess();
        } 
    }

    public function destroyAction () {
        $uid=$this->getUser()->id;
      //  $taskIds = explode(',', $this->getRequest()->getPost('taskIds'));
        $res=$this->getTaskService()->destroy($uid);
        if($res){
           return  $this->setSuccess();
        	
        }else{
           return  $this->setError();
        }
    }

    public function archiveAction () {//TODO
        $userId = $this->getUser()->id;
        $focus = $this->getRequest()->getQuery('focusField');
        $parentId = $this->getRequest()->getQuery('id');
        $param=array('userId'=>$userId);
        if($focus=='inproject'){
            $param['parent']=$parentId;
        }else{
            $param['focusType']=$focus;
        }
        $res=$this->getTaskService()->archive($param);
        if($res){
        	return $this->setSuccess();
        }else{
        	 return  $this->setError();
        }
    }

	//上传图片
    public function saveimgAction(){
    	$tag=0;
    	$data=$this->getRequest()->getPost('data');
    	$userId = $this->getUser()->id;
    	
    	$res=$this->getTaskService()->saveTagFile($userId,$data);
    	if($res){
    	  return  $this->setSuccess(array('tag'=>$res));
    	}else{
    	   return $this->setError();
    	}
    
    }
    
/*     public function getuserinfoAction () {
    	$this->view->userName = $this->getUser()->username;
    	$this->view->messages = $this->getMessageService()->countUnRead($this->getUser()->id);
   
    } */
    private function getMessageService () {
        require_once 'Thingslife/User/Service/UserServiceFactory.php';
        return UserServiceFactory::getInstance()->createMessageService();
    }
}