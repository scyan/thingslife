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
	
	public function create($fields) {
		//TODO 考虑project时		
		$fields ['createdTime'] = time ();
		//$fields['focus']=($fields['focusType']=='today')?'next':$fields['focusType'];
		//$fields['focusLevel']=($fields['focusType']=='project')?1:0;
		if ($fields ['focusType'] == 'project') {
			$fields ['focusType'] = 'next';
			$fields ['focus'] = 'active';
			$fields ['focusLevel'] = 1;
		} else if ($fields ['focusType'] == 'today') {
			$fields ['focus'] = 'next';
		} else {
			$fields ['focus'] = $fields ['focusType'];
		}
		
		if ($fields ['focusType'] == 'archived') {
			$fields ['doneTime'] = time ();
			$fields ['done'] = 'true';
		}
		$fields ['exeDate'] = ($fields ['focus'] == 'schedule') ? strtotime ( $fields ['exeDate'] ) : 0;
		$fields ['dueDate'] = ($fields ['dueDate'] == 0)?0:strtotime ( $fields ['dueDate'] );
		$fields['_id'] = $this->getTaskDao ()->add ( $fields );
		return $fields;
	}
	public function createTemplate(array $fields){
		 if(!empty($fields['_id'])){
		   unset($fields['_id']);
		 }
	     $fields['exeDate'] = 0;
         $fields['dueDate'] = 0;
         $fields['focusType'] = 'schedule';
       
         return $this->create($fields);
	}
	
	public function update(array $fields, $taskId) {
		if(! empty ( $fields ['toFocusType'] )) {
			$focusType=$fields ['toFocusType'];
			$fields['_id']=$taskId;
			unset($fields['toFocusType']);
			$this->getTaskDao ()->update ( $fields, $taskId );
			$fields=$this->moveToFocusType ( $focusType, $fields);
		}else{
			unset($fields['toFocusType']);
		    $this->getTaskDao ()->update ( $fields, $taskId );
		}
		return $fields;
	}
	public function isDue($task){
		if($task['dueDate']>0&&$task['dueDate']<=strtotime(date("Ymd"))){
		    return true;
		}
		return false;
	}
	public function moveChildren($taskId, $focusType) {
		$children = $this->getTaskDao ()->listByParentId ( $taskId );
		$items_today['unDue']=0;
		$items_today['due']=0;
		$items_next['unDue']=0;
		$items_next['due']=0;
		foreach ( $children as $child ) {
	        if ($child ['focusType'] == 'next' &&$child['done']=='false') {
				$items_next['unDue']=$this->isDue($child)?$items_next['unDue']:$items_next['unDue']+1;
		        $items_next['due']=$this->isDue($child)?$items_next['due']+1:$items_next['due'];
	        }else if($child ['focusType'] == 'today'&&$child['done']=='false'){
	            $items_today['unDue']=$this->isDue($child)?$items_today['unDue']:$items_today['unDue']+1;
		        $items_today['due']=$this->isDue($child)?$items_today['due']+1:$items_today['due'];
	        }
	    }
		switch ($focusType) {
			case 'today' :
			case 'next' :
				foreach ( $children as $child ) {
					if ( $child ['focusType'] == 'today'||$child ['focusType'] == 'next') {
						$this->getTaskDao ()->update ( array ('focusType' => $focusType, 'focus' => 'next' ), $child ['_id'] );
					} else if ($child ['focusType'] == 'someday' || $child ['focusType'] == 'schedule') {
						$this->getTaskDao ()->update ( array ('focus' => $child ['focusType'] ), $child ['_id'] );
					}
				}
				break;
			case 'schedule' :
			case 'someday' :
				foreach ( $children as $child ) {
					if ($child ['focusType'] == 'today'||$child ['focusType']=='next') {
						$this->getTaskDao ()->update ( array ('focusType' => 'next', 'focus' => '' ), $child ['_id'] );
					} else if ($child ['focusType'] == 'someday' || $child ['focusType'] == 'schedule') {
						$this->getTaskDao ()->update ( array ('focus' => '' ), $child ['_id'] );
					} else if ($child ['focusType'] == 'archived' || $child ['focusType'] == 'deleted') {
						$this->getTaskDao ()->update ( array ('focus' => $child ['focusType'] ), $child ['_id'] );
					}
				}
				break;
			case 'archived' :
			case 'deleted' :
				foreach ( $children as $child ) {
					$this->getTaskDao ()->update ( array ('focusType' => $focusType, 'focus' => '','exeDate'=>0 ), $child ['_id'] );
				}
				break;
			case 'done':
				foreach ( $children as $child ) {
					$this->getTaskDao ()->update ( array ('done' => 'true','doneTime'=>time()), $child ['_id'] );
				}
				break;
			default :
				break;
		}
		return array('items_today'=>$items_today,'items_next'=>$items_next);
	
	}
	public function moveToFocusType($focusType, $task) {
		$fields = array ();
		
		$oldTask=(array)$this->getTaskDao ()->load ($task['_id']);
		$task=array_merge($oldTask,$task);
		//TODO 考虑projects时
		switch ($focusType) {
			case 'inbox' :
				$fields ['exeDate'] = 0;
				$fields ['focus'] = $fields ['focusType'] = $focusType;
				$fields ['parent'] = 0;
				break;
			
			case 'next' :
			case 'today' :
				$fields ['exeDate'] = 0;
				$fields ['focusType'] = $focusType;
				if ($task ['focusLevel'] == 1) {
					$fields ['focus'] = 'active';
					$items=$this->moveChildren ( $task['_id'], $focusType );
					$task['items_today']=$items['items_today'];
					$task['items_next']=$items['items_next'];
				} else {
					$fields ['focus'] = 'next';
				}
				if($oldTask['parent']>0&&$task['focus']==''){
				  $parent['_id']=$task['parent'];
				  $this->moveToFocusType('next',$parent);
				}
				break;
			case 'schedule' :
				$fields['exeDate']=$task['exeDate'];
				$fields ['focusType'] = $focusType;
				if($task['focus']!='')
				   $fields ['focus'] = $focusType;
		        if($task ['focusLevel'] == 1){
				   $items=$this->moveChildren($task['_id'],$focusType);  
				   $task['items_today']=$items['items_today'];
				   $task['items_next']=$items['items_next'];
				}
				break;
			case 'someday' :
				$fields ['exeDate'] = 0;
				$fields ['focusType'] = $focusType;
				if($task['focus']!='')
				   $fields ['focus'] = $focusType;
				if($task ['focusLevel'] == 1){
				   $items=$this->moveChildren($task['_id'],$focusType);  
				   $task['items_today']=$items['items_today'];
				   $task['items_next']=$items['items_next'];
				}			
				break;
			case 'archived' :
				$fields ['exeDate'] = 0;				
				$fields ['focus'] = $fields ['focusType'] = $focusType;
		        if($task ['focusLevel'] == 1){
				   $items=$this->moveChildren($task['id'],$focusType);  
				   $task['items_today']=$items['items_today'];
				   $task['items_next']=$items['items_next'];
				}
				break;
			case 'project' :
				$fields['exeDate']=0;
				$fields ['focusType'] = 'next';
				$fields ['focus'] = 'active';
				$fields ['focusLevel'] = 1;
				if($task['template']>0)
				   $fields['template']=0;
		        if ($task ['focusLevel'] == 1) {
					$items=$this->moveChildren ( $task['_id'], 'next' );
					$task['items_today']=$items['items_today'];
					$task['items_next']=$items['items_next'];
				}
				break;
			case 'inProject':
				//TODO
				$fields['parent']=$task['parent'];
				($task['focus']=='inbox'||$task['focus']=='deleted')?$fields['focusType']=$fields['focus']='next':'';
				break;
			case 'deleted' :
				$fields['exeDate']=0;
				$fields['parent']=0;
				$fields ['focus'] = $fields ['focusType'] = $focusType;
				if ($task ['repeatId'] > 0) {
					$this->deleteRepeat ( $task ['repeatId'] );
					if ($task ['instance'] > 0) {
						$this->getTaskDao ()->update ( array ('template' => 0 ), $task ['instance'] );
					}
					$fields ['repeatId'] = 0;
					$fields ['instance'] = 0;
				}
				if ($task ['template'] > 0) {
					$fields ['template'] = 0;
					$this->getTaskDao ()->update ( array ('instance' => 0 ), $task ['template'] );
				}
				if($task ['focusLevel'] == 1){
				    $items=$this->moveChildren($task['_id'],$focusType);
				    $task['items_today']=$items['items_today'];
					$task['items_next']=$items['items_next'];
				}
				break;
			default :
				break;
		}
		
		$this->getTaskDao ()->update ( $fields, $task['_id'] );
		return array_merge($task,$fields);
	}

	public function archive($focus, $userId,$parentId=-1) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		$builder->condition ( 'userId', $userId );
		$builder->condition ( 'done', 'true' );
		if($focus=='inProject'){
		  $builder->condition('parent',$parentId);
		  $builder->condition('focusType','archived','<>');
		}else{
		  ($focus=='today')?$builder->condition ( 'focus', 'next' ):$builder->condition ( 'focus', $focus );
		  $builder->condition ( 'focusType', $focus );
		}
		$tasks = $builder->execute ()->fetchAll ();
		$return=array();
		foreach ( $tasks as $task ) {
			$task=$this->moveToFocusType ( 'archived', $task);
			$task['doneDate']=date("Y-m-d",$task['doneTime']);
			array_push($return, $this->moveToFocusType ( 'archived', $task));
		}
	    return $return;
	}
	public function load($id) {
		return $this->getTaskDao ()->load ( $id );
	}
	

	
	public function delete($taskId) {
		return $this->getTaskDao ()->delete ( $taskId );
	}
	

	public function countItems($taskId,$focusType=null,$type=null){
	    $builder=$this->getTaskDao()->queryBuilder();
	    $builder->fields ( array ('count(*)' ) );
	    //$builder->condition('userId',$userId);
	    $builder->condition('parent',$taskId);
	    if(!empty($focusType)){
	      $builder->condition('focusType',$focusType);
	    }
	    $total=intval($builder->execute()->fetchColumn());
	    if($type=='due'){
	    	$builder->condition('done','false');
	        $builder->condition('dueDate',0,'>');
	        $builder->condition('dueDate',strtotime(date("Ymd")),'<=');
	        return intval($builder->execute()->fetchColumn());
	    }
	    if($type=='done'){
	    	$builder->condition('done','true');
	    	return intval($builder->execute()->fetchColumn());
	    }else if($type=='undone'){
	        $builder->condition('done','false');
	        return intval($builder->execute()->fetchColumn());
	    }
	      return $total;
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

	public function countInbox($userId,$isDue=false) {
		$builder = $this->getTaskDao ()->queryBuilder ();
	    $builder->fields ( array ('count(*)' ) );
		$builder->condition ( 'userId', $userId );
		$builder->condition ( 'focus', 'inbox' );
		$builder->condition ( 'done', 'false' );
		$total=intval ( $builder->execute ()->fetchColumn () );
		$builder->condition('dueDate',0,'>');
		$builder->condition('dueDate',strtotime(date("Ymd")),'<=');
		$due=intval ( $builder->execute ()->fetchColumn () );
		if($isDue==true){
		   return $due;
		}else{
		   return $total-$due;
		}
	}

    public function listActiveProject($userId){
        $builder=$this->getTaskDao()->queryBuilder();
        $builder->condition('userId',$userId);
        $builder->condition('focus','active');
        $builder->condition('focusLevel',1);
        $builder->orderBy('createdTime','DESC');
        return $builder->execute()->fetchAll();
    }
	
    public function listSubTasks($projectId){
	    $builder=$this->getTaskDao()->queryBuilder();
	    $builder->condition('parent',$projectId);
	    $builder->orderBy ( 'createdTime' );
	    return $builder->execute ()->fetchAll ();
	}

	public function listToday($userId) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		$builder->condition ( 'userId', $userId );
		$builder->condition ( 'focus', 'next' );
		$builder->condition ( 'focusType', 'today' );
		$builder->orderBy ( 'createdTime' );
		return $builder->execute ()->fetchAll ();
	}
	public function listNext($userId){
	    $builder = $this->getTaskDao ()->queryBuilder ();
	    $builder->condition ( 'userId', $userId );
		$builder->condition ( 'focus', 'next' );
		$builder->orderBy ( 'createdTime' );
		return $builder->execute ()->fetchAll ();
	}
	public function listSchedule($userId) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		
		$builder->condition ( 'userId', $userId );
		$builder->condition ( 'focus', 'schedule' );
		//$builder->condition ( 'repeatId', 0 );
		$builder->orderBy ( 'exeDate' );
		
		return $builder->execute ()->fetchAll ();
	}
	

	
	public function listInbox($userId) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		
		$builder->condition ( 'userId', $userId );
		$builder->condition ( 'focus', 'inbox' );
		$builder->orderBy ( 'createdTime' );
		return $builder->execute ()->fetchAll ();
	}
	
	public function listSomeday($userId) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		
		$builder->condition ( 'userId', $userId );
		$builder->condition ( 'focus', 'someday' );
		$builder->orderBy ( 'createdTime' );
		return $builder->execute ()->fetchAll ();
	}
	public function listProject($userId){
	    $builder = $this->getTaskDao ()->queryBuilder ();
	    $builder->condition('userId',$userId);
	    $builder->condition('focusLevel',1);
	    $builder->orderBy ( 'createdTime' );
	    return $builder->execute ()->fetchAll ();
	}
	
	public function listArchived($userId,$offset,$limit) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		$builder->condition ( 'userId', $userId );
		$builder->condition ( 'focus', 'archived' );
		$builder->orderBy ( 'doneTime', 'DESC' );
		$builder->range ( $offset, $limit );
		return $builder->execute ()->fetchAll ();
	}
	public function listDeleted($userId) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		$builder->condition ( 'focus', 'deleted' );
		$builder->condition ( 'userId', $userId );
		
		return $builder->execute ()->fetchAll ();
	}
	public function listComments($taskId) {
		$builder = $this->getCommentsDao ()->queryBuilder ();
		$builder->condition ( 'taskId', $taskId );
		return $builder->execute ()->fetchAll ();
	}
	public function addRepeat(array $fields) {
		
        $fields['next'] = $this->getNext($fields['days'],$fields['frequency'],null);
        $days = explode(',', $fields['days']);
        sort($days);
        $fields['days'] = implode(',', $days);
		return $this->getRepeatDao ()->add ( $fields );
	}
	
	public function updateRepeat(array $fields, $id) {
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
	
    public function loadTag($id){
	    return $this->getTagsDao()->load($id);
	}
	
    public function addTag($taskId,$data){
	       $data=base64_decode($data);
    	
    	   $im = imagecreatefromstring($data);
           if ($im !== false) {
               header('Content-Type: image/png');
               imagepng($im,'res/tags/tag_'.$taskId.'.png');
               imagedestroy($im);
           }
	   return $this->getTagsDao()->add(array('taskId'=>$taskId,'name'=>'tag_'.$taskId.'.png'));
	}
	public function deleteTagByTaskId($taskId){
	     $filename='tag_'.$taskId.'.png';
         if (file_exists("/res/tags/" .$filename)){
             unlink("res/tags/".$filename);
         }
	  return $this->getTagsDao()->deleteByTaskId($taskId);
	}
	public function updateTagByTaskId($taskId,$data){
		 $data=base64_decode($data);
		 $im = imagecreatefromstring($data);
	     if ($im !== false) {
               header('Content-Type: image/png');
               imagepng($im,'res/tags/tag_'.$taskId.'.png');
               imagedestroy($im);
           }
	}
	public function addSound($taskId,$file){
		 $filename='sound_'.$taskId.'.wav';
        move_uploaded_file($file,"res/upload/" . $filename);
	    return $this->getSoundDao()->add(array('taskId'=>$taskId,'name'=>'sound_'.$taskId.'.wav'));
	}
	public function updateSoundByTaskId($taskId,$file){
		
		 $filename='sound_'.$taskId.'.wav';
	     if (file_exists("/res/upload/" .$filename)){
             unlink("res/upload/".$filename);
         }
	     move_uploaded_file($file,"res/upload/" . $filename);
	}
	public function deleteSoundByTaskId($taskId){
		 $filename='sound_'.$taskId.'.wav';
         if (file_exists("/res/upload/" .$filename)){
             unlink("res/upload/".$filename);
         }
	     $this->getSoundDao()->deleteByTaskId($taskId);
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
	public function countArchivedtasks($userId){
	   $builder = $this->getTaskDao ()->queryBuilder ();
	   $builder->condition('userId',$userId);
	   $builder->condition ( 'focus', 'archived');
	   $builder->fields ( array ('count(*)' ) );
	   return intval ( $builder->execute ()->fetchColumn () );
	}
	/*public function listByUserIdAndDone($userId, $done, $offset = 0, $limit = 30) {
		return $this->getTaskDao ()->listByUserIdAndDoneAndDeleted ( $userId, $done, 'false', $offset, $limit );
	}
	
	public function listAllByDone($done, $offset = 0, $limit = 30) {
		return $this->getTaskDao ()->listByDoneAndDeleted ( $done, 'false', $offset, $limit );
	}
	
	public function countByUserIdAndDone($userId, $done) {
		return $this->getTaskDao ()->countByUserIdAndDoneAndDeleted ( $userId, $done, 'false' );
	}
	
	public function countAllByDone($done) {
		return $this->getTaskDao ()->countByDoneAndDeleted ( $done, 'false' );
	}*/
	
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
	
	public function createTaskFromRepeat($today) {
		$builder = $this->getRepeatDao ()->queryBuilder ();
		$result = $builder->execute ()->fetchAll ();
		//var_dump($result);
		foreach ( $result as $repeat ) {
			if ($repeat ['next'] == $today) {
				//var_dump(date('Y-m-d',$repeat ['next']));
				$next = $this->getNext ( $repeat ['days'],$repeat['frequency'],null );
				$this->getRepeatDao ()->update ( array ('next' => $next ), $repeat ['_id'] );
				$task = $this->getTaskDao ()->load ( $repeat ['taskId'] );
				$templateId = $task ['_id'];
				$this->getTaskDao ()->update ( array ('template' => 0 ), $task ['instance'] );
				
				$task['focusType']='today';
				$task['focus']='next';
				$task ['exeDate'] = 0;
				$task ['createdTime'] = time ();
				$task ['instance'] = 0;
				$task ['repeatId'] = 0;
				$task ['template'] = $templateId;
				unset ( $task ['_id'] );
				$newTaskId = $this->getTaskDao ()->add ( $task );
				$this->getTaskDao ()->update ( array ('instance' => $newTaskId ), $templateId );
			}
		}
	}
	public function moveToToday($today) {
		$builder = $this->getTaskDao ()->queryBuilder ();
		$builder->condition ( 'exeDate', 0, '>' );
		$result = $builder->execute ()->fetchAll ();
			//var_dump($result);exit();
		foreach ( $result as $task ) {
			if ($task ['exeDate'] == $today) {
				$this->moveToFocusType('today',$task);
				//$this->getTaskDao ()->update ( array ('focus' => 'today', 'exeDate' => 0 ), $task ['_id'] );
			}
		}
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
	
    private function getTagsDao() {
		return TaskDaoFactory::getInstance ()->createTagsDao ();
	}
    private function getSoundDao() {
		return TaskDaoFactory::getInstance ()->createSoundDao ();
	}
}
