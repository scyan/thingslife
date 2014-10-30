<?php

interface ITaskService {
	
	CONST DONE_done = 1;
	
	CONST DONE_UNdone = 0;
	public function create($fields);
	
	public function update(array $fields, $id);
	
	public function delete($taskId);
	
	public function load($id);
	
	public function archive($focusType, $userId);//归档
	
	public function countItems($taskId,$focusType=null,$due=false);//计算project子任务条数
	
	public function countToday($userId);//计算今日任务条数，可根据条件计算已过期的和未过期的
	
	public function countInbox($userId);//计算收集箱任务条数，可根据条件计算已过期的和未过期的
	
	public function listToday($userId);//选出所有今日任务
	
	public function listNext($userId);
	
	public function listProject($userId);
	
	public function listSchedule($userId);
	
	public function listInbox($userId);
	
	public function listSomeday($userId);
	
	public function listDeleted($userId);
	
	public function listArchived($userId,$offset,$limit);
	
	public function listMultitasks($userId, $offset, $limit);
	
	public function countMultitasks($userId);//计算当前选择的用户以完成的任务条数
	
	public function listCommentsByTaskId($taskId, $offset = 0, $limit = 30);
	
	public function addComment(array $fields);//添加评论
	
	public function loadComment($id);//载入评论
	
	public function addTag($taskId,$data);//添加标签
	
	public function deleteTagByTaskId($taskId);//删除标签
	
	public function updateTagByTaskId($taskId,$data);//更新标签
	
	public function addSound($taskId,$file);//添加声音
	
	public function updateSoundByTaskId($taskId,$file);//更新声音
	
	public function deleteSoundByTaskId($taskId);//删除声音
	
	public function countCommentsByTaskId($taskId);//统计一个任务的评论数目
	
	public function moveToFocusType($focusType, $taskId);//移动任务到某个箱子
	
	public function moveChildren($taskId, $focusType) ;//移动某个project的子任务到某个箱子
	
	public function addRepeat(array $fields);//往重复信息表中添加一条记录
	
	public function updateRepeat(array $fields, $id);//更新重复信息表的一条记录
	
	public function loadRepeat($id);//载入一条重复信息
	
	public function loadRepeatByTaskId($taskId);//根据taskId载入一条重复信息
	
	public function updateRepeatByTaskId(array $fields, $taskId);//根据taskId更新一条重复记录
	
	public function getNext($days,$frequency,$start);//根据重复的日子和频率计算下一次
	
	public function createTaskFromRepeat($today);//用于脚本，根据重复信息在今日待办中新建一条任务
	
	public function moveToToday($today);//用于脚本，将日程中日期为今天的任务移动到今日待办中
	
/*	public function listByUserIdAndDone($userId, $done, $offset = 0, $limit = 30);
	
	public function listAllByDone($done, $offset = 0, $limit = 30);
	
	public function countByUserIdAndDone($userId, $done);
	
	public function countAllByDone($done);*/
}