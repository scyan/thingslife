<?php


require_once dirname(__FILE__) . '/BaseController.php';

class TaskController extends Default_BaseController {

    public function init () {
        parent::init();
        $userId = $this->getUser()->id;
        $this->view->countToday = $this->getTaskService()->countToday($userId);
    }
   public function makeAction(){
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

    private function getTaskService () {
        require_once 'Thingslife/Task/Service/TaskServiceFactory.php';
        return TaskServiceFactory::getInstance()->createTaskService();
    }
}

