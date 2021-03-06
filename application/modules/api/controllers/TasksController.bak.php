<?php

require_once dirname(__FILE__) . '/BaseController.php';
require_once 'Thingslife/Util/config.php';
class Api_TasksController extends Api_BaseController {
    public function init () {
        parent::init();
    }
    public function indexAction () {
        $focusField = $this->getRequest()->getQuery('focusField');
        $page = (int) $this->getRequest()->getQuery('page', 1);
        $perPage = (int) $this->getRequest()->getQuery('perPage', 50);
        $userId = $this->getUser()->id;
        $tasks = array();
        $templates = array();
        switch ($focusField) {
            case 'inbox':
                $taskList = $this->getTaskService()->listInbox($userId);
                break;
            case 'schedule':
                $taskList = $this->getTaskService()->listSchedule($userId);
               // $templates = $this->getTaskService()->listTemplates($userId);
                break;
            case 'someday':
                $taskList = $this->getTaskService()->listSomeday($userId);
                break;
            case 'archived':
                $taskList = $this->getTaskService()->listArchived($userId, ($page - 1) * $perPage, $perPage);
                break;
            case 'deleted':
                $taskList = $this->getTaskService()->listDeleted($userId);
                break;
            case 'today':
                $taskList = $this->getTaskService()->listToday($userId);
                break;
            case 'next':
                $taskList = $this->getTaskService()->listNext($userId);
                break;
            case 'project':
                $taskList = $this->getTaskService()->listProject($userId);
                break;
            case 'inProject':
                $projectId = $this->getRequest()->getQuery('project_id');
                $taskList = $this->getTaskService()->listSubTasks($projectId);
            default:
                break;
        
        }
        foreach ($taskList as $task) {
            $task['doneDate'] = date("Y-m-d", $task['doneTime']);
            $task['exeDate'] = date("Y-m-d", $task['exeDate']);
            $task['items'] = ($task['focusLevel'] == 1) ? ($this->getTaskService()->countItems($task['_id'])) : 0;
            $task['dueItems'] = ($task['focusLevel'] == 1) ? ($this->getTaskService()->countItems($task['_id'], null, 'due')) : 0;
            $task['doneItems'] = ($task['focusLevel'] == 1) ? ($this->getTaskService()->countItems($task['_id'], null, 'done')) : 0;
            $tasks[] = $task;
        }
        
        $return = array(
            'tasks' => $tasks 
           // 'templates' => (empty($templates)) ? '' : $templates
        );
        
        return $this->setJsonData($return);
    }
    public function saveimgAction(){
    	   $tag=0;
    	   $data=$this->getRequest()->getPost('data');
    	   $taskId=$this->getRequest()->getPost('taskId');
    	   $task = $this->getTaskService()->load($taskId);
    	   if($task['tag']>0){
    	   	   $tag=$task['tag'];
    	       $this->getTaskService()->updateTagByTaskId($taskId,$data);
    	   }else{
    	       $tag=$this->getTaskService()->addTag($taskId,$data);
    	       $this->getTaskService()->update(array('tag'=>$tag),$taskId);
    	   }
    	  return $this->setJsonData(array('tag'=>$tag));

    }
    public function deletetagAction(){
         $taskId=$this->getRequest()->getPost('taskId');
          $this->getTaskService()->deleteTagByTaskId($taskId);
          $this->getTaskService()->update(array('tag'=>0),$taskId);
           return $this->setJsonData('true');
    }
    public function savewavAction(){
        $error='';
        $sound=0;
        $elem=$this->getRequest()->getPost('file');
    	$taskId=$this->getRequest()->getPost('taskId');
    	$task = $this->getTaskService()->load($taskId);
    	if($_FILES[$elem]["type"]==='audio/x-wav'){
    	   if($task['sound']>0){
    	   	  $sound=$task['sound'];
    		  $this->getTaskService()->updateSoundByTaskId($taskId,$_FILES[$elem]["tmp_name"]);
    	   }else{
    	      $sound=$this->getTaskService()->addSound($taskId,$_FILES[$elem]["tmp_name"]);
    	      $this->getTaskService()->update(array('sound'=>$sound),$taskId);
    	   }
    	   
    	}else{
    	   $error='请上传wav格式的文件';
    	}
    	 return $this->setJsonData(array('error'=>$error,'sound'=>$sound));
    }
    public function deletesoundAction(){
       $taskId=$this->getRequest()->getPost('taskId');
       $this->getTaskService()->deleteSoundByTaskId($taskId);
       $this->getTaskService()->update(array('sound'=>0),$taskId);
       return $this->setJsonData('true');
    }
    public function getpageAction () {
        $userId = $this->getUser()->id;
        $totalCount = $this->getTaskService()->countArchivedtasks($userId);
        $perPage = (int) $this->getRequest()->getQuery('perPage', 50);
        $totalPage = (ceil($totalCount / $perPage) > 1) ? ceil($totalCount / $perPage) : 1;
        return $this->setJsonData($totalPage);
    }

    public function getuserinfoAction () {
        $userName = $this->getUser()->username;
        $unreadMessages = $this->getMessageService()->countUnRead($this->getUser()->id);
        $return = array(
            'userName' => $userName , 
            'unreadMessages' => $unreadMessages
        );
        return $this->setJsonData($return);
    }

    //TODO clear up
    public function gettodayAction () {
        //$return=array('today'=>date("Y-m-d"),'todayTimestamp'=>strtotime(date("Ymd")));
        return $this->setJsonData(array(
            'date' => date("Y-m-d") , 
            'timestamp' => strtotime(date("Ymd"))
        ));
    }

    public function getparentsAction () {
        $parents = trim($this->getRequest()->getQuery('parents'));
        $parents = explode(' ', $parents);
        $return = array();
        foreach ($parents as $parent) {
            $result = $this->getTaskService()->load($parent);
            $return[$parent]=$result;
            //$parentTitles[$parent] = $result['title'];
        }
        return $this->setJsonData($return);
    }

    //TODO clear up
    public function counterAction () {
        $userId = $this->getUser()->id;
        $todayTodo = $this->getTaskService()->countToday($userId);
        $todayDue = $this->getTaskService()->countToday($userId, true);
        $inboxTodo = $this->getTaskService()->countInbox($userId);
        $inboxDue = $this->getTaskService()->countInbox($userId, true);
        
        $return = array(
            'todayDue' => $todayDue , 
            'todayTodo' => $todayTodo , 
            'inboxDue' => $inboxDue , 
            'inboxTodo' => $inboxTodo
        );
        return $this->setJsonData($return);
    }

    public function countitemsAction () {
        $taskId = $this->getRequest()->getQuery('taskId');
        $focusType = $this->getRequest()->getQuery('focusType');
        $dueNum = $this->getTaskService()->countItems($taskId, $focusType, 'due');
        $todoNum = $this->getTaskService()->countItems($taskId, $focusType) - $dueNum;
        $return = array(
            'todo_num' => $todoNum , 
            'due_num' => $dueNum
        );
        return $this->setJsonData($return);
    }

    public function listactiveprojectAction () {
        $userId = $this->getUser()->id;
        $result = $this->getTaskService()->listActiveProject($userId);
        return $this->setJsonData($result);
    }

    
    public function listmessagesAction () {
        $userId = $this->getUser()->id;
        $messages = $this->getMessageService()->listUnRead($userId);
        return $this->setJsonData($messages);
    }

    public function listcommentsAction () {
        $taskId = $this->getRequest()->getQuery('taskId');
        $comments = array();
        $commentList = $this->getTaskService()->listComments($taskId);
        foreach ($commentList as $comment) {
            $comment['createdTime'] = date('c', $comment['createdTime']);
            $comments[] = $comment;
        }
        return $this->setJsonData($comments);
    }

    public function readAction () {
        
        $ids = $this->getRequest()->getPost('messageIds');
        
        $id = array();
        $id = explode(',', $ids);
        $this->getMessageService()->markRead($id);
        return $this->setEmptyObjectJsonData();
    }
 
    public function newAction () {
        $task = array();
        $task['userId'] = $this->getUser()->id;
        $task['title'] = $this->getRequest()->getPost('title','');
        $task['note'] = $this->getRequest()->getPost('note','');
        $task['focusType'] = $this->getRequest()->getPost('focusField');
        $task['exeDate'] = $this->getRequest()->getPost('exeDate',0);
        $task['dueDate'] = $this->getRequest()->getPost('dueDate',0);
        $taskT= $this->getTaskService()->create($task);
        $taskId=$taskT['_id'];
        $repeat=$this->getRequest()->getPost('repeat');
        $filter=array('type','frequency','days');
        if($repeat&&$repeat['edit_repeat']=='true'){
        	require_once 'Juzi/Util/ArrayUtil.php';
        	$repeat = ArrayUtil::filterKeys($filter, $repeat);
        		$template=$task;
        		$template['userId']=$this->getUser()->id;
        		$template['instance']=$taskId;
        		//创建重复
        		$template['repeatId'] = (int) $this->getTaskService()->addRepeat($repeat);
        		unset($template['parent']);
        		unset($template['toFocusType']);
        	//	var_dump($template);
        		//exit;
        		//创建重复任务模板
        		$template=$this->getTaskService()->createTemplate($template);
        		 //更新重复
        		$this->getTaskService()->updateRepeat(array(
        				'taskId' => $template['_id']
        		), $template['repeatId']);
        		$task['template'] = $template['_id'];
        }
        
        $tag=$this->getRequest()->getPost('tag');
        if($tag&&$tag['edit_tag']=='true'){
        	$data=$tag['img'];
        	if($data=='null'){//没有tag
        		/* if($oldTask['tag']>0){
        			$this->getTaskService()->deleteTag($oldTask['tag']);
        			$task['tag']=0;
        		} */
        	}else{
        		$task['tag']=$this->getTaskService()->addTag($task['_id'],$data);
        	}
        }
        
        
        
        
 /*        //TODO
        
        if ($this->getRequest()->getPost('editRepeat') == 'true') {
          
            $template=$this->getTaskService()->createTemplate($task);
            
            $task['template'] = $template['_id'];
            $task = $this->getTaskService()->create($task);
            
            $repeat = array();
            $repeat['type'] = $this->getRequest()->getPost('repeatType');
            $repeat['frequency'] = $this->getRequest()->getPost('frequency');
            $repeat['days']=$this->getRequest()->getPost('days');
            $repeat['taskId'] = $template['_id'];
         
            $template['repeatId'] = $this->getTaskService()->addRepeat($repeat);
            $tagid=0;
            if($this->getRequest()->getPost('editTag')==='true'){
                $data=$this->getRequest()->getPost('tag');
                if($data&&$data!=null&&$data!='null'){
                    $tagid=$this->getTaskService()->addTag($template['_id'],$data);
                    $template['tag']=$tagid;
                }
            }
            $this->getTaskService()->update(array(
                'repeatId' => $template['repeatId'] , 
                'instance' => $task['_id'],
                'tag'=>$tagid
            ), $template['_id']);
        
        } else {
            $task = $this->getTaskService()->create($task);
        
        } */
        
/*         if($this->getRequest()->getPost('editTag')==='true'){
        	$data=$this->getRequest()->getPost('tag');
        	if($data&&$data!=null&&$data!='null'){
           	 	$id=$this->getTaskService()->addTag($task['_id'],$data);
            	$task['tag']=$id;
            	$this->getTaskService()->update(array('tag'=>$id),$task['_id']);
        	}
        } */
        
  ///      $task['exeDate']=date('Y-m-d',$task['exeDate']);
        
      /*    return $this->setJsonData(array(
            'task' => $task , 
            'template' => (! empty($template)) ? $template : null
        )); */
    }
	public function showinfoAction(){
	    // $this->_helper->viewRenderer->setNoRender(false);
	    $repeat =$tag= 0;
	    $task['_id'] = $this->getRequest()->getQuery('taskId');
	    $task = $this->getTaskService()->load($task['_id']);
	    if($task['exeDate']>0){
	        $task['exeDate']=date('Y-m-d',$task['exeDate']);
	    }
	    if($task['dueDate']>0){
	        $task['dueDate']=date('Y-m-d',$task['dueDate']);
	    }
	    if ($task['repeatId'] > 0) {
	    	$repeat = $this->getTaskService()->loadRepeat($task['repeatId']);
	    }
	    if ($task['template'] > 0) {
	    	$repeat = $this->getTaskService()->loadRepeatByTaskId($task['template']);
	    }
	    if(isset($task['tag'])&&$task['tag']>0){
	    	$tag=$this->getTaskService()->loadTag($task['tag']);
	    	$tag_root=Config::get('files.tag_root');
	    	$tag['name']=$tag_root. $tag['name'];
	    	$tag['id']=$task['tag'];
	    }
	    $task['repeat']=$repeat;
	    $task['tagObj']=$tag;
	    $return = array(
	    		'task' => $task ,
	    		'repeat' => $repeat,
	    		'tag'=>$tag
	    );
	    return $this->setJsonData($return);
	}

    public function editAction () {
        
        if ($this->getRequest()->isPost()) {
        	$task['toFocusType']=$this->getRequest()->getPost('focusField');
        	if($task['toFocusType']=='inproject'){
        		unset($task['toFocusType']);
        		$task['parent']=$this->getRequest()->getPost('id');
        	}
            $task['_id'] = $this->getRequest()->getPost('taskId');
            $oldTask = $this->getTaskService()->load($task['_id']);
       		
         //   $task['parent']=$this->getRequest()->getPost('parent',$oldTask['parent']);
            $task['done']=$this->getRequest()->getPost('done','undefined');
            if($task['done']==='true'){
               $task['doneTime']=time();
               $this->getTaskService()->moveChildren($task['_id'], 'done');
            }else if($task['done']==='false'){
                if($oldTask['focusType']=='archived'){
                	return false;
                }
               $task['doneTime']=0;
               $this->getTaskService()->update(array('doneTime'=>0,'done'=>'false'), $oldTask['parent']);
            }else{
               unset($task['done']);
            }
            
            $task['title'] = $this->getRequest()->getPost('title', $oldTask['title']);
            $task['note'] = $this->getRequest()->getPost('note', $oldTask['note']);
            $task['exeDate'] = strtotime($this->getRequest()->getPost('exeDate', date("Y-m-d", $oldTask['exeDate'])));
            $task['dueDate']=strtotime($this->getRequest()->getPost('dueDate', date("Y-m-d", $oldTask['dueDate'])));
            $task['dueDate']=($task['dueDate']<0)?0:$task['dueDate'];
            $task['exeDate']=($task['exeDate']<0)?0:$task['exeDate'];
          	
            $repeat=$this->getRequest()->getPost('repeat');
            $filter=array('type','frequency','days');
         	if($repeat&&$repeat['edit_repeat']=='true'){
         	        require_once 'Juzi/Util/ArrayUtil.php';
       				$repeat = ArrayUtil::filterKeys($filter, $repeat);
       				if ($oldTask['repeatId'] > 0) {//是模板
       					$this->getTaskService()->updateRepeat($repeat, $oldTask['repeatId']);
       				} else if ($oldTask['template'] > 0) {//是实例
       					//   $this->getTaskService()->updateRepeatByTaskId($repeat, $oldTask['template']);
       				} else {//新建模板
       					$template=$task;
       					$template['userId']=$this->getUser()->id;
       					$template['instance']=$task['_id'];
       					$template['repeatId'] = (int) $this->getTaskService()->addRepeat($repeat);
       					unset($template['parent']);
       					unset($template['toFocusType']);
       					$template=$this->getTaskService()->createTemplate($template);
       				
       					$this->getTaskService()->updateRepeat(array(
       							'taskId' => $template['_id']
       					), $template['repeatId']);
       					$task['template'] = $template['_id'];
       				}
         	}
         	$tag=$this->getRequest()->getPost('tag');
         	if($tag&&$tag['edit_tag']=='true'){
         	    $data=$tag['img'];
         	    if($data=='null'){//删除tag
         	    	/* if(file_exists($_SERVER['TAG_FOLDER'].'/tag_'.$task['_id'].'.png')){
         	    		unlink($_SERVER['TAG_FOLDER'].'/tag_'.$task['_id'].'.png');
         	    	}
         	    	$this->getTaskService()->deleteTagByTaskId($task['_id']);
         	    	$task['tag']=0; */
         	        if($oldTask['tag']>0){
         	            $this->getTaskService()->deleteTag($oldTask['tag']);
         	            $task['tag']=0;
         	        }
         	    }else{
         	    	if($oldTask['tag']>0){
         	    	    $this->getTaskService()->updateTag($oldTask['tag'],$oldTask['_id'],$data);
         	    		//$this->getTaskService()->updateTagByTaskId($task['_id'],$data);
         	    	}else{
         	    		$task['tag']=$this->getTaskService()->addTag($task['_id'],$data);
         	    	}
         	    }
         	}

            $task=$this->getTaskService()->update($task, $task['_id']);
            
            $task['exeDate'] = ($task['exeDate']==0)?0:date("Y-m-d", $task['exeDate']);
            $task['doneDate']=(empty($task['doneTime']))?0:date("Y-m-d", $task['doneTime']);
            $task = array_merge($oldTask, $task);
            
            $this->setDueInfo($task);
            $this->setProjectInfo($task);
            $this->setStatus($task);
            
         	$task['json']=json_encode($this->filter($this->filterKeys,$task));
         	$this->view->item=$task;
         	$this->_helper->viewRenderer->setNoRender(false);
          /*    return $this->setJsonData(array(//TODO
                'task' => $task , 
                'template' => (! empty($template)) ? $template : null
            ));  */
        } 
    }

    public function destroyAction () {
      //  $taskIds = explode(',', $this->getRequest()->getPost('taskIds'));
        $this->getTaskService()->destroy();
    
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
        	$this->getTaskService()->archive($param);
    }

    /**
     * [GET] 根据ID获得task的信息
     * 
     * 参数:
     * id [*]
     */
    public function showAction () {
        
        $id = (int) $this->getRequest()->getQuery('id', 0);
        $task = $this->getTaskService()->load($id);
        if (empty($task)) {
            return $this->setEmptyObjectJsonData();
        }
        $task['exeDate'] = $task['exeDate'] == 0 ? 0 : date("Y-m-d", $task['exeDate']);
        $task['doneTime'] = $task['doneTime'] == 0 ? 0 : date('c', $task['doneTime']);
        return $this->setJsonData($task);
    }

    /**
     * [GET] 搜索tasks
     * 
     * 参数:
     * userId 该值为空时，列出所有用户的
     * done [*] 
     * page
     * perPage 
     */
    public function searchAction () {
        $page = (int) $this->getPageParam('page', 1);
        $done = $this->getRequest()->getQuery('done', 'true');
        $userId = (int) $this->getRequest()->getQuery('userId', 0);
        $perPage = (int) $this->getRequest()->getQuery('perPage', 100);
        
        if ($perPage > 100) {
            $perPage = 100;
        }
        
        $done == 'true' ? true : false;
        
        if (! empty($userId)) {
            $list = $this->getTaskService()->listByUserIdAndDone($userId, $done, ($page - 1) * $perPage, $perPage);
        } else {
            $list = $this->getTaskService()->listAllByDone($done, ($page - 1) * $perPage, $perPage);
        }
        
        $result = array();
        
        foreach ($list as $item) {
            $user = $this->getUserService()->load($item['userId']);
            $item['username'] = $user['username'];
            $item['exeMonth'] = date("m", $item['exeDate']);
            $item['exeDay'] = date("j", $item['exeDate']);
            $result[] = $item;
        }
        
        if (! empty($userId)) {
            $totalCount = $this->getTaskService()->countByUserIdAndDone($userId, $done);
        } else {
            $totalCount = $this->getTaskService()->countAllByDone($done);
        }
        
        $totalPage = ceil($totalCount / $perPage);
        if ($page > $totalPage) {
            $page = $totalPage;
        }
        
        $return = array(
            'data' => $result , 
            'totalPage' => $totalPage , 
            'currentPage' => $page
        );
        
        return $this->setJsonData($return);
    }


    private function getMessageService () {
        require_once 'Thingslife/User/Service/UserServiceFactory.php';
        return UserServiceFactory::getInstance()->createMessageService();
    }
}