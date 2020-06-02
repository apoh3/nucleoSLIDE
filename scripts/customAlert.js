/*
 * Custom Alerts for nucleoSLIDE: creates overlay alerts for tutorial, submissions, and no new puzzles message
 *
 * author: Allison Poh
 * last modified: 5/12/2020
 * for MS Thesis, UMass Dartmouth (May 2020)
 */

var stepCnt = 0;

var tutorials = [
    {
        "title": "Welcome to ", //nucleoSLIDE
        "text": "You're about to embark on a path to real-world scientific discoveries! Whether you're a newbie to science, a professional biologist, or anywhere in between, let's make sure you've got the basics down before we hand out any nobel prizes.", 
        "btnTxt": "begin tutorial"
    },
    {
        "title": "What exactly will you be doing?", 
        "text": "You will shortly be asked to solve a series of puzzles. These puzzles include DNA sequences from real species. Have you heard of the Motif Finding Problem (MFP)? Unless you're a biologist or have a strong interest in the field, you probably haven't. No worries though! The puzzles presented here don't require any knowledge of MFP. All that's needed are your pattern recognition skills.", 
        "btnTxt": "next"
    },
    {
        "title": "Small example puzzle", 
        "text": "Given several rows of blocks, can you align the rows so that they best match within the boxed window?  (That is, can you find a common pattern (motif) among these sequences?)", 
        "btnTxt": "next"
    },
    {
        "title": "This seems simple ... why do we need you?", 
        "text": "Computers are great but they're not as awesome as you! In a quick second, you can spot out a pattern. You're a natural at pattern recognition! To this computer though, it's more like a Where's Waldo? Search and requires complicated algorithms. We need your help to better advance the current ways we find motifs.", 
        "btnTxt": "next"
    },
    {
        "title": "Will you accept the job?", 
        "text": "From playing with blocks in kindergarten to hunting for words in word searches, you've mastered the skills needed here! Now it's time to let those skills shine and assist scientists in the fight against the Motif Finding Problem!", 
        "btnTxt": "accept"
    }
]

//builds overlay alert for tutorial
function TutorialAlert(step) {
    stepCnt = step;

    var overlay = document.getElementById("overlay");

    var alertDiv = document.createElement("table");
    alertDiv.setAttribute("class", "alertDiv");

    var alertTable = document.createElement("table");
    alertTable.setAttribute("id", "alertTable");

    var tr = document.createElement("tr"); //row 0: close btn
    var td = document.createElement("td");
    td.setAttribute("id", "closeTD");

    var exitAlertBtn = document.createElement("button");
    exitAlertBtn.setAttribute("id", "exitAlertBtn");
    exitAlertBtn.innerHTML = "X";
    exitAlertBtn.addEventListener("click", CloseAlertListener);

    td.appendChild(exitAlertBtn);
    tr.appendChild(td);

    alertTable.appendChild(tr);

    var tr = document.createElement("tr"); //row 1: title
    var td = document.createElement("td");

    var titleText = document.createElement("text");
    titleText.setAttribute("id", "titleText");

    if(stepCnt == 1) {
        titleText.innerHTML = tutorials[stepCnt-1].title;
        td.appendChild(titleText);

        var titleText = document.createElement("text");
        titleText.setAttribute("id", "loginTitleP2");
        titleText.innerHTML = "nucleo";
        td.appendChild(titleText);

        var titleText = document.createElement("text");
        titleText.setAttribute("id", "loginTitleP3");
        titleText.innerHTML = "SLIDE";
        td.appendChild(titleText);
    } else {
        titleText.innerHTML = tutorials[stepCnt-1].title;
        td.appendChild(titleText);
    }

    tr.appendChild(td);

    alertTable.appendChild(tr);

    var tr = document.createElement("tr"); //row 2: text
    var td = document.createElement("td");
    td.setAttribute("class", "textTd");

    var stepText = document.createElement("text");
    stepText.setAttribute("id", "stepText");
    stepText.innerHTML = tutorials[stepCnt-1].text;

    td.appendChild(stepText);
    tr.appendChild(td);
    alertTable.appendChild(tr);

    if(stepCnt == 3) { //only for pattern example
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.appendChild(BuildPatternExample());
        tr.appendChild(td);
        alertTable.appendChild(tr);

        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.setAttribute("class", "textTd");

        var stepText = document.createElement("text");
        stepText.setAttribute("id", "stepText");
        stepText.innerHTML = "By sliding rows left and right, we were able to find a perfect match among all the sequences (note: not all puzzles will have a perfect solution).";

        td.appendChild(stepText);
        tr.appendChild(td);
        alertTable.appendChild(tr);
    }

    var tr = document.createElement("tr"); //row 3: next btn
    var td = document.createElement("td");

    if(stepCnt > 1) {
        var backTutBtn = document.createElement("button");
        backTutBtn.setAttribute("id", "backTutBtn");
        backTutBtn.innerHTML = "back";
        backTutBtn.addEventListener("click", BackTutorialStepListener);
    
        td.appendChild(backTutBtn);
    }

    var nextTutBtn = document.createElement("button");
    nextTutBtn.setAttribute("id", "nextTutBtn");

    if(stepCnt == 1) {
        nextTutBtn.setAttribute("id", "beginTutBtn");
    } else if(stepCnt == tutorials.length) {
        nextTutBtn.setAttribute("id", "acceptTutBtn");
    }
    
    nextTutBtn.innerHTML = tutorials[stepCnt-1].btnTxt;
    nextTutBtn.addEventListener("click", NextTutorialStepListener);

    td.appendChild(nextTutBtn);
    tr.appendChild(td);

    alertTable.appendChild(tr);

    alertDiv.appendChild(alertTable);
    overlay.appendChild(alertDiv);
}

//builds overlay alert for beginning level 1, or on submission
function AlertPlayer(level,attp,pts) {
    var overlay = document.getElementById("overlay");

    var alertDiv = document.createElement("table");
    alertDiv.setAttribute("class", "alertDiv");

    var alertTable = document.createElement("table");
    alertTable.setAttribute("id", "alertTable");

    var tr = document.createElement("tr"); //row 0: close btn
    var td = document.createElement("td");
    td.setAttribute("id", "closeTD");

    var exitAlertBtn = document.createElement("button");
    exitAlertBtn.setAttribute("id", "exitAlertBtn");
    exitAlertBtn.innerHTML = "X";
    exitAlertBtn.addEventListener("click", CloseAlertListener);
    exitAlertBtn.style.visibility = "hidden";

    td.appendChild(exitAlertBtn);
    tr.appendChild(td);

    alertTable.appendChild(tr);

    if(level > -1) {
		AddBeginLevelText(level,alertTable);
	} else if(level == -3) {
		AddEndLevelText(level,alertTable,true,-1,pts);
	} else if(level == -2) {
		AddEndLevelText(level,alertTable,false,attp,pts);
	}

    alertDiv.appendChild(alertTable);
    overlay.appendChild(alertDiv);
}

//builds overlay for level 1
function AddBeginLevelText(level,alertTable) {
	var tr = document.createElement("tr"); //row 1: title
    var td = document.createElement("td");

    var titleText = document.createElement("text");
    titleText.setAttribute("id", "titleText");
    titleText.innerHTML = "It's show time!";

    td.appendChild(titleText);
    tr.appendChild(td);
    alertTable.appendChild(tr);

    var tr = document.createElement("tr"); //row 2: text
    var td = document.createElement("td");

    var stepText = document.createElement("text");
    stepText.setAttribute("id", "stepText");
    stepText.innerHTML = "Good luck " + userInfo[0];

    td.appendChild(stepText);
    tr.appendChild(td);
    alertTable.appendChild(tr);

    var tr = document.createElement("tr"); //row 3: begin btn
    var td = document.createElement("td");

    var beginTutBtn = document.createElement("button");
    beginTutBtn.setAttribute("id", "beginTutBtn");
    beginTutBtn.innerHTML = "finish puzzle";
    beginTutBtn.addEventListener("click", BeginLevelListener);

    td.appendChild(beginTutBtn);
    tr.appendChild(td);

    alertTable.appendChild(tr);
}

//builds overlay for submission
function AddEndLevelText(level,alertTable,success,attp,pts) {
	var tr = document.createElement("tr"); //row 1: title
    var td = document.createElement("td");

    var titleText = document.createElement("text");
    titleText.setAttribute("id", "titleText");
	
	if(success) {
		titleText.innerHTML = "Great work!";
	} else {
		titleText.innerHTML = "You're not quite there yet";
	}

    td.appendChild(titleText);
    tr.appendChild(td);
    alertTable.appendChild(tr);

    var tr = document.createElement("tr"); //row 2: text
    var td = document.createElement("td");

    var stepText = document.createElement("text");
    stepText.setAttribute("id", "stepText");
	
	var scoreForNow = pointsHistory[pointsHistory.length-1];
	var badgeTitle = "na";
	
	if(scoreForNow >= solutionPts) {
		badgeTitle = "Gene-ius Badge";
	} else if(scoreForNow >= solutionPts*0.9) {
		badgeTitle = "Motif Finder Badge";
	} 
	
	if(success) {
		if(badgeTitle === "na") {
			stepText.innerHTML = "Your solution is at least an 85% match to ours. Congratulations!";
		} else if(badgeTitle === "Motif Finder Badge") {
			stepText.innerHTML = "You've earned a " + badgeTitle + "! Your solution is at least a 90% match to ours. Congratulations!";
		} else {
			stepText.innerHTML = "You've earned a " + badgeTitle + "! Your solution is perfect! Congratulations!";
		}
	} else {
		stepText.innerHTML = "The submitted score is not within range of our score. Keep trying. You've got this!";
		
		if(attp >= 3) {
			stepText.innerHTML += " (hint: you need at least " + pts + " points to move on)";
		}
	}

    td.appendChild(stepText);
    tr.appendChild(td);
    alertTable.appendChild(tr);
	
	if(success) {
		var tr = document.createElement("tr"); //image row
		var td = document.createElement("td");
	
		var img = document.createElement("img");
		
		if(badgeTitle === "Motif Finder Badge") {
			img.src = "img/badge.png"; 
			img.height = "120";
		
			td.appendChild(img);
			tr.appendChild(td);
			alertTable.appendChild(tr);
		} else if(badgeTitle === "Gene-ius Badge") {
			img.src = "img/geneiusBadge.png"; 
			img.height = "120";
		
			td.appendChild(img);
			tr.appendChild(td);
			alertTable.appendChild(tr);
		}
	}
		
    var tr = document.createElement("tr"); //row 3: begin btn
    var td = document.createElement("td");
	
	if(success) {
		var keepWorking = document.createElement("button");
		keepWorking.setAttribute("id", "keepWorking_succ_G");
		
		if(badgeTitle !== "Gene-ius Badge") {
			keepWorking.innerHTML = "try for perfection";
		} else {
			keepWorking.innerHTML = "admire work";
		}
		
		keepWorking.style.marginRight = "15px";
		
		if(badgeTitle !== "Gene-ius Badge") {
			keepWorking.style.marginLeft = "15px";
			keepWorking.setAttribute("id", "keepWorking_succ_noG");
		}
		
		keepWorking.addEventListener("click", ReturnToPuzzleListener);
		
		td.appendChild(keepWorking);
		
		var nextPuzzle = document.createElement("button");
		nextPuzzle.setAttribute("id", "nextPuzzle_succ");
		nextPuzzle.innerHTML = "next puzzle";
		nextPuzzle.addEventListener("click", NextPuzzleListener);
		
		td.appendChild(nextPuzzle);
		tr.appendChild(td);
	} else {
		var keepWorking = document.createElement("button");
		keepWorking.setAttribute("id", "keepWorking_fail");
		keepWorking.innerHTML = "return to puzzle";
		keepWorking.addEventListener("click", ReturnToPuzzleListener);
		
		td.appendChild(keepWorking);
		tr.appendChild(td);
	}

    alertTable.appendChild(tr);
}

//closes overlay and resets badges if not moving on
function ReturnToPuzzleListener() {	
	if(this.id === "keepWorking_succ_G") {
		badges--;
		geneiusBadges--;
		earnedBadge = false;
	} else if(this.id === "keepWorking_succ_noG") {
		badges--;
		earnedBadge = false;	
	}
	
	document.getElementById("overlay").style.display = "none";
}

//move on to next puzzle if next level is selected
function NextPuzzleListener() {
	document.getElementById("overlay").style.display = "none";
	
	levelScore = parseInt(Math.max(...pointsHistory));
	userInfo[2] = parseInt(userInfo[2]) + levelScore;
	
	UpdateDatabase();
	
	if(currLevel == levelsMade-1) {
		OutOfLevels();
	} else {	
		userInfo[1]++; //level increase
		currLevel++;
	
		document.getElementById("workspaceDiv").innerHTML = "";
		document.getElementById("controlPanelDiv").innerHTML = "";
		document.getElementById("statusBarDiv").innerHTML = "";
		
		ClearLevel();
	}
}

//move back in tutorial overlay
function BackTutorialStepListener() {
    var overlay = document.getElementById("overlay");
    
    overlay.innerHTML = '';
    TutorialAlert(stepCnt-1);
}

//move forward in tutorial overlay
function NextTutorialStepListener() {
    var overlay = document.getElementById("overlay");
    
    if(stepCnt+1 <= tutorials.length) {
        overlay.innerHTML = '';

        TutorialAlert(stepCnt+1);
    } else {
        overlay.innerHTML = '';
        document.body.removeChild(overlay);

        OpenTutorialLevel();
    }
}

//close overlay alert
function CloseAlertListener() {
    document.getElementById("overlay").style.display = "none";
    OpenTutorialLevel();
}

//build example puzzle for tutorial overlay
function BuildPatternExample() {
    var exSeqs = ["ACTGACX ACTGACX", "CCATGAX CATGAXC", "TGAAACX CXTGAAA", "CGCTGAX GCTGAXC", "AATGACX AATGACX"]; 
    exExtraPerSide = 2;

    var exDiv = document.createElement("div");
    exDiv.setAttribute("id","exDiv");

    for(var i = 0; i < exSeqs.length; i++) {
        var rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "rowDiv");

        for(var j = 0; j < exSeqs[i].length; j++) {
            var nuclDiv = document.createElement("div");
            nuclDiv.setAttribute("class", "nuclDiv");

            var text = document.createElement("text");
            text.innerHTML = exSeqs[i].charAt(j);

            if (j >= 2 && j <= 4) { //left: puzzle
				if (i == 0) nuclDiv.style.borderTop = "thick solid black";
				if (j == exExtraPerSide) nuclDiv.style.borderLeft = "thick solid black";
				if (i == exSeqs.length-1) nuclDiv.style.borderBottom = "thick solid black";
				if (j == 4) nuclDiv.style.borderRight = "thick solid black";
            } else if (j >= 10 && j <= 12) { //right: solution
				if (i == 0) nuclDiv.style.borderTop = "thick solid black";
				if (j == 10) nuclDiv.style.borderLeft = "thick solid black";
				if (i == exSeqs.length-1) nuclDiv.style.borderBottom = "thick solid black";
				if (j == 12) nuclDiv.style.borderRight = "thick solid black";
			}

            if (exSeqs[i].charAt(j) == "A") {
                nuclDiv.setAttribute("class", "adenosine nuclDiv");
            } else if (exSeqs[i].charAt(j) == "T") {
                nuclDiv.setAttribute("class", "thymine nuclDiv");
            } else if (exSeqs[i].charAt(j) == "C") {
                nuclDiv.setAttribute("class", "cytosine nuclDiv");
            } else if (exSeqs[i].charAt(j) == "G") {
                nuclDiv.setAttribute("class", "guanine nuclDiv");
            } else if (exSeqs[i].charAt(j) == "X") {
                nuclDiv.setAttribute("class", "noneine nuclDiv");
            } else if(exSeqs[i].charAt(j) == " ") {
                if(i == 2) {
                    text.innerHTML = "&rarr;";
                    text.style.color = "black";
                    text.style.fontSize = "36px";
                }

                nuclDiv.setAttribute("class", "blankSpace nuclDiv");
            }

            nuclDiv.appendChild(text);
            rowDiv.appendChild(nuclDiv);
        }

        exDiv.appendChild(rowDiv);
    }

    return exDiv;
}

//begin level by hiding overlay
function BeginLevelListener() {
    document.getElementById("overlay").style.display = "none";
}

//build message to tell user there are no more puzzles at this time
function OutOfLevels() {
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = '';

    var alertDiv = document.createElement("table");
    alertDiv.setAttribute("class", "alertDiv");

    var alertTable = document.createElement("table");
    alertTable.setAttribute("id", "alertTable");

    var tr = document.createElement("tr"); //row 0: close btn
    var td = document.createElement("td");
    td.setAttribute("id", "closeTD");

    var exitAlertBtn = document.createElement("button");
    exitAlertBtn.setAttribute("id", "exitAlertBtn");
    exitAlertBtn.innerHTML = "X";
    exitAlertBtn.addEventListener("click", CloseAlertListener);
    exitAlertBtn.style.visibility = "hidden";

    td.appendChild(exitAlertBtn);
    tr.appendChild(td);

    alertTable.appendChild(tr);
	
	overlay.style.display = "block";
	
    var tr = document.createElement("tr");
    var td = document.createElement("td");

    var titleText = document.createElement("text");
    titleText.setAttribute("id", "titleText");
    titleText.innerHTML = "Wow! You solve puzzles faster than we can create them.";

    td.appendChild(titleText);
    tr.appendChild(td);
    alertTable.appendChild(tr);

    var tr = document.createElement("tr"); //row 2: text
    var td = document.createElement("td");

    var stepText = document.createElement("text");
    stepText.setAttribute("id", "stepText");
    stepText.innerHTML = "Stay tuned for new puzzles.";

    td.appendChild(stepText);
    tr.appendChild(td);
    alertTable.appendChild(tr);

    var tr = document.createElement("tr"); //row 3: begin btn
    var td = document.createElement("td");

    var beginTutBtn = document.createElement("button");
    beginTutBtn.setAttribute("id", "beginTutBtn");
    beginTutBtn.innerHTML = "exit";
    beginTutBtn.addEventListener("click", ExitListener);

    td.appendChild(beginTutBtn);
    tr.appendChild(td);

    alertTable.appendChild(tr);
	alertDiv.appendChild(alertTable);
    overlay.appendChild(alertDiv);
}