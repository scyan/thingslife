-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2014 年 04 月 08 日 11:58
-- 服务器版本: 5.1.36
-- PHP 版本: 5.3.0

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- 数据库: `thingslife`
--

-- --------------------------------------------------------

--
-- 表的结构 `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `_id` int(4) NOT NULL AUTO_INCREMENT,
  `taskId` int(4) NOT NULL,
  `userId` int(4) NOT NULL,
  `toUserId` int(4) NOT NULL,
  `username` varchar(64) NOT NULL,
  `content` text NOT NULL,
  `createdTime` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `comments`
--


-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE IF NOT EXISTS `message` (
  `_id` int(4) NOT NULL AUTO_INCREMENT,
  `fromUserId` int(4) NOT NULL,
  `toUserId` int(4) NOT NULL,
  `content` text NOT NULL,
  `isRead` enum('true','false') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `message`
--


-- --------------------------------------------------------

--
-- 表的结构 `session`
--

CREATE TABLE IF NOT EXISTS `session` (
  `_id` char(32) NOT NULL DEFAULT '',
  `modified` int(11) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `session`
--

INSERT INTO `session` (`_id`, `modified`, `data`) VALUES
('jtt8bo3riq110ic1r6nl3v7ro6', 1313070824, '__U|a:4:{s:3:"_id";s:1:"1";s:8:"username";s:9:"yaodandan";s:8:"nickname";s:0:"";s:6:"avatar";a:3:{s:5:"small";s:0:"";s:6:"normal";s:0:"";s:5:"large";s:0:"";}}'),
('t9bmj8n5tdak7gioqo16m95bq3', 1315485797, '__U|a:4:{s:3:"_id";i:0;s:8:"username";s:0:"";s:8:"nickname";s:0:"";s:6:"avatar";s:0:"";}'),
('mkgpom52a1lsc6ek22oqgvebt4', 1315485929, '__U|a:4:{s:3:"_id";i:0;s:8:"username";s:0:"";s:8:"nickname";s:0:"";s:6:"avatar";s:0:"";}'),
('uku161fdu77g4usbb79nj1pot3', 1315489025, '__U|a:4:{s:3:"_id";i:0;s:8:"username";s:0:"";s:8:"nickname";s:0:"";s:6:"avatar";s:0:"";}'),
('huu99quifk8l02aili2h50vq56', 1315753904, '__U|a:4:{s:3:"_id";s:1:"1";s:8:"username";s:9:"yaodandan";s:8:"nickname";s:0:"";s:6:"avatar";a:3:{s:5:"small";s:0:"";s:6:"normal";s:0:"";s:5:"large";s:0:"";}}'),
('ij2rcbfpd4f2e3f0t7ef543m94', 1327424758, '__U|a:4:{s:3:"_id";i:0;s:8:"username";s:0:"";s:8:"nickname";s:0:"";s:6:"avatar";s:0:"";}'),
('1huip8v0s461rdrg7ldaejku65', 1327505688, '__U|a:4:{s:3:"_id";s:1:"2";s:8:"username";s:5:"scyan";s:8:"nickname";s:0:"";s:6:"avatar";a:3:{s:5:"small";s:0:"";s:6:"normal";s:0:"";s:5:"large";s:0:"";}}'),
('b018sci8hu7269djl3nivsm9e1', 1327562679, '__U|a:4:{s:3:"_id";i:0;s:8:"username";s:0:"";s:8:"nickname";s:0:"";s:6:"avatar";s:0:"";}');

-- --------------------------------------------------------

--
-- 表的结构 `sound`
--

CREATE TABLE IF NOT EXISTS `sound` (
  `_id` int(4) NOT NULL AUTO_INCREMENT,
  `taskId` int(4) NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `sound`
--


-- --------------------------------------------------------

--
-- 表的结构 `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `_id` int(4) NOT NULL AUTO_INCREMENT,
  `taskId` int(4) NOT NULL,
  `name` varchar(30) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `tags`
--

INSERT INTO `tags` (`_id`, `taskId`, `name`) VALUES
(1, 1, 'tag_1.png');

-- --------------------------------------------------------

--
-- 表的结构 `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `exeDate` int(11) NOT NULL DEFAULT '0',
  `dueDate` int(11) NOT NULL DEFAULT '0',
  `_id` int(4) NOT NULL AUTO_INCREMENT,
  `userId` int(4) NOT NULL,
  `title` varchar(255) NOT NULL,
  `note` text,
  `focus` varchar(10) NOT NULL,
  `done` enum('true','false') NOT NULL DEFAULT 'false',
  `comments` int(11) NOT NULL DEFAULT '0' COMMENT '评论条数',
  `doneTime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '完成时间',
  `createdTime` int(10) unsigned NOT NULL DEFAULT '0',
  `repeatId` int(4) NOT NULL DEFAULT '0',
  `instance` int(4) NOT NULL DEFAULT '0',
  `template` int(4) NOT NULL DEFAULT '0',
  `parent` int(4) NOT NULL DEFAULT '0',
  `focusType` varchar(10) NOT NULL,
  `focusLevel` int(4) NOT NULL DEFAULT '0',
  `tag` int(4) NOT NULL DEFAULT '0',
  `sound` int(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`_id`),
  KEY `exeDate` (`exeDate`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `task`
--

INSERT INTO `task` (`exeDate`, `dueDate`, `_id`, `userId`, `title`, `note`, `focus`, `done`, `comments`, `doneTime`, `createdTime`, `repeatId`, `instance`, `template`, `parent`, `focusType`, `focusLevel`, `tag`, `sound`) VALUES
(0, 0, 1, 1, 'ddd', 'cc', 'active', 'false', 0, 0, 1313070698, 0, 0, 0, 0, 'next', 1, 1, 0),
(0, 0, 2, 1, 'd', '', 'inbox', 'false', 0, 0, 1315753904, 0, 0, 0, 0, 'inbox', 0, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `task2`
--

CREATE TABLE IF NOT EXISTS `task2` (
  `exeDate` int(11) NOT NULL,
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `title` text NOT NULL,
  `note` text NOT NULL,
  `box` varchar(10) NOT NULL,
  `done` enum('true','false') NOT NULL DEFAULT 'false',
  `comments` int(11) NOT NULL DEFAULT '0' COMMENT '评论条数',
  `doneTime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '完成时间',
  `createdTime` int(10) unsigned NOT NULL DEFAULT '0',
  `repeatId` int(10) unsigned NOT NULL DEFAULT '0',
  `instance` int(10) unsigned NOT NULL DEFAULT '0',
  `template` int(10) unsigned NOT NULL DEFAULT '0',
  `dueDate` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`_id`),
  KEY `exeDate` (`exeDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `task2`
--


-- --------------------------------------------------------

--
-- 表的结构 `task_repeat`
--

CREATE TABLE IF NOT EXISTS `task_repeat` (
  `_id` int(4) NOT NULL AUTO_INCREMENT,
  `type` enum('daily','weekly','monthly','yearly') NOT NULL,
  `next` int(11) NOT NULL,
  `frequency` int(11) NOT NULL DEFAULT '1',
  `days` text NOT NULL,
  `taskId` int(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `task_repeat`
--


-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `_id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL COMMENT '密码',
  `email` varchar(128) NOT NULL,
  `createdTime` int(10) unsigned NOT NULL DEFAULT '0',
  `updatedTime` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`_id`, `username`, `password`, `email`, `createdTime`, `updatedTime`) VALUES
(1, 'yaodandan', '99d07e74694fd348fa862c9c3a5a73c5', 'ydd-jd@163.com', 1313070688, 1313070688),
(2, 'scyan', '96e79218965eb72c92a549dd5a330112', '111@111.com', 1327504861, 1327504861);

-- --------------------------------------------------------

--
-- 表的结构 `user_persistent_login`
--

CREATE TABLE IF NOT EXISTS `user_persistent_login` (
  `userId` int(10) unsigned NOT NULL,
  `series` varchar(32) NOT NULL,
  `token` varchar(32) NOT NULL,
  `expires` int(10) unsigned NOT NULL,
  PRIMARY KEY (`userId`,`series`),
  KEY `expires` (`expires`),
  KEY `uid_expires` (`userId`,`expires`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user_persistent_login`
--

INSERT INTO `user_persistent_login` (`userId`, `series`, `token`, `expires`) VALUES
(1, '22aa0e1b04ef00e481fe7b3153843c97', 'cdaaa7d10c4d2f52e4ff454c6212adc5', 1946473851);
