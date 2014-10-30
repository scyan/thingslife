<?php

interface IMessageService {

    public function send ($fromUserId, $toUserId, $message);//像用户发送消息

    public function markRead (array $messageIds);//将部分消息设为已读

    public function listUnRead ($userId);//载入未读消息

}