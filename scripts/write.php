<?php
	//update users and insert into results when level complete
	
	$db = new SQLite3("../db/nucleoslideDB.sqlite");

    $user = htmlspecialchars($_GET["user"]);
	$level = htmlspecialchars($_GET["level"]);
    $score = htmlspecialchars($_GET["score"]);
    $attempts = htmlspecialchars($_GET["attempts"]);
    $solution = htmlspecialchars($_GET["solution"]);
	$badges = htmlspecialchars($_GET["badges"]);
    $genBadges = htmlspecialchars($_GET["genBadges"]);
		
	$db->exec("UPDATE users SET level='$level'+1, score=score+'$score', badges='$badges', geneiusBadges='$genBadges' WHERE username='$user'");
	
	$result = $db->query("SELECT userid FROM users WHERE username='$user'");
	
	while ($row = $result->fetchArray()) {
		$userid = $row['userid'];
	}
	
	$db->exec("INSERT INTO results(level,score,attempts,solution,userid) VALUES('$level','$score','$attempts','$solution','$userid')");

    $db->close();
?>