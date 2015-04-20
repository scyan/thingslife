<?php
require_once ('Thingslife/Task/Service/ITaskService.php');
require_once ('Thingslife/Common/BaseService.php');
require_once 'Thingslife/Task/Dao/TaskDaoFactory.php';

/**
添加任务，标题栏，增加“回车"，就完成添加的功能，并提示“任务添加成功，请继续!"!
 * 
 任务移动到箱子上方时，显示“hover"状态。
 * 对title, note,转义后输出

任务完成时，更新doneTime.
 * 通过getUser()，获取用户信息
 * 
 * 
 * @author wellming
 *
 */

class TaskServiceImpl extends BaseService implements ITaskService {
	private $templateFields=array(
	    'userId',
	    'title',
	    'note',
	    'focus',
	    'createdTime',
	    'repeatId',
	    'instance',
	    'focusType',
	    'tag',
	    'sound',
	    );
	private $repeatFields=array('type','frequency','days');
	public function create($fields) {
		//TODO 考虑project时		
		//$fields ['createdTime'] = time ();
		if ($fields ['focusType'] == 'project') {
			$fields ['focusType'] = 'next';
			$fields ['focus'] = 'next';
			$fields ['focusLevel'] = 1;
		} else if ($fields ['focusType'] == 'today') {
			$fields ['focus'] = 'next';
		} else {
			$fields ['focus'] = $fields ['focusType'];
		}
		$fields['_id'] = $this->getTaskDao ()->add ( $fields );
		if(!$fields['_id']){
			return false;
		}
		return $fields;
	}
	public function createTemplate(array $fields){
	    $fields=ArrayUtil::filterKeys($this->templateFields, $fields);
        $fields['focusType'] = 'schedule';
       /* 	if(isset($fields['tag'])){
           $newTagName=md5($fields['userId'].'template'.time().rand()).'.png';
           $tag_floder=$_SERVER['TAG_FOLDER'];
           $flag=copy($tag_floder.$fields['tag'], $tag_floder.$newTagName);
           if($flag){
           	$fields['tag']=$newTagName;
           }
       } */
         return $this->create($fields);
	}

	public function archive(array $conditions){
	    if(!isset($conditions['userId'])){
	    	return false;
	    }
	    $conditions['done']='true';
	   return  $this->getTaskDao()->multiUpdate(array('focusType'=>'archived','focus'=>'archived'),$conditions);
	}
	public function update_by_taskid_and_uid(array $fields, $taskId,$uid){
	    if(!$taskId||!$uid){
	    	return;
	    }
	    if(! empty ( $fields ['toFocusType'] )) {
	    	$focusType=$fields ['toFocusType'];
	    	$fields['_id']=$taskId;
	    	unset($fields['toFocusType']);
	    	$this->moveToFocusType ( $focusType, $fields);
	    	unset($fields['_id']);
	    	$taskId=$this->getTaskDao ()->update_by_id_and_uid ( $fields, $taskId,$uid );
	    }else{
	    	unset($fields['toFocusType']);
	    	$taskId=$this->getTaskDao ()->update_by_id_and_uid ( $fields, $taskId,$uid );
	    }
	    if($taskId===false){
	    	return false;
	    }
	    return $fields;
	}
	public function update_by_params(array $fields,array $params){
		return $this->getTaskDao()->multiUpdate($fields,$params);
	}
	public function update(array $fields, $taskId) {
	    if(!$taskId||!$uid){
	    	return;
	    }
		if(! empty ( $fields ['toFocusType'] )) {
			$focusType=$fields ['toFocusType'];
			$fields['_id']=$taskId;
			unset($fields['toFocusType']);
			$this->getTaskDao ()->update_by_id_and_uid ( $fields, $taskId,$uid );
			$fields=$this->moveToFocusType ( $focusType, $fields);
		}else{
			unset($fields['toFocusType']);
		    $this->getTaskDao ()->update_by_id_and_uid ( $fields, $taskId,$uid );
		}
		return $fields;
	}
 	public function isDue($task){
		if($task['dueDate']>0&&$task['dueDate']<=strtotime(date("Ymd"))){
		    return true;
		}
		return false;
	} 
	public function activeChildren($taskId){
	   return $this->getTaskDao()->multiUpdate(array('`show`'=>1),array('parent'=>$taskId));
	}


	public function moveToFocusType($focusType, &$fields) {

		//TODO 考虑projects时
		switch ($focusType) {
			case 'inbox' :
				$fields ['exeDate'] = null;
				$fields ['focus'] = $fields ['focusType'] = $focusType;
				$fields ['parent'] = 0;
				break;
			case 'next' :
			case 'today' :
				$fields ['exeDate'] = null;
				$fields ['focusType'] = $focusType;
				$fields ['focus'] = 'next';
				//TODO move children to show
				$this->getTaskDao()->multiUpdate(array('`show`'=>1),array('`parent`'=>$fields['_id']));
				//TODO move parent to active
			//	$this->getTaskDao()->update(array('focus'=>'next'),$fields['parent']);
				break;
			case 'schedule' :
				$fields['focus']=$fields ['focusType'] = $focusType;
				//TODO hide children
				$this->getTaskDao()->multiUpdate(array('`show`'=>0),array('`parent`'=>$fields['_id']));
				break;
			case 'someday' :
				$fields ['exeDate'] = null;
				$fields['focus']=$fields ['focusType'] = $focusType;
				//TODO move children hide
				$this->getTaskDao()->multiUpdate(array('`show`'=>0),array('`parent`'=>$fields['_id']));
				break;
			case 'archived' :
				$fields ['exeDate'] = null;				
				$fields ['focus'] = $fields ['focusType'] = $focusType;
				//TODO move children hide
				$this->getTaskDao()->multiUpdate(array('`show`'=>0),array('`parent`'=>$fields['_id']));
				break;
			case 'project' :
				//$fields['exeDate']=0;
				//$fields ['focusType'] = 'next';
				$fields ['focus'] =$fields ['focusType']= 'next';
				$fields ['focusLevel'] = 1;
				break;
			case 'deleted' :
				$fields['exeDate']=null;
			//	$fields['parent']=0;
				$fields ['focus'] = $fields ['focusType'] = $focusType;
				//TODO children deleted hide
				$this->getTaskDao()->multiUpdate(array('`show`'=>0,'focus'=>'deleted','focusType'=>'deleted'),array('`parent`'=>$fields['_id']));
				/* if ($fields ['repeatId'] > 0) {
					$this->deleteRepeat ( $task ['repeatId'] );
				} */
				break;
			default :
				break;
		}
	}

 	public function destroy($uid,$ids=array()){
 	    if(!$uid){
 	    	return false;
 	    }
		return $this->getTaskDao ()->delete_by_ids_and_uid($uid,$ids);
	} 
	public function load_by_id_and_uid($id,$uid){
	    return $this->getTaskDao ()->load_by_id_and_uid ( $id,$uid );
	}
	public function load($id) {
		return $this->getTaskDao ()->load ( $id );
	}
	
	public function countChildren($taskId){
    	return $this->getTaskDao()->count_children($taskId);
	}

	public function count_inbox_and_today($userId){
	    return $this->getTaskDao()->count_inbox_and_today($userId);
	}
	public function countToday($userId,$isDue=false) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		$builder->fields ( array ('count(*)' ) );
		$builder->condition ( 'userId', $userId );
		$builder->condition ( 'focus', 'next' );
		$builder->condition ( 'focusType', 'today' );
		$builder->condition ( 'done', 'false' );
		$total=intval ($builder->execute ()->fetchColumn ());
		$builder->condition('dueDate',0,'>');
		$builder->condition('dueDate',strtotime(date("Ymd")),'<=');
		$due=intval ($builder->execute ()->fetchColumn ());
		if($isDue==true){
		  return $due;
		}else{
		  return $total-$due;
		}
	}


    public function listActiveProject($userId,array $conditions=array()){
        $builder=$this->getTaskDao()->queryBuilder();
        $builder->condition('userId',$userId);
        $builder->condition('focus','next');
        $builder->condition('focusLevel',1);
        if($conditions){
        	foreach ($conditions as $key=>$value){
        		$builder->condition($key,$value);
        	}
        }
        $builder->orderBy('createdTime','DESC');
        return $builder->execute()->fetchAll();
    }
	
    public function listSubTasks(array $conditions=array()){
	    $builder=$this->getTaskDao()->queryBuilder();
	    if(!isset($conditions['userId'])||!isset($conditions['parent'])){
	    	return array();
	    }
/* 	    $builder->condition('userId',$userId);
	    $builder->condition('parent',$projectId); */
	    if($conditions){
	    	foreach ($conditions as $key=>$value){
	    		$builder->condition($key,$value);
	    	}
	    }
	    $builder->orderBy ( 'createdTime' );
	    return $builder->execute ()->fetchAll ();
	}

	public function listToday(array $conditions=array()) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		if(!isset($conditions['userId'])){
			return array();
		}
		$builder->condition ( 'focus', 'next' );
		$builder->condition ( 'focusType', 'today' );
		$builder->condition ( '`show`', 1);
		$builder->condition ( 'focusLevel', 1,'<>');
		if($conditions){
			foreach ($conditions as $key=>$value){
			    $builder->condition($key,$value);
			}
		}
		$builder->orderBy ( 'createdTime' );
		return $builder->execute ()->fetchAll ();
	}
	public function listNext(array $conditions=array()){
	    $builder = $this->getTaskDao ()->queryBuilder ();
	    if(!isset($conditions['userId'])){
	    	return array();
	    }
		$builder->condition ( 'focus', 'next' );
		$builder->condition ( '`show`', 1);
		$builder->condition ( 'focusLevel', 1,'<>');
		
		if($conditions){
			foreach ($conditions as $key=>$value){
				$builder->condition($key,$value);
			}
		}
		$builder->orderBy ( 'createdTime' );
		return $builder->execute ()->fetchAll ();
	}
	public function listSchedule(array $conditions=array()) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		 if(!isset($conditions['userId'])){
			return array();
		}
		$builder->condition ( 'focus', 'schedule' );
		$builder->condition ( '`show`', 1);
		//$builder->condition ( 'repeatId', 0 );
		if($conditions){
			foreach ($conditions as $key=>$value){
				$builder->condition($key,$value);
			}
		}
		$builder->orderBy ( 'exeDate' );
		
		return $builder->execute ()->fetchAll ();
	}
	
	
	
	public function listInbox(array $conditions=array()) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		 if(!isset($conditions['userId'])){
			return array();
		}
		$builder->condition ( 'focus', 'inbox' );
		$builder->condition ( '`show`', 1);
		if($conditions){
			foreach ($conditions as $key=>$value){
				$builder->condition($key,$value);
			}
		}
		$builder->orderBy ( 'createdTime' );
		return $builder->execute ()->fetchAll ();
	}
	
	public function listSomeday(array $conditions=array()) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		 if(!isset($conditions['userId'])){
			return array();
		}
		$builder->condition ( 'focus', 'someday' );
		$builder->condition ( '`show`', 1);
		if($conditions){
			foreach ($conditions as $key=>$value){
				$builder->condition($key,$value);
			}
		}
		$builder->orderBy ( 'createdTime' );
		return $builder->execute ()->fetchAll ();
	}
	public function listProject(array $conditions=array()){
	    $builder = $this->getTaskDao ()->queryBuilder ();
	     if(!isset($conditions['userId'])){
	    	return array();
	    }
	    $builder->condition('focusLevel',1);
	    if($conditions){
	    	foreach ($conditions as $key=>$value){
	    		$builder->condition($key,$value);
	    	}
	    }
	    $builder->orderBy ( 'createdTime' );
	    return $builder->execute ()->fetchAll ();
	}
	
	public function listArchived(array $conditions=array(),$offset=0,$limit=null) {
	/*     var_dump($offset);
	    var_dump($limit); */
		$builder = $this->getTaskDao ()->queryBuilder ();
		 if(!isset($conditions['userId'])){
			return array();
		}
		$builder->condition ( 'focus', 'archived' );
		$builder->condition ( '`show`', 1);
		if($conditions){
			foreach ($conditions as $key=>$value){
				$builder->condition($key,$value);
			}
		}
		$builder->orderBy ( 'doneTime', 'DESC' );
		if($limit){
			
		$builder->range ( $offset, $limit );
		}
		return $builder->execute ()->fetchAll ();
	}
	public function listDeleted(array $conditions=array()) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		 if(!isset($conditions['userId'])){
			return array();
		}
		$builder->condition ( 'focus', 'deleted' );
		$builder->condition ( '`show`', 1);
		if($conditions){
			foreach ($conditions as $key=>$value){
				$builder->condition($key,$value);
			}
		}
		return $builder->execute ()->fetchAll ();
	}
	public function listComments($taskId) {
		$builder = $this->getCommentsDao ()->queryBuilder ();
		$builder->condition ( 'taskId', $taskId );
		return $builder->execute ()->fetchAll ();
	}
	public function addRepeat(array $fields) {
	    $fields = ArrayUtil::filterKeys($this->repeatFields, $fields);
       // $fields['next'] = $this->getNext($fields['days'],$fields['frequency'],null);
        $days = explode(',', $fields['days']);
        if(!$fields['frequency']||$fields['type']!='weekly'||empty($days)){
        	return false;
        }
        sort($days);
        $fields['days'] = implode(',', $days);
		return $this->getRepeatDao ()->add ( $fields );
	}
	
	public function updateRepeat(array $fields, $id) {
	    if(!$id){
	    	return false;
	    }
	    $fields = ArrayUtil::filterKeys($this->repeatFields, $fields);
		if(!empty($fields['days'])){
		   $fields['next'] = $this->getNext($fields['days'],$fields['frequency'],null);
		   $days = explode(',', $fields['days']);
           sort($days);
           $fields['days'] = implode(',', $days);
		}
		return $this->getRepeatDao ()->update ( $fields, $id );
	}
	
    public function updateRepeatByTaskId(array $fields, $taskId) {
    	if(!empty($fields['days'])&&!empty($fields['frequency'])){
		   $fields['next'] = $this->getNext($fields['days'],$fields['frequency'],null);
		   $days = explode(',', $fields['days']);
           sort($days);
           $fields['days'] = implode(',', $days);
		}
		return $this->getRepeatDao ()->updateByTaskId ( $fields, $taskId );
	}
	
	public function loadRepeat($id) {
		return $this->getRepeatDao ()->load ( $id );
	}
	
	public function loadRepeatByTaskId($taskId) {
		return $this->getRepeatDao ()->loadByTaskId ( $taskId );
	}
	//上传tag
	public function saveTagFile($userId,$data){
	    $data=base64_decode($data);
	    $im = imagecreatefromstring($data);
	    $name=md5($userId.time().rand()).'.png';
	    if ($im !== false) {
	    	header('Content-Type: image/png');
	    	//TODO notice 修改tag name表示方式
	    	// imagepng($im,$_SERVER['TAG_FOLDER'].'tag_'.$taskId.'.png');
	    	if(!is_dir($_SERVER['TMP_TAG_FOLDER'])){
	    		$mkRes=mkdir($_SERVER['TMP_TAG_FOLDER'],0777,true);
	    		if(!$mkRes){
	    			return false;
	    		}
	    	}
	    	imagepng($im,$_SERVER['TMP_TAG_FOLDER'].$name);
	    	imagedestroy($im);
	    	return array('path'=>Config::get('files.tmp_tag_root').$name,'name'=>$name);
	    }else{
	    	return false;
	    }
	}
	//将tag从temp文件夹移动到正式文件夹
	public function moveTagFile($name){
	    if(!is_dir($_SERVER['TAG_FOLDER'])){
	    	$mkRes=mkdir($_SERVER['TAG_FOLDER'],0777,true);
	    	if(!$mkRes){
	    		return false;
	    	}
	    }
	    if(file_exists($_SERVER['TMP_TAG_FOLDER'].$name)){
	    	return rename($_SERVER['TMP_TAG_FOLDER'].$name, $_SERVER['TAG_FOLDER'].$name);
	    }
	    return false;
	}
	
	public function deleteTagFile($name){
		if(file_exists($_SERVER['TAG_FOLDER'].$name)){
		    return unlink($_SERVER['TAG_FOLDER'].$name);
		}
		return false;
	}


	public function deleteRepeat($id) {
		return $this->getRepeatDao ()->delete ( $id );
	}
	
	public function listMultitasks($userId, $offset, $limit) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		if ($userId > 0) {
			$builder->condition ( 'userId', $userId );
		}
		$builder->condition ( 'done', 'true' );
		$builder->condition ( 'focus', 'deleted', '<>' );
		$builder->condition ( 'focusLevel', 0 );
		$builder->orderBy ( 'doneTime', 'DESC' );
		$builder->range ( $offset, $limit );
		return $builder->execute ()->fetchAll ();
	}
	public function countMultitasks($userId) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		if ($userId > 0) {
			$builder->condition ( 'userId', $userId );
		}
		$builder->condition ( 'done', 'true' );
		$builder->condition ( 'focus', 'deleted', '<>' );
		$builder->fields ( array ('count(*)' ) );
		return intval ( $builder->execute ()->fetchColumn () );
	}


	
	public function addComment(array $fields) {
		$fields ['content'] = htmlspecialchars ( $fields ['content'] );
		$id = $this->getCommentsDao ()->add ( $fields );
		$this->getTaskDao ()->wave ( array ('comments' => 1 ), $fields ['taskId'] );
		return $id;
	}
	public function loadComment($id) {
		return $this->getCommentsDao ()->load ( $id );
	}
	public function listCommentsByTaskId($taskId, $offset = 0, $limit = 30) {
		return $this->getCommentsDao ()->listByTaskId ( $taskId, $offset, $limit );
	}
	
	public function countCommentsByTaskId($taskId) {
		return $this->getCommentsDao ()->countByTaskId ( $taskId );
	}
	public function createInstance($repeat){
	    $templateId = $repeat ['template_id'];
	    $repeatId=$repeat['repeatId'];
	    $task=array();
	    $task['title']=$repeat['title'];
	    $task['note']=$repeat['note'];
	    $task['focusType']='today';
	    $task['focus']='next';
	    $task['userId']=$repeat['userId'];
	    if($repeat['tag']){
	    	$newTagName=md5($repeat['userId'].$templateId.time().rand()).'.png';
	    	$tag_floder=$_SERVER['TAG_FOLDER'];
	    	$flag=copy($tag_floder.$repeat['tag'], $tag_floder.$newTagName);
	    	if($flag){
	    		$task['tag']=$newTagName;
	    	}
	    }
	    return $this->getTaskDao()->createInstance($task,$templateId,$repeatId);
	}
	public function createTaskFromRepeat() {
		$result=$this->getTaskDao()->list_templates();
		foreach ( $result as $repeat ) {
		    $days=$repeat['days'];
		    $type=$repeat['type'];
		    if($type=='weekly'){
		    	$days=explode(',',$days);
		    	foreach($days as $day){
		    		if($day==date('N')){
		    		 //   if(strtotime($repeat['executeTime'])!=$today){
		    		    	//TODO create task 
		    		    	echo $this->createInstance($repeat);
		    		    	break;
		    		   // }
		    		}
		    	}
		    }
		
		}
	}
	public function moveToToday() {
	   echo $this->getTaskDao()->move_to_today();
	}
	
	public function getNext($days,$frequency,$start) {
		if(!empty($start)){
		  $next=$start;
		}else{
		  $next = mktime ( 0, 0, 0, date ( "m" ), date ( "d" ) + 1, date ( "Y" ) );
		}
		
		while ( strpos ( $days, date ( "N", $next ) ) === false ) {
			$next += 24 * 3600;
		}
		if($frequency==1){
		  return $next;
		}
		else{
		  $next += 24 * 3600;
		  return $this->getNext($days,$frequency-1,$next);
		}
	}
	
	private function getTaskDao() {
		return TaskDaoFactory::getInstance ()->createTaskDao ();
	}
	
	private function getCommentsDao() {
		return TaskDaoFactory::getInstance ()->createCommentsDao ();
	}
	
	private function getRepeatDao() {
		return TaskDaoFactory::getInstance ()->createRepeatDao ();
	}
	

}
