<?php

// Namespace
namespace Api\core;

// Database
class Database{
	// Property
	public $conn;
	private $host = "localhost";
	private $username = "root";
	private $password = "";
	private $dbName = "dumv";

	// Constructor
	public function __construct(){
		try{
			$dsn = "mysql:host={$this->host};dbname={$this->dbName}";
			$dbh = new \PDO($dsn, $this->username, $this->password, array(
				\PDO::ATTR_PERSISTENT => TRUE
			));

			$this->conn = $dbh;
		}catch(PDOException $e){
			echo $e->getMessage();
		}
	}
}