<?php

require_once dirname(__FILE__) . '/BaseController.php';
require_once 'Thingslife/Util/config.php';
class MeController extends Default_BaseController {
	const PAGE_SIZE=50;
    public function init () {
        parent::init();
        $this->view->mode='me';
    }
     public function createtaskAction(){
        if($_SERVER["REMOTE_ADDR"]!='127.0.0.1'){
        	return;
        }
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
    	$this->getTaskService()->createTaskFromRepeat();
    }
    public function movetotodayAction(){
        if($_SERVER["REMOTE_ADDR"]!='127.0.0.1'){
        	return;
        }
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $this->getTaskService()->moveToToday();
    } 
    private $taskList=array(
        'inbox'=>'listInbox',
    	'today'=>'listToday',
        'next'=>'listNext',
        'someday'=>'listSomeday',
        'schedule'=>'listSchedule',
        'project'=>'listProject',
        'inproject'=>'listSubTasks',
        'archived'=>'listArchived',
        'deleted'=>'listDeleted',    
    );
    
    public function indexAction () {
        $this->view->tagRoot=Config::get('files.tag_root');
        $this->view->tomorrow=date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));
        
        $this->_helper->layout()->setLayout('layout3');
    }
    public function headAction(){
        $this->view->userName = $this->getUser()->username;
        $this->view->messages = $this->getMessageService()->countUnRead($this->getUser()->id);
    }
    public function sidebarAction(){
        $this->_helper->layout()->disableLayout();
        $userId = $this->getUser()->id;
        $this->view->focusField=$this->getRequest()->getQuery('focusField','today');
        $this->view->id=$this->getRequest()->getQuery('id','');
        $this->view->projects=$projects = $this->getTaskService()->listActiveProject($userId);
        
        $userId = $this->getUser()->id;
        $counts=$this->getTaskService()->count_inbox_and_today($userId);
         $this->view->counter=$counter = array(
        		'todayDue' => $counts['todayDue'] ,
        		'todayTodo' => $counts['today']-$counts['todayDue'] ,
        		'inboxDue' => $counts['inboxDue'] ,
        		'inboxTodo' => $counts['inbox']-$counts['inboxDue']
        ); 
    }
    public function toolbarAction(){
        $this->_helper->layout()->disableLayout();
        $focusField=$this->view->focusField=$this->getRequest()->getQuery('focusField','today');
        $page=$this->getRequest()->getQuery('page',1);
        $parent=$this->getRequest()->getQuery('id','');
        $userId = $this->getUser()->id;
        $param=array('userId'=>$userId,
            'done'=>'true',
            );
        $totalParam=array('userId'=>$userId);
        if(!empty($parent)){
        	$param['parent']=$parent;
        	$totalParam['parent']=$parent;
        }
        $totalList=call_user_func_array(array($this->getTaskService(),$this->taskList[$focusField]),array($totalParam));
        $total=count($totalList);
        $totalPage=ceil($total/self::PAGE_SIZE);
        if($focusField=='archived'){
        	$t=array($param,($page-1)*self::PAGE_SIZE,self::PAGE_SIZE);
        	$this->view->curPage=$page;
        	$this->view->prePage=$page<=1?1:($page-1);
        	$this->view->nextPage=$page>=$totalPage?$totalPage:($page+1);
        	$this->view->totalPage=$totalPage;
        }else{
        	$t=array($param);
        }
        $list=call_user_func_array(array($this->getTaskService(),$this->taskList[$focusField]),$t);
        $this->view->doneCount=count($list);
    }
    public function inboxAction(){
        $this->_helper->layout()->disableLayout();
        $this->view->focusField='inbox';
        $userId = $this->getUser()->id;
        $taskList = $this->getTaskService()->listInbox(array('userId'=>$userId));
        $this->view->list=array();
        $parents=array();
        foreach($taskList as $key=>$value){
            if(!$this->filterInactive($value, $parents)){
            	continue;
            }
        	$this->setDueInfo($value);
        	$this->setProjectInfo($value);
        	$this->setDoneInfo($value);
        	//$this->setRepeatInfo($value);
        	if(!empty($value['parent'])){
        		$value['parent']=$this->filter(array('_id','title'),$parents[$value['parent']]);
        	}
        	$value['json']=json_encode($this->filter($this->filterKeys,$value));
        	$this->view->list[]=$value;
        }
    }
    public function todayAction(){
        $this->_helper->layout()->disableLayout();
        $this->view->focusField='today';
        $userId = $this->getUser()->id;
        $taskList = $this->getTaskService()->listToday(array('userId'=>$userId));
        $this->view->list=array();
        $parents=array();
        foreach($taskList as $key=>$value){
             if(!$this->filterInactive($value, $parents)){
            	continue;
            } 
        	$this->setDueInfo($value);
        	$this->setProjectInfo($value);
        	$this->setDoneInfo($value);
        	//$this->setRepeatInfo($value);
        	if(!empty($value['parent'])){
        	    $value['parent']=$this->filter(array('_id','title'),$parents[$value['parent']]);
        	}
        	$value['json']=json_encode($this->filter($this->filterKeys,$value));
        	$this->view->list[]=$value;
        }
     //   $this->view->task=$this->view->render('me/task.phtml');
    }
  	public function nextAction(){
  	    $this->_helper->layout()->disableLayout();
  	    $this->view->focusField='next';
  	    $userId = $this->getUser()->id;
  	    $taskList = $this->getTaskService()->listNext(array('userId'=>$userId));
  	    $this->view->list=array();

  	    $this->view->projectLists=array();
  	    $parents=array();
  	    foreach($taskList as $key=>$value){
  	    	if(!$this->filterInactive($value, $parents)){
            	continue;
            }
  	    	$this->setDueInfo($value);
  	    	$this->setProjectInfo($value);
  	    	$this->setDoneInfo($value);
  	    //	$this->setRepeatInfo($value);
  	    	$value['json']=json_encode($this->filter($this->filterKeys,$value));
  	    	
  	    	if(!empty($value['parent'])){
  	    	    if(!isset( $this->view->projectLists[$value['parent']])){
  	    	        $this->view->projectLists[$value['parent']]=array();
  	    	        $this->view->projectLists[$value['parent']]['info']=$this->filter(array('_id','title'),$parents[$value['parent']]);
  	    	        $this->view->projectLists[$value['parent']]['list']=array();
  	    	    }
  	    	    $this->view->projectLists[$value['parent']]['list'][]=$value;
  	    	}else{
  	    		$this->view->list[]=$value;
  	    	}
  	    }
  	}
  	
  	public function scheduleAction(){
  	    $this->_helper->layout()->disableLayout();
  	    $this->view->focusField='schedule';
  	    $userId = $this->getUser()->id;
  	    $taskList = $this->getTaskService()->listSchedule(array('userId'=>$userId));
  	    $this->view->templates=array();
  	    $this->view->lists=array();
  	    $this->view->projectLists=array();
  	    $parents=array();
  	 	foreach($taskList as $key=>$value){
  	 		if(!$this->filterInactive($value, $parents)){
            	continue;
            }
            if(!empty($value['parent'])){
            	$value['parent']=$this->filter(array('_id','title'),$parents[$value['parent']]);
            }
  	    	$this->setDueInfo($value);
  	    	$this->setProjectInfo($value);
  	    	$this->setDoneInfo($value);
  	    //	$this->setRepeatInfo($value);
  	    	$value['json']=json_encode($this->filter($this->filterKeys,$value));
  	    	if(empty($value['repeatId'])){
  	    	  //  $exeDate=date('Y-m-d',$value['exeDate']);
  	    	  $exeDate=$value['exeDate'];
  	    	    if(!isset( $this->view->lists[$exeDate])){
  	    	        $this->view->lists[$exeDate]=array();
  	    	    }
  	    	    $this->view->lists[$exeDate][]=$value;
  	    	}else{
  	    		$this->view->templates[]=$value;
  	    	}
  	    }
  	}
  	public function somedayAction(){
  	    $this->_helper->layout()->disableLayout();
  	 	$this->view->focusField='someday';
  	    $userId = $this->getUser()->id;
  	    $taskList = $this->getTaskService()->listSomeday(array('userId'=>$userId));
  	    $this->view->list=array();
  	    $this->view->projectList=array();
  	    $parents=array();
  	    foreach($taskList as $key=>$value){
  	        if(!$this->filterInactive($value, $parents)){
  	        	continue;
  	        }
  	    	$this->setDueInfo($value);
  	    	$this->setProjectInfo($value);
  	    	$this->setDoneInfo($value);
  	    //	$this->setRepeatInfo($value);
  	    	$value['json']=json_encode($this->filter($this->filterKeys,$value));
  	    	if(!empty($value['parent'])){
  	    	    if(!isset( $this->view->projectList[$value['parent']])){
  	    	        $this->view->projectList[$value['parent']]=array();
  	    	        $this->view->projectList[$value['parent']]['info']=$this->filter(array('_id','title'), $parents[$value['parent']]);
  	    	        $this->view->projectList[$value['parent']]['list']=array();
  	    	    }
  	    	    $this->view->projectList[$value['parent']]['list'][]=$value;
  	    	}else{
  	    		$this->view->list[]=$value;
  	    	}
  	    }
  	}
  	public function deletedAction(){
  	    $this->_helper->layout()->disableLayout();
  	    $this->view->focusField='deleted';
  	    $userId = $this->getUser()->id;
  	    $taskList = $this->getTaskService()->listDeleted(array('userId'=>$userId));
  	    $this->view->list=array();
  	    $this->view->projectLists=array();
  	    $parents=array();
  	    foreach($taskList as $key=>$value){
  	        if(!$this->filterInactive($value, $parents)){
  	        	continue;
  	        }
  	        $this->setDueInfo($value);
  	        $this->setProjectInfo($value);
  	        $this->setDoneInfo($value);
  	     //   $this->setRepeatInfo($value);
  	        $value['json']=json_encode($this->filter($this->filterKeys,$value));
  	        if(!empty($value['parent'])){
  	        	if(!isset( $this->view->projectList[$value['parent']])){
  	        		$this->view->projectLists[$value['parent']]=array();
  	        		$this->view->projectLists[$value['parent']]['info']=$this->filter(array('_id','title'),$parents[$value['parent']]);
  	        		$this->view->projectLists[$value['parent']]['list']=array();
  	        	}
  	        	$this->view->projectLists[$value['parent']]['list'][]=$value;
  	        }else{
  	        	$this->view->list[]=$value;
  	        }
  	    }
  	}
  	public function projectAction(){
  	    $this->_helper->layout()->disableLayout();
  	    $this->view->focusField='project';
  	    $userId = $this->getUser()->id;
  	    $taskList = $this->getTaskService()->listProject(array('userId'=>$userId));
  	    $this->view->list=array();
  	    $this->view->scheduleLists=array();
  	    $this->view->somedayList=array();
  	    foreach ($taskList as $key=>$value){
  	        $this->setDueInfo($value);
  	        $this->setStatus($value);
  	     	$this->setProjectInfo($value);
  	     	$this->setDoneInfo($value);
  	     //	$this->setRepeatInfo($value);
  	     	$value['json']=json_encode($this->filter($this->filterKeys,$value));
  	        if($value['isActive']){
  	            $this->view->list[]=$value;
  	        }else if($value['focusType']=='schedule'){
  	         //   $exeDate=date('Y-m-d',$value['exeDate']);
  	            $exeDate=$value['exeDate'];
  	        	if(!isset($this->view->scheduleLists[$exeDate])){
  	        	    $this->view->scheduleLists[$exeDate]=array();
  	        	}
  	        	$this->view->scheduleLists[$exeDate][]=$value;
  	        }else if($value['focusType']=='someday'){
  	            $this->view->somedayList[]=$value;
  	        }
  	    }
  	}
  	public function inprojectAction(){
  	    $this->_helper->layout()->disableLayout();
  	    $userId = $this->getUser()->id;
  		$projectId=$this->getRequest()->getQuery('id');
  		$this->view->focusField='inproject';
  		$this->view->project=$this->getTaskService()->load_by_id_and_uid($projectId,$userId);
  		$this->setDueInfo($this->view->project);
  		$this->setStatus($this->view->project);
  		$this->setDoneInfo($this->view->project);
  		$this->setTag($this->view->project);
  		$this->view->projectJson=json_encode($this->view->project);
  		$taskList = $this->getTaskService()->listSubTasks(array('userId'=>$userId,'parent'=>$projectId));
  		$this->view->defaultList=array();
  		$this->view->scheduleLists=array();
  		$this->view->somedayList=array();
  		$this->view->archivedList=array();
  		$this->view->deletedList=array();
  		foreach ($taskList as $key=>$value){
  		    $this->setDueInfo($value);
  		    $this->setStatus($value);
  		//    $this->setProjectInfo($value);
  		    $this->setDoneInfo($value);
  		 //   $this->setRepeatInfo($value);
  		 $value['parent']=$this->view->project;
  		    $value['json']=json_encode($this->filter($this->filterKeys,$value));
  		    if($value['isActive']){
  	            $this->view->defaultList[]=$value;
  		    }else if($value['focusType']=='schedule'){
  		        $exeDate=$value['exeDate'];
  		    	if(!isset($this->view->scheduleLists[$exeDate])){
  		    	    $this->view->scheduleLists[$exeDate]=array();
  		    	}
  		    	$this->view->scheduleLists[$exeDate][]=$value;
  		    }else if($value['focusType']=='someday'){
  		        $this->view->somedayList[]=$value;
  		    }else if($value['focusType']=='archived'){
  		        $this->view->archivedList[]=$value;
  		    }else if($value['focusType']=='deleted'){
  		    	if($this->view->project['focusType']=='deleted'){
  		        	$this->view->deletedList[]=$value;
  		    	}
  		    }
  		}
  		
  	}
  	public function archivedAction(){
  	    $this->_helper->layout()->disableLayout();
  	    $page = (int) $this->getRequest()->getQuery('page', 1);
  	  //  $perPage = (int) $this->getRequest()->getQuery('perPage', 2);
  	    $this->view->focusField='archived';
  	    
  	    $userId = $this->getUser()->id;
  	    $taskList = $this->getTaskService()->listArchived(array('userId'=>$userId),($page - 1) * self::PAGE_SIZE, self::PAGE_SIZE);
  	    $this->view->lists=array();
  	    $parents=array();
  	    foreach($taskList as $key=>$value){
  	        if(!$this->filterInactive($value, $parents)){
  	        	continue;
  	        }
  	        if(!empty($value['parent'])){
  	        	$value['parent']=$this->filter(array('_id','title'),$parents[$value['parent']]);
  	        }
  	    	$this->setDueInfo($value);
  	    	$this->setProjectInfo($value);
  	    	$this->setDoneInfo($value);
  	    //	$this->setRepeatInfo($value);
  	    	$value['json']=json_encode($this->filter($this->filterKeys,$value));
  	    	$doneDate=$value['doneTime'];
  	    	if(!isset($this->view->lists[$doneDate])){
  	    	    $this->view->lists[$doneDate]=array();
  	    	}
  	    	$this->view->lists[$doneDate][]=$value;
  	    }
  	}

 
    public function newAction(){
    	 $this->view->test='ttt';
         $this->_helper->layout()->disableLayout();
    	 $this->render();
    
    }
  
}