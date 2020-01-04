<?php

// Upload File
function upload($fileCode, $fileType, $oldPath){
	$newPath = "../asset/upload/{$fileCode}.{$fileType}";
	move_uploaded_file($oldPath, $newPath);
}

// Remove File
function remove($fileName){
	$path = '../asset/upload/';

	foreach ($fileName as $fn) {
		if (file_exists($path . $fn)) {
			unlink($path . $fn);
		}
	}
}