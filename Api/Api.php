<?php

use Api\core\Request as Request;

// Load Helper
require __DIR__ . "/helper/helper.php";

// Load Class
spl_autoload_register(function($class){
	$class = explode("\\", $class);
	$class = end($class);

	require __DIR__ . "/core/" . $class . ".php";
});


// Initialize
$api = new Request;