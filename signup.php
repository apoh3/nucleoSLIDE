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
            $emailInput = "";
			$emailExc = "";			
			$emailError = "";
			$userValid = FALSE;
            $passValid = FALSE;
            $emailValid = FALSE;
			
			if($_SERVER["REQUEST_METHOD"] == "POST") {
				$db = new SQLite3("db/nucleoslideDB.sqlite"); //connect to db
				
				$userInput = $_POST["user"];
				$emailInput = $_POST["email"];
				$passInput = $_POST["pass"];
				
				if(strlen($userInput) > 0) { //check username input
					$result = $db->query("SELECT username FROM users WHERE username='$userInput'");

					$userValid = TRUE;
					$userError = "";
						
					while ($row = $result->fetchArray()) { //invalid username (already exists)
						$userValid = FALSE;
						$userError = "username already exists";	
					}
				} else { //no input
					$userError = "missing username";
				}
				
				if(strlen($emailInput) > 0) { //check email input
					if(!filter_var($emailInput, FILTER_VALIDATE_EMAIL)) { //not valid
						$emailValid = FALSE;
						$emailError = "invalid email address";
					} else {
						$result = $db->query("SELECT email FROM users WHERE email='$emailInput'");

						$emailValid = TRUE;
						$emailError = "";
					
						while ($row = $result->fetchArray()) { //invalid email (already exists)
							$emailValid = FALSE;
							$emailError = "email address belongs to another account";	
						}
					}
				} else { //no input
					$emailError = "missing email";
				}
				
				if(strlen($passInput) > 0) { //check password input				
					if(strlen($passInput) < 8) { //too short password
						$passValid = FALSE;
						$passError = "password must be at least 8 characters in length";
					} else if($userValid == TRUE && $emailValid == TRUE) { //add to database
						$db->exec("INSERT INTO users(username,email,password,level,score,badges,geneiusBadges) VALUES ('$userInput', '$emailInput', '$passInput', '0', '0', '0', '0')");	
						
						$passValid = TRUE;
					}
				} else if(strlen($passInput) <= 0) { //no input
					$passError = "missing password";
				}
				
				if($userValid == TRUE && $emailValid == TRUE && $passValid == TRUE) { //move on
					$db->close();
					echo "<script> Login('$userInput'); </script>";
				} else {
					if($userError !== "") {
						$userExc = "!";
					} 
	
					if($emailError !== "") {
						$emailExc = "!";
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
						<text id="loginTitleP1">Join </text> <text id="loginTitleP2">nucleo</text><text id="loginTitleP3">SLIDE</text></br>
						<text id="loginTitleP4">Set up an account to begin helping scientists today!</text>
						<img src="img/signupImg.png" alt="superhero scientist image">
					</td>

					<td class="rightSide">
						<form class="loginForm" method="post" autocomplete="off" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
							<table class="formTable">
								<tr>
									<td>
										<input type="text" id="user" name="user" placeholder="username" value="<?php echo $userInput;?>">
										<br><span class="errorMsg"> <div class="errorDiv" tooltip="<?php echo $userError;?>"><?php echo $userExc;?></div> </span>
									</td>
                                </tr>
                                <tr>
									<td>
                                        <input type="text" id="email" name="email" placeholder="email" value="<?php echo $emailInput;?>">
                                        <br><span class="errorMsg"> <div class="errorDiv" tooltip="<?php echo $emailError;?>"><?php echo $emailExc;?></div> </span>
									</td>
								</tr>
								<tr>
									<td>
										<input type="password" id="pass" name="pass" placeholder="password (at least 8 characters)" value="<?php echo $passInput;?>">
										<br><span class="errorMsg"> <div class="errorDiv" tooltip="<?php echo $passError;?>"><?php echo $passExc;?></div> </span>
									</td>
								</tr>
								<tr>
									<td>
										<input id="signupBtn" type="submit" name="submit" value="Sign Up">
									</td>
								</tr>
								<tr>
									<td>
										<text id="newPlayerTxt">already have an account? <a href="index.php">login in</a> instead</text>
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