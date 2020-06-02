<?php
	//update users when game exited

	$db = new SQLite3("../db/nucleoslideDB.sqlite");
	
    $user = htmlspecialchars($_GET["user"]);
    $state = htmlspecialchars($_GET["state"]);
    $history = htmlspecialchars($_GET["history"]);
	$settings = htmlspecialchars($_GET["settings"]);

    $db->exec("UPDATE users SET state='$state', history='$history', settings='$settings' WHERE username='$user'");
	
    $db->close();
?> 