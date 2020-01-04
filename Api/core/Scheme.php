<?php

// Namespace
namespace Api\core;

// Interface
interface Scheme{

	public function get();

	public function post($file);

	public function delete($codes);
}