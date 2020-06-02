<!--
	nucleoSLIDE: citizen science game for the Motif Finding Problem

	author: Allison Poh
	for graduate thesis (University of Massachusetts Dartmouth)
-->

<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="styles.css">
		<link rel="icon" type="image/png" href="img/fav.png">
		<title>nucleoSLIDE</title>
	</head>
	
	<body class="loginBody">
		<script src="scripts/loginScript.js"></script>
	
		<?php	
			$userInput = "";
			$userExc = "";
			$userError = "";
			$passInput = "";
			$passExc = "";			
			$passError = "";
			$userValid = FALSE;
			$passValid = FALSE;
			
			$db = new SQLite3("db/nucleoslideDB.sqlite"); //connect to db
			//$db->exec("ALTER TABLE users ADD COLUMN badges INT DEFAULT 0");
			//$db->exec("ALTER TABLE users ADD COLUMN geneiusBadges INT DEFAULT 0");
			//$db->exec("UPDATE users SET level = 4, score = 412, badges = 4, geneiusBadges = 2, settings = '', state = '', history = '' WHERE username = 'newuser';");
			//$db->exec("DELETE from users");
			//$db->exec("DELETE from results");
			$db->close();
			
			if($_SERVER["REQUEST_METHOD"] == "POST") {
				$db = new SQLite3("db/nucleoslideDB.sqlite"); //connect to db
				
				$userInput = $_POST["user"];
				$passInput = $_POST["pass"];
				
				if(strlen($userInput) > 0) { //check username input
					$result = $db->query("SELECT username FROM users WHERE username='$userInput'");

					$userValid = FALSE;
					$userError = "invalid username";
						
					while ($row = $result->fetchArray()) { //valid username
						$userValid = TRUE;
						$userError = "";
					}
				} else { //no input
					$userError = "missing username";
				}
				
				if(strlen($passInput) > 0 && $userValid == TRUE) { //check password input
					$result = $db->query("SELECT password FROM users WHERE password='$passInput'");

					$passValid = FALSE;
					$passError = "invalid password";
						
					while ($row = $result->fetchArray()) { //valid password
						$passValid = TRUE;
						$passError = "";
					}
					
					if($passValid = TRUE && $userValid == TRUE) { //check if username and password match
						$result = $db->query("SELECT password FROM users WHERE username='$userInput' AND password='$passInput'");
						
						$passValid = FALSE;
						$userValid = FALSE;
						$userError = "username and password do not match";
						$passError = "username and password do not match";
						
						while ($row = $result->fetchArray()) { //match
							$passValid = TRUE;
							$userValid = TRUE;
							$userError = "";
							$passError = "";
						}
					}
				} else if(strlen($passInput) <= 0) { //no input
					$passError = "missing password";
				}
				
				if($userValid == TRUE && $passValid == TRUE) {	//log in successful
					$db->close();				
					echo "<script> Login('$userInput'); </script>";
				} else { //log in unsuccessful, tell user
					if($userError !== "") {
						$userExc = "!";
					} 

					if($passError !== "") {
						$passExc = "!";
					}
				}
			}
		?>

		<div class="loginDiv">
			<table class="loginTable">
				<tr>
					<td class="leftSide">
						<text id="loginTitleP1">Welcome to </text> <text id="loginTitleP2">nucleo</text><text id="loginTitleP3">SLIDE</text></br>
						<text id="loginTitleP4">The science-based puzzle game.</text>
						<img src="img/loginImg.png" alt="scientist image">
					</td>

					<td class="rightSide">
						<form class="loginForm" method="post" autocomplete="off" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
							<table class="formTable">
								<tr>
									<td>
										<input type="text" id="user" name="user" placeholder="username or email" value="<?php echo $userInput;?>">
										<br><span class="errorMsg"> <div class="errorDiv" tooltip="<?php echo $userError;?>"><?php echo $userExc;?></div> </span>
									</td>
								</tr>
								<tr>
									<td>
										<input type="password" id="pass" name="pass" placeholder="password" value="<?php echo $passInput;?>">
										<br><span class="errorMsg"> <div class="errorDiv" tooltip="<?php echo $passError;?>"><?php echo $passExc;?></div> </span>
									</td>
								</tr>
								<tr>
									<td>
										<input id="loginBtn" type="submit" name="submit" value="Log In">
									</td>
								</tr>
								<tr>
									<td>
										<text id="newPlayerTxt">new player? <a href="signup.php">sign up</a> instead</text>
									</td>
								</tr>
							</table>
						</form>
						
						<p><a id="loginAbout" href="about.html" target="_blank">About</p>
					</td>
				</tr>
			</table>
			
		</div>
	</body>
</html>