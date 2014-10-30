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
    
}

