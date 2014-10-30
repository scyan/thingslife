<?php

require_once dirname ( __FILE__ ) . '/BaseController.php';

class Api_MultitasksController extends Api_BaseController {
	
	public function init() {
		parent::init ();
	}
	public function listusersAction() {
		$users = $this->getUserService ()->listUsers ();
		return $this->setJsonData ( $users );
	}
	/**
	 * [GET] 搜索tasks
	 * 
	 * 参数:
	 * userId 该值为空时，列出所有用户的 
	 * page
	 * perPage 
	 */
	public function indexAction() {
		
		$userId = ( int ) $this->getRequest ()->getQuery ( 'userId', 0 );
		$perPage = ( int ) $this->getRequest ()->getQuery ( 'perPage', 50 );
		if ($perPage > 100) {
			$perPage = 100;
		}
		//$totalCount = $this->getTaskService ()->countMultitasks ( $userId );
		//$totalPage = (ceil ( $totalCount / $perPage )>1)?ceil ( $totalCount / $perPage ):1;
		$page = ( int ) $this->getPageParam ( 'page', 1 );
	
		$list = $this->getTaskService ()->listMultitasks ( $userId, ($page - 1) * $perPage, $perPage );
		//$list = $this->getTaskService ()->listByUserIdAndDone ( $userId,'true', ($page - 1) * $perPage, $perPage );
		

		$result = array ();
		
		foreach ( $list as $item ) {
			//$user = $this->getUserService ()->load ( $item ['userId'] );
			//$item ['username'] = $user ['username'];
			$item ['doneDate'] = date ( "Y-m-d", $item ['doneTime'] );
			$item['items']=($item['focusLevel'] == 1) ? ($this->getTaskService()->countItems($item['_id'])): 0;
			$result [] = $item;
		}
		
		$return = array ('tasks' => $result);
		
		return $this->setJsonData ( $return );
	}
	public function getusernamesAction(){
	    $userIds=trim($this->getRequest()->getQuery('userIds',' '));
	    $userIds=explode(' ',$userIds);
	    $userNames=array();
	    foreach ($userIds as $userId) {
            $result = $this->getUserService()->load($userId);
            $userNames[$userId] = $result['username'];
        }
        return $this->setJsonData ( $userNames );
	}
	public function getpageAction(){
	   $userId = ( int ) $this->getRequest ()->getQuery ( 'userId', 0 );
	   $totalCount = $this->getTaskService ()->countMultitasks ( $userId );
	   $perPage = ( int ) $this->getRequest ()->getQuery ( 'perPage', 50 );
	   $totalPage = (ceil ( $totalCount / $perPage )>1)?ceil ( $totalCount / $perPage ):1;
	   return $this->setJsonData ( $totalPage );
	}
	/**
	 * [GET] 显示task详细
	 * 
	 * 参数:
	 * taskId 
	 */
	public function showAction() {
		$id = ( int ) $this->getRequest ()->getQuery ( 'taskId', 0 );
		$task = $this->getTaskService ()->load ( $id );
		if (empty ( $task )) {
			return $this->setEmptyObjectJsonData ();
		}
		$task ['createdTime'] = $task ['createdTime'] == 0 ? 0 : date ( 'c', $task ['createdTime'] );
		$task ['doneTime'] = $task ['doneTime'] == 0 ? 0 : date ( 'c', $task ['doneTime'] );
		
		$comments = $this->getTaskService ()->listCommentsByTaskId ( $id );
		foreach ( $comments as $i => $comment ) {
			$comments [$i] ['createdTime'] = date ( 'c', $comment ['createdTime'] );
		}
		$return = array ('task' => $task, 'comments' => $comments );
		return $this->setJsonData ( $return );
	}
	private function getTaskService() {
		require_once 'Thingslife/Task/Service/TaskServiceFactory.php';
		return TaskServiceFactory::getInstance ()->createTaskService ();
	}
}
