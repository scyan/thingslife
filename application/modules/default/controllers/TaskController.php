<?php


require_once dirname(__FILE__) . '/BaseController.php';
require_once 'Thingslife/Util/config.php';
class TaskController extends Default_BaseController {

    public function init () {
        parent::init();
        $userId = $this->getUser()->id;
        $this->_helper->layout()->disableLayout();
      //  $this->view->countToday = $this->getTaskService()->countToday($userId);
    }
    public function showtemplateAction(){
    	 
    	$repeat =$tag= 0;
    	$task['_id'] = $this->getRequest()->getQuery('taskId');
    	$this->view->task=$task = $this->getTaskService()->load($task['_id']);
    	if ($task['repeatId'] > 0) {
    		$repeat = $this->getTaskService()->loadRepeat($task['repeatId']);
    	}
    	if ($task['template'] > 0) {
    		$repeat = $this->getTaskService()->loadRepeatByTaskId($task['template']);
    	}
    	if($repeat){
    		$repeat['typename']=$this->getRepeatName($repeat['type']);
    		$repeat['daysArr']=explode(',', $repeat['days']);
    		$this->view->repeat=$repeat;
    	}
    	if(isset($task['tag'])&&$task['tag']>0){
    		$tag=$this->getTaskService()->loadTag($task['tag']);
    		$tag_root=Config::get('files.tag_root');
    		$tag['name']=$tag_root. $tag['name'];
    		$this->view->tag=$tag;
    	}
    	if($task['exeDate']==0){
    		$this->view->date=date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));
    	}else{
    		$this->view->date=date('Y-m-d',$task['exeDate']);
    	}
    	//$this->view->tomorrow=date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));
    }
    private function getRepeatName($type){
    	switch($type){
    	    case 'weekly':
    	    	$typename='周';
    	    	break;
    	    case 'monthly':
    	    	$type='月';
    	    	break;
    	    case 'yearly':
    	    	$typename='年';
    	    	break;
    	    case 'daily':
    	    default:
    	    	$typename='日';
    	    	break;
    	}
    	return $typename;
    }
 /*   public function makeAction(){
	  $this->_helper->layout()->disableLayout();
      $this->_helper->viewRenderer->setNeverRender(true);
      $today = strtotime(date('Ymd'));
      $this->getTaskService()->createTaskFromRepeat($today);
   }
public function moveAction(){
	  $this->_helper->layout()->disableLayout();
      $this->_helper->viewRenderer->setNeverRender(true);
      $today = strtotime(date('Ymd'));
      $this->getTaskService()->moveToToday($today);
}
    public function indexAction () {
        $focus = $this->getRequest()->getParam('focus');
        $userId = $this->getUser()->id;
        if (empty($focus)) {
            $this->view->focus = 'focus';
        } else {
            $this->view->focus = $focus;
        }
    }

    public function doneAction () {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNeverRender(true);
        if ($this->getRequest()->isPost()) {
            $task = array();
            $task['taskId'] = $this->getRequest()->getPost('id');
            
            $this->getTaskService()->drag($task, 'done');
        }
    }

    public function editAction () {
        
        $this->view->focus = $this->getRequest()->getParam('focus');
        $this->view->taskId = $this->getRequest()->getParam('id');
    
    }

    
    public function newAction () {
        $focus = $this->getRequest()->getParam('focus');
        $this->view->focus = $focus;
        
    }

    public function deleteAction () {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNeverRender(true);
        
        $task['taskId'] = $this->getRequest()->getPost('task_id');
        $focus = $this->getRequest()->getPost('focus');
        if ($focus == 'deleted') {
            $this->getTaskService()->delete($task['taskId']);
        } else {
            $this->getTaskService()->drag($task, 'deleted');
        }
    

    }

    public function dragAction () {
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNeverRender(true);
        if ($this->getRequest()->isPost()) {
            $currentFocus = $this->getRequest()->getPost('currentFocus');
            $focus = $this->getRequest()->getPost('focus');
            
            if ($focus != $currentFocus) {
                $task['taskId'] = $this->getRequest()->getPost('task_id');
                $exeDate = $this->getRequest()->getPost('exeDate');
                $task['exeDate'] = strtotime($exeDate);
                
                $this->getTaskService()->drag($task, $focus);
            }
        }
    }
 */
    private function getTaskService () {
        require_once 'Thingslife/Task/Service/TaskServiceFactory.php';
        return TaskServiceFactory::getInstance()->createTaskService();
    }
}

