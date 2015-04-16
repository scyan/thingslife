<?php

interface ITaskService {
	
	CONST DONE_done = 1;
	
	CONST DONE_UNdone = 0;
	public function create($fields);
	
	public function update(array $fields, $id);
	
	
	public function load($id);
	
	//public function archive($focusType, $userId);//归档
	public function archive(array $conditions);//归档2.0
	
//	public function countItems($taskId,$focusType=null,$due=false);//计算project子任务条数
	
	
	
	public function listToday(array $conditions);//选出所有今日任务
	
	public function listNext(array $conditions);
	
	public function listProject(array $conditions);
	
	public function listSchedule(array $conditions);
	
	public function listInbox(array $conditions);
	
	public function listSomeday(array $conditions);
	
	public function listDeleted(array $conditions);
	
	public function listArchived(array $conditions,$offset=0,$limit=null);
	
	public function listMultitasks($userId, $offset, $limit);
	
	public function countMultitasks($userId);//计算当前选择的用户以完成的任务条数
	
	public function listCommentsByTaskId($taskId, $offset = 0, $limit = 30);
	
	public function addComment(array $fields);//添加评论
	
	public function loadComment($id);//载入评论
	
	
	
	
	
	
	public function countCommentsByTaskId($taskId);//统计一个任务的评论数目
	
	public function moveToFocusType($focusType, &$task);//移动任务到某个箱子
	
	//public function moveChildren($taskId, $focusType) ;//移动某个project的子任务到某个箱子
	
	public function addRepeat(array $fields);//往重复信息表中添加一条记录
	
	public function updateRepeat(array $fields, $id);//更新重复信息表的一条记录
	
	public function loadRepeat($id);//载入一条重复信息
	
	public function loadRepeatByTaskId($taskId);//根据taskId载入一条重复信息
	
	public function updateRepeatByTaskId(array $fields, $taskId);//根据taskId更新一条重复记录
	
	public function getNext($days,$frequency,$start);//根据重复的日子和频率计算下一次
	
	public function createTaskFromRepeat();//用于脚本，根据重复信息在今日待办中新建一条任务
	
	public function moveToToday();//用于脚本，将日程中日期为今天的任务移动到今日待办中
	
/*	public function listByUserIdAndDone($userId, $done, $offset = 0, $limit = 30);
	
	public function listAllByDone($done, $offset = 0, $limit = 30);
	
	public function countByUserIdAndDone($userId, $done);
	
	public function countAllByDone($done);*/
}