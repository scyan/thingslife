<?php
require_once ('Thingslife/User/Service/IMessageService.php');
require_once ('Thingslife/Common/BaseService.php');
require_once 'Thingslife/User/Dao/UserDaoFactory.php';

class MessageServiceImpl extends BaseService implements IMessageService {

    public function send ($fromUserId, $toUserId, $message) {
        $fields = array();
        $fields['fromUserId'] = $fromUserId;
        $fields['toUserId'] = $toUserId;
        $fields['content'] = $message;
        $this->getMessageDao()->add($fields);
    }

    public function countUnRead ($userId) {
        $builder = $this->getMessageDao()->queryBuilder();
        $builder->condition('toUserId', $userId);
        $builder->condition('isRead', 'false');
        $builder->fields(array(
            'count(*)'
        ));
        return intval($builder->execute()->fetchColumn());
    }

    public function markRead (array $messageIds) {
    	foreach ($messageIds as $id){
         $this->getMessageDao()->update(array(
            'isRead' => 'true'
        ), $id);}
    }

    public function listUnRead ($userId) {
        $builder = $this->getMessageDao()->queryBuilder();
        $builder->condition('toUserId', $userId);
        $builder->condition('isRead', 'false');
        return $builder->execute()->fetchAll();
    }

    private function getMessageDao () {
        return UserDaoFactory::getInstance()->createMessageDao();
    }
}