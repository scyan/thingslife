<?php

class BaseController extends Zend_Controller_Action {

	//检查用户是否登录成功！
    public function checkLogin () {
        $contextUser = $this->getUser();
        if (! ($contextUser->isLogin())) {
            $this->_redirect($this->_helper->url('login', 'auth', 'default'));
            exit();
        }
    }

    public function showMessage ($message, $goto = '', array $options = array()) {
        $this->_setParam('message', $message);
        $this->_setParam('goto', $goto);
        $this->_setParam('options', $options);
        $this->_forward('message', 'error', 'default');
    }

    public function getUser () {
        return $this->getFrontController()->getParam('context')->getUser();
    }

    public function makePaginator ($current, $totalItemCount, $itemCountPerPage) {
        $current = (int) $current;
        $totalItemCount = (int) $totalItemCount;
        $itemCountPerPage = (int) $itemCountPerPage;
        
        require_once 'Zend/Paginator.php';
        Zend_Paginator::setDefaultScrollingStyle('Sliding');
        Zend_View_Helper_PaginationControl::setDefaultViewPartial('pagination_control.phtml');
        
        $paginator = Zend_Paginator::factory($totalItemCount);
        $paginator->setCurrentPageNumber($current);
        $paginator->setItemCountPerPage($itemCountPerPage);
        
        return $paginator;
    }
    public function receiveimg() {
    	$adapter = new Zend_File_Transfer_Adapter_Http ();
    //	$userId = $this->getUser ()->id;
   // 	$shopId = $this->getUser ()->shop ['id'];
    	$configs ['minsize'] = 0;
    	$configs ['maxsize'] = 500 * 1024;
    	$adapter->setDestination ( 'upload/temp' );
    	$adapter->addValidator ( 'Size', true, array ('min' => floatval ( $configs ['minsize'] ), 'max' => floatval ( $configs ['maxsize'] ) ) ); //设置上传文件的大小在1-2M之间
    	$adapter->addValidator ( 'Extension', true, array ('gif', 'jpeg', 'jpg', 'png', 'bmp' ) );
    
    	$oldfile = $this->getRequest ()->getPost ( 'oldfile', 0 );
    	if (! $adapter->isValid ()) {
    		$success = 'false';
    		$messages = $adapter->getMessages ();
    	} else {
    		$success = 'true';
    		$fileInfo = $adapter->getFileInfo ();
    		if (! empty ( $oldfile ) && file_exists ( 'upload/temp/' . $oldfile )) {
    			unlink ( 'upload/temp/' . $oldfile );
    		}
    		foreach ( $fileInfo as $key => $img ) {
    			$extName = $this->getExtension ( $img ); //获取扩展名
    			$filename = md5 ( time () . mt_rand () . $userId . $img ['name'] ) . '.' . $extName; //重命名
    			$adapter->addFilter ( 'Rename', array ('source' => $img ['tmp_name'], 'target' => $filename, 'overwrite' => true ) ); //执行重命名
    			$info = getImageSize ( $img ['tmp_name'] );
    			$adapter->receive ( $key );
    				
    			//$img= array ('name' => $filename, 'size'=>$img['size'],'width' => $info [0], 'height' => $info [1] );
    			// $imgId=$this->getImgService()->addImg($img,$shopId,$userId);
    		}
    	}
    	return $this->setJsonData ( array ('success' => $success, 'filename' => isset ( $filename ) ? $filename : 0, 'messages' => isset ( $messages ) ? $messages : 0 ) );
    }
    public function getPageParam ($key = 'page') {
        $page = (int) $this->_getParam($key, 1);
        return $page < 1 ? 1 : $page;
    }

    public function getJumpUrl ($key = 'go') {
        $go = $this->getRequest()->getQuery($key, '');
        if (empty($go) && ! empty($_SERVER['HTTP_REFERER'])) {
            $go = $_SERVER['HTTP_REFERER'];
        }
        require_once 'Thingslife/Util/Filter.php';
        return Filter::jumpUrl($go);
    }

    public function getCurrentUrl () {
        return $go = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    }

    /**
     * @return IUserService
     */
    public function getUserService () {
        return UserServiceFactory::getInstance()->createUserService();
    }
    
    
    protected function filter($keys,$value){
    	require_once 'Juzi/Util/ArrayUtil.php';
    	$value = ArrayUtil::filterKeys($keys, $value);
    	return $value;
    }
    protected function setDueInfo(&$value){
    	if($value['dueDate']){
    		$dueDays=ceil((strtotime($value['dueDate'])-time())/3600/24);
    		$value['isDue']=$dueDays<=0?true:false;
    		if($dueDays>0){
    			$value['dueInfo']='剩余'.$dueDays.'天';
    		}else if($dueDays==0){
    			$value['dueInfo']='今天到期';
    		}else{
    			$value['dueInfo']='已过期'.abs($dueDays).'天';
    		}
    	}else{
    		$value['isDue']=false;
    	}
    }
    //设置是否活动
    protected  function setStatus(&$value){
    	if($value['focusType']=='today'||$value['focusType']=='next'){
    		$value['isActive']=true;
    	}else{
    		$value['isActive']=false;
    	}
    	 
    }
    //设置项目信息
    protected function setProjectInfo(&$value){
    	$value['isproject']=$value['focusLevel']==1?true:false;
    	$value=array_merge($value,$this->getTaskService()->countChildren($value['_id']));
   /*  	if( $value['isproject']){
    		$value['items']=$this->getTaskService()->countItems($value['_id']);
    		$value['dueItems']=$this->getTaskService()->countItems($value['_id'], null, 'due');
    		$value['doneItems']=$this->getTaskService()->countItems($value['_id'], null, 'done');
    	} */
    }
    //设置重复信息
    protected function setRepeatInfo(&$value){
    	if($value['repeatId']){
    		$value['repeat']=$this->getTaskService()->loadRepeat($value['repeatId']);
    	}
    }
   	protected function setDoneInfo(&$value){
   		if($value['done']=='true'){
   		   // $value['doneTime']=date('Y-m-d',$value['doneTime']);
   		}
   	}
   	protected function setTag(&$value){
   	    if(isset($value['tag'])&&$value['tag']){
   	    	$tag=array();
   	    	$tag['name']=$value['tag'];
   	    	$tag['path']=Config::get('files.tag_root').$value['tag'];
   	        $value['tagObj']=$tag;
   	    }
   	}
   	protected function filterInactive(&$value,&$parents){
   	    if(!empty($value['parent'])){
   	    	if(!isset($parents[$value['parent']])){
   	    		$parents[$value['parent']]=$this->getTaskService()->load($value['parent']);
   	    		if($parents[$value['parent']]['focus']!='next'){
   	    			return false;
   	    		}
   	    	}
   	   // 	$value['parent']=$this->filter(array('_id','title'),$parents[$value['parent']]);
   	    }
   	    return true;
   		
   	}
    protected  $filterKeys=array(
    		'exeDate',
    		'dueDate',
        	'doneTime',
    		'_id',
    		//    'userid',
    		'title',
    		'note',
    		//     'box',
    		'focus',
    		'focusType',
    		'done',
    		'comments',
    		'donetime',
    		 'createdtime',
    		'repeatId',
    		'parent',
    		'isproject',
    		'tag',
    		'sound',
    		'isdue',
    		'dueinfo',
    		'repeat',
        	'doneItems',
        	'items',
    );
protected function getTaskService () {
	require_once 'Thingslife/Task/Service/TaskServiceFactory.php';
	return TaskServiceFactory::getInstance()->createTaskService();
}
}
