<?php

// Namespace
namespace Api\core;

// Request Class
class Request extends Database implements Scheme{
	// Property
	protected $result;

	// Constructor
	public function __construct(){
		parent::__construct();

		$requestMethod = $_SERVER['REQUEST_METHOD'];
		
		switch ($requestMethod) {
			case 'GET':
				$this->get();
				break;

			case 'POST':
				$this->post($_FILES);
				break;

			case 'DELETE':
				$this->delete(json_decode(file_get_contents("php://input")));
				break;
		}

	}

	// Get
	public function get(){
		try{
			$query = "SELECT * FROM image";
			$stmt = $this->conn->prepare($query);
			$stmt->execute();
			$data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
			$this->result = $data;
		}catch(PDOException $e){
			echo $e->getMessage();
		}

		echo json_encode($this->result);
	}

	// Post
	public function post($file){
		// File attribute
		$fileName = $file['img']['name'];
		$fileType = $file['img']['type'];
		$fileTmp = $file['img']['tmp_name'];
		$fileError = $file['img']['error'];
		$fileSize = $file['img']['size'];

		// Option
		$allowedExt = array('jpg', 'jpeg', 'png');

		// Redefine File attribute
		$code = uniqid();
		$name = explode('.', $fileName)[0];
		$type = strtolower(explode('/', $fileType)[1]);
		$size = $fileSize;
		$width = getimagesize($fileTmp)[0];
		$height = getimagesize($fileTmp)[1];
		$url = "{$code}.{$type}";
		$prepareStmt = array($code, $name, $size, $type, $width, $height, $url);

		// Check
		if ($fileError === 1) {
			$this->result = ['status' => 0, 'res' => 'Terdapat error pada file'];
		}elseif (!in_array($type, $allowedExt)) {
			$this->result = ['status' => 0, 'res' => 'Format file tidak diketahui'];
		}elseif ($size > 40000000) {
			$this->result = ['status' => 0, 'res' => 'Ukuran File terlalu besar'];
		}else{
			upload($code, $type, $fileTmp);
			try{
				$query = "INSERT INTO image(code, name, size, type, width, height, url) VALUES(?, ?, ?, ?, ?, ?, ?)";
				$stmt = $this->conn->prepare($query);
				if ($stmt->execute($prepareStmt)) {
					$this->result = ['status' => 1, 'res' => 'Success'];
				}else{
					$this->result = ['status' => 0, 'res' => 'Failed'];
				}
			}catch(PDOException $e){
				echo $e->getMessage();
			}
		}

		echo json_encode($this->result);
	}

	// Delete
	public function delete($codes){
		$listing = "'" . implode('\', \'', $codes[0]) . "'";
		
		try{
			remove($codes[1]);
			$query = "DELETE FROM image WHERE code IN ($listing)";
			$stmt = $this->conn->prepare($query);
			if ($stmt->execute()) {
				$this->result = ['status' => 1, 'res' => 'Success'];
			}else{
				$this->result = ['status' => 0, 'res' => 'Failed'];
			}
		}catch(PDOException $e){
			echo $e->getMessage();
		}

		echo json_encode($this->result);
	}

}