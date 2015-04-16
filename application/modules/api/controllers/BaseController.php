<?php
require_once 'Thingslife/User/Service/UserServiceFactory.php';
require_once APPLICATION_PATH . '/base/BaseController.php';

abstract class Api_BaseController extends BaseController {
	
	protected $jsonData;

    public function init () {
        parent::init();
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
    }
    
    protected function setJsonData($data) {
    	$this->jsonData = $data;
    	return ;
    }
    
    protected function setEmptyObjectJsonData() {
    	$this->jsonData = new stdClass();
    }
    
    protected function setEmptyListJsonData() {
    	$this->jsonData = array();
    }
    protected function setSuccess($data=array()){
        $this->jsonData=array('code'=>'10000','data'=>$data);
        return ;
    }
    protected function setError($msg=''){
        $this->jsonData=array('code'=>'10001','msg'=>$msg);
        return ;
    }
    public function postDispatch() {
    	parent::postDispatch();
    	echo json_encode($this->jsonData);
    }
    
}