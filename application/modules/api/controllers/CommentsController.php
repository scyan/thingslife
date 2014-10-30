<?php

require_once dirname ( __FILE__ ) . '/BaseController.php';

class Api_CommentsController extends Api_BaseController {
	
	public function init() {
		parent::init ();
	}
	
	/**
	 * [GET] 获取Task的评论
	 * 
	 * 参数:
	 * taskId [*]
	 */
	public function searchAction() {
		$id = ( int ) $this->getRequest ()->getQuery ( 'id', 0 );
		$comments = $this->getTaskService ()->listCommentsByTaskId ( $id );
		foreach ( $comments as $i => $comment ) {
			$comments [$i] ['createdTime'] = date ( 'c', $comment ['createdTime'] );
		}
		if (empty ( $comments )) {
			return $this->setEmptyListJsonData ();
		} else {
			return $this->setJsonData ( $comments );
		}
	
	}
	/**
	 * [GET] 获取最新的评论
	 * 
	 * 参数:
	 * id [*]
	 */
	public function loadAction() {
		$id = $this->getRequest ()->getQuery ( 'id', 0 );
		$comment = $this->getTaskService ()->loadComment ( $id );
		//var_dump($id);exit();
			$comment  ['createdTime'] = date ( 'c', $comment ['createdTime'] );
		
		if (empty ( $comment )) {
			return $this->setEmptyListJsonData ();
		} else {
			return $this->setJsonData ( $comment );
		}
	}
	/**
	 * [POST] 添加评论
	 * 
	 * 参数：
	 * taskId [*]
	 * comment [*]
	 */
	public function createAction() {
		$taskId = $this->getRequest ()->getPost ( 'taskId', 0 );
		$comment = $this->getRequest ()->getPost ( 'comment', '' );
		if (! empty ( $comment )) {
			$fields = array ();
			$user = $this->getUser ();
			$fields ['taskId'] = $taskId;
			$fields ['userId'] = $user->id;
			$fields ['username'] = $user->username;
			$fields ['createdTime'] = time ();
			$fields ['content'] = $comment;
			$id = $this->getTaskService ()->addComment ( $fields );
			$task = $this->getTaskService ()->load ( $taskId );
			$toUserId = $task ['userId'];
			$taskTitle = $task ['title'];
			$message = $user->username . ' 对您的任务 ' . $taskTitle . ' 进行了评论：' . $comment;
			
			$this->getMessageService ()->send ( $user->id, $toUserId, $message );
			if (! empty ( $id )) {
				
				return $this->setJsonData ( $id );
			}
		}
	}
	
	/**
	 * @return ITaskService
	 */
	private function getTaskService() {
		require_once 'Thingslife/Task/Service/TaskServiceFactory.php';
		return TaskServiceFactory::getInstance ()->createTaskService ();
	}
	
	private function getMessageService() {
		require_once 'Thingslife/User/Service/UserServiceFactory.php';
		return UserServiceFactory::getInstance ()->createMessageService ();
	}
}