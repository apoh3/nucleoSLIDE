<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="styles.css">
		<link rel="icon" type="image/png" href="img/fav.png">
		<title>nucleoSLIDE</title>
	</head>

	<body id="gameBody">
		<section id="gameUIContainer">
			<div id="gameDiv"> 					
				<div id="workspaceDiv"></div>	
				<div id="statusBarDiv"></div>		
			</div>	
			<div id="controlPanelDiv"></div>			
		</section>

		<script type="text/javascript" src="scripts/sequences.json"></script>
		<script src="scripts/dataExtractor.js"></script>
		
		<?php
			$user = htmlspecialchars($_GET["user"]);
			
			$level = -1;
			$userScore = 0;
			$totalUsers = 0;
			$ranking = 1;
			
			$db = new SQLite3("db/nucleoslideDB.sqlite"); //connect to db
			
			$result = $db->query("SELECT score FROM users WHERE username='$user'"); //get user score
			
			while ($row = $result->fetchArray()) {
				$userScore = $row['score'];
				$totalUsers++;
			}
			
			$result = $db->query("SELECT score FROM users WHERE username!='$user'"); //get all other scores
			
			while ($row = $result->fetchArray()) { //determine ranking
				$otherScore = $row['score'];
				$totalUsers++;
				
				if($otherScore > $userScore) {
					$ranking++;
				}
			}
			
			echo "<script> SetRanking('$ranking','$totalUsers'); </script>";
			
			$result = $db->query("SELECT * FROM users WHERE username='$user'");
				
			while ($row = $result->fetchArray()) { //valid username
				$userid = $row["userid"];
				$username = $row["username"];
				$email = $row["email"];
				$password = $row["password"];
				$level = $row["level"];
				$score = $row["score"];
				$settings = $row["settings"];
				$state = $row["state"];
				$history = $row["history"];
				$badges = $row["badges"];
				$geneiusBadges = $row["geneiusBadges"];
				
				echo "<script> RetrieveUserProfile('$userid','$username','$email','$password','$level','$score','$settings','$state', '$history', '$badges', '$geneiusBadges'); </script>";
			}
			
			echo "<script> BuildPuzzleOnLoad(); </script>";
			
			$db->close();
		?>	
		
		<script src="scripts/gameScript.js"></script>
		<script src="scripts/btnScript.js"></script>
		<script src="scripts/customAlert.js"></script>
		<script src="scripts/UIScript.js"></script>	
		<script src="scripts/motifSearch.js"></script>

		<div id="blank"></div>
	</body>
</html>