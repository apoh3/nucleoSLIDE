/*
 * Button Script for nucleoSLIDE: contains button listeners and related functions
 *
 * author: Allison Poh
 * last modified: 5/12/2020
 * for MS Thesis, UMass Dartmouth (May 2020)
 */

var motifHistory = [];
var pointsHistory = [];
var indexHistory = [];
var historyStr = "";
var currRow = 0;
var arrowOpacity = 0.7;
var levelScore = 0;
var earnedBadge = false;

//btnProfile onClick opens/closes profile dropdown
function ProfileListener() {
	var div = document.getElementById("profileDiv");
	
	if(div.style.display === "none") {
		div.style.display = "block";
	} else {
		div.style.display = "none";
	}
}

//btnSettings onClick opens/closes settings dropdown
function SettingsListener() {
	var div = document.getElementById("settingsDiv");
	
	if(div.style.display === "none") {
		div.style.display = "block";
	} else {
		div.style.display = "none";
	}
}

//update interaction setting
function SettingsInteractionListener() {
	var options = ["Click", "Arrow Keys", "Drag"];
	var selected = this.innerHTML;
	
	if(selected === options[0]) {
		this.innerHTML = options[1];
		settings_int = options[1];
		SettingsArrowListener();
	} else if(selected === options[1]) {
		this.innerHTML = options[2];
		settings_int = options[2];
		SettingsDragListener();
	} else if(selected === options[2]) {
		this.innerHTML = options[0];
		settings_int = options[0];
		SettingsClickListener();
	}	
}

//update sensitivity setting
function SettingsSensitivityListener() {
	var options = ["Low", "Normal", "High"];
	var selected = this.innerHTML;
	
	if(selected === options[0]) {
		this.innerHTML = options[1];
		settings_sens = options[1];
		ChangeDragSpeed(12)
	} else if(selected === options[1]) {
		this.innerHTML = options[2];
		settings_sens = options[2];
		ChangeDragSpeed(7)
	} else if(selected === options[2]) {
		this.innerHTML = options[0];
		settings_sens = options[0];
		ChangeDragSpeed(20)
	}
} 

//update speed of interaction
function ChangeDragSpeed(val) {
	speed = val;
}

//update color setting
function SettingsColorListener() {
	var options = ["Scheme1", "Scheme2", "Scheme3", "Scheme4", "Scheme5"];
	var children = this.childNodes;
	var selScheme = "";
	
	for(var i = 0; i < children.length; i++) {
		selScheme += children[i].innerHTML;
	}
	
	if(selScheme === options[0]) {
		BuildColorSchemePreview(1,this,options[1]);
		settings_color = options[1];
		ChangeColor(1);
	} else if(selScheme === options[1]) {
		BuildColorSchemePreview(2,this,options[2]);
		settings_color = options[2];
		ChangeColor(2);
	} else if(selScheme === options[2]) {
		BuildColorSchemePreview(3,this,options[3]);
		settings_color = options[3];
		ChangeColor(3);
	} else if(selScheme === options[3]) {
		BuildColorSchemePreview(4,this,options[4]);
		settings_color = options[4];
		ChangeColor(4);
	} else if(selScheme === options[4]) {
		BuildColorSchemePreview(0,this,options[0]);
		settings_color = options[0];
		ChangeColor(0);
	}

	selScheme = "";
}

//change preview of scheme in settings dropdown
function BuildColorSchemePreview(s,btn,str) {
	var scheme = "Scheme"+s;
	
	if(str === "Scheme1" || str === "Scheme2") {
		var colors = ["rgb(255,43,8)", "rgb(0,188,13)", "rgb(0,154,255)", "rgb(255,181,7)","rgb(255,43,8)", "rgb(0,188,13)", "rgb(0,154,255)", "rgb(255,181,7)"];
	} else if(str === "Scheme3") {
		var colors = ["rgb(102,255,0)", "rgb(255,51,0)", "rgb(255,255,0)", "rgb(102,0,255)","rgb(102,255,0)", "rgb(255,51,0)", "rgb(255,255,0)", "rgb(102,0,255)"];
	} else if(str === "Scheme4") {
		var colors = ["rgb(160,160,255)", "rgb(160,255,160)", "rgb(255,140,75)", "rgb(255,112,122)","rgb(160,160,255)", "rgb(160,255,160)", "rgb(255,140,75)", "rgb(255,112,122)"];
	} else if(str === "Scheme5") {
		var colors = ["rgb(255,109,109)", "rgb(116,206,152)", "rgb(118,157,204)", "rgb(242,190,60)","rgb(255,109,109)", "rgb(116,206,152)", "rgb(118,157,204)", "rgb(242,190,60)"];
	}
	
	var children = btn.childNodes;
	
	for(var i = 0; i < children.length; i++) {
		children[i].innerHTML = str.charAt(i);
		children[i].style.color = colors[i];
	}
	
	if(str === "Scheme2") {
		children[str.length-1].style.color = "grey";
	}
}

//update workspace to allow click interaction
function SettingsClickListener() {
	var leftBtns = document.getElementsByClassName('leftArrow');
	var rightBtns = document.getElementsByClassName('rightArrow');
	var rows = document.getElementsByClassName('draggableRows');

	for(var i = 0; i < leftBtns.length; i++) {
		leftBtns[i].disabled = false;
		rightBtns[i].disabled = false;
		
		leftBtns[i].style.visibility = "visible";
		rightBtns[i].style.visibility = "visible";
		
		rows[i].style.opacity = "1";
		rows[i].style.backgroundColor = "transparent";
		rows[i].removeEventListener('click', RowClickedListener);		
	}

	document.onkeydown = TurnOffKeys;
	
	dragFlag = false;
}

//update workspace to allow arrow key interaction
function SettingsArrowListener() {
	var leftBtns = document.getElementsByClassName('leftArrow');
	var rightBtns = document.getElementsByClassName('rightArrow');
	var rows = document.getElementsByClassName('draggableRows');
	var overviewRows = document.getElementsByClassName('overviewRows');
	currRow = 0;

	for(var i = 0; i < leftBtns.length; i++) {
		leftBtns[i].disabled = true;
		rightBtns[i].disabled = true;
		
		leftBtns[i].style.visibility = "hidden";
		rightBtns[i].style.visibility = "hidden";
		
		rows[i].style.opacity = arrowOpacity;
		rows[i].style.backgroundColor = "transparent";
		rows[i].removeEventListener('click', RowClickedListener);
		
		overviewRows[i].style.opacity = arrowOpacity;
		overviewRows[i].style.backgroundColor = "transparent";
	}

	leftBtns[0].disabled = false;
	rightBtns[0].disabled = false;			
	leftBtns[0].style.visibility = "visible";
	rightBtns[0].style.visibility = "visible";

	rows[0].style.opacity = "1";
	rows[0].style.backgroundColor = "lightgrey";

	overviewRows[0].style.opacity = "1";
	overviewRows[0].style.backgroundColor = "lightgrey";
	
	document.onkeydown = KeyCheck;
	
	dragFlag = false;
}

//update workspace to allow drag interaction
function SettingsDragListener() {
	var leftBtns = document.getElementsByClassName('leftArrow');
	var rightBtns = document.getElementsByClassName('rightArrow');
	var rows = document.getElementsByClassName('draggableRows');
	var overviewRows = document.getElementsByClassName('overviewRows');

	for(var i = 0; i < leftBtns.length; i++) {
		leftBtns[i].disabled = true;
		rightBtns[i].disabled = true;
		
		leftBtns[i].style.visibility = "hidden";
		rightBtns[i].style.visibility = "hidden";
		
		rows[i].style.opacity = "1";
		rows[i].style.backgroundColor = "transparent";
		rows[i].addEventListener('click', RowClickedListener);
		
		overviewRows[i].style.opacity = "1";
		overviewRows[i].style.backgroundColor = "transparent";
	}

	document.onkeydown = TurnOffKeys;
	
	dragFlag = true;
}

//on arrow key, check if keys pressed and update workspace
function KeyCheck(e) {
	e = e || window.event;

	var div = document.getElementById("settingsDiv");
	div.style.display = "none";
	
	var leftBtns = document.getElementsByClassName('leftArrow');
	var rightBtns = document.getElementsByClassName('rightArrow');
	var rows = document.getElementsByClassName('draggableRows');
	var overviewRows = document.getElementsByClassName('overviewRows');

    if(e.keyCode == '38') {
		if(currRow > 0) {
			currRow--;

			rows[currRow+1].style.backgroundColor = "transparent";
			rows[currRow+1].style.opacity = arrowOpacity;
			
			overviewRows[currRow+1].style.backgroundColor = "transparent";
			overviewRows[currRow+1].style.opacity = arrowOpacity;

			leftBtns[currRow+1].disabled = true;
			rightBtns[currRow+1].disabled = true;			
			leftBtns[currRow+1].style.visibility = "hidden";
			rightBtns[currRow+1].style.visibility = "hidden";

			rows[currRow].style.backgroundColor = "lightgrey";
			rows[currRow].style.opacity = "1";
			
			overviewRows[currRow].style.backgroundColor = "lightgrey";
			overviewRows[currRow].style.opacity = "1";

			leftBtns[currRow].disabled = false;
			rightBtns[currRow].disabled = false;			
			leftBtns[currRow].style.visibility = "visible";
			rightBtns[currRow].style.visibility = "visible";
		}        
    }
    else if(e.keyCode == '40') {
        if(currRow < rows.length-1) {
			currRow++;
			rows[currRow-1].style.backgroundColor = "transparent";
			rows[currRow-1].style.opacity = arrowOpacity;
			
			overviewRows[currRow-1].style.backgroundColor = "transparent";
			overviewRows[currRow-1].style.opacity = arrowOpacity;

			leftBtns[currRow-1].disabled = true;
			rightBtns[currRow-1].disabled = true;			
			leftBtns[currRow-1].style.visibility = "hidden";
			rightBtns[currRow-1].style.visibility = "hidden";

			rows[currRow].style.backgroundColor = "lightgrey";
			rows[currRow].style.opacity = "1";
			
			overviewRows[currRow].style.backgroundColor = "lightgrey";
			overviewRows[currRow].style.opacity = "1";

			leftBtns[currRow].disabled = false;
			rightBtns[currRow].disabled = false;			
			leftBtns[currRow].style.visibility = "visible";
			rightBtns[currRow].style.visibility = "visible";
		}
    }
    else if(e.keyCode == '37') {
		InitiateClick(rows[currRow].id,"leftArrow_");
    }
    else if(e.keyCode == '39') {
		InitiateClick(rows[currRow].id,"rightArrow_");
    }
}

//turn off arrow key interaction
function TurnOffKeys(e) {
	e = e || window.event;
	//do nothing
}

//update style sheet to selected color scheme
function ChangeColor(val) {
	var styles = "";
	
	if(val == 0) { //book
		styles = '.adenosine { background-color: rgb(255,43,8); /* red */ } .thymine { background-color: rgb(0,188,13); /* green */ } .cytosine { background-color: rgb(0,154,255); /* blue */ } .guanine { background-color: rgb(255,181,7); /* orange */ }' 
	} else if(val == 4) { //color by chemistry
		styles = '.adenosine { background-color: rgb(255,109,109); /* red */ } .thymine { background-color: rgb(116,206,152); /* green */ } .cytosine { background-color: rgb(118,157,204); /* blue */ } .guanine { background-color: rgb(242,190,60); /* orange */ }' 
	} else if(val == 3) { //shapely
		styles = '.adenosine { background-color: rgb(160,160,255); /* purple */ } .thymine { background-color: rgb(160,255,160); /* green */ } .cytosine { background-color: rgb(255,140,75); /* orange */ } .guanine { background-color: rgb(255,112,122); /* red */ }' 
	} else if(val == 2) { //taylor
		styles = '.adenosine { background: none; background-color: rgb(102,255,0); /* green */ } .thymine { background: none; background-color: rgb(255,51,0); /* red */ } .cytosine { background: none; background-color: rgb(255,255,0); /* yellow */ } .guanine { background: none; background-color: rgb(102,0,255); /* purple */ }' 
	} else if(val == 1) { //patterns
		styles = '.adenosine { background-color: white; background: url("img/patt1.png"); background-repeat: no-repeat; background-size: 100% 100%;} .thymine { background-color: white; background: url("img/patt4.png"); background-repeat: no-repeat; background-size: 100% 100%;} .cytosine { background-color: white; background: url("img/patt3.png"); background-repeat: no-repeat; background-size: 100% 100%;} .guanine { background-color: white; background: url("img/patt2.png"); background-repeat: no-repeat; background-size: 100% 100%;}' 
	} 
	
	var css = document.createElement('style'); 
	css.type = 'text/css'; 
  
	if(css.styleSheet)  
		css.styleSheet.cssText = styles; 
	else  
		css.appendChild(document.createTextNode(styles)); 
	  
	document.getElementsByTagName("head")[0].appendChild(css); 
}

//on exit (refresh, close tab), write to db to save state
function ExitListener() {
	IndexHistoryToString(indexHistory);

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		document.getElementById("blank").innerHTML = this.responseText;
	  }
	};
	
	var settingsCombined = settings_int+"/"+settings_sens+"/"+settings_color;
	
	xhttp.open("POST", 'scripts/saveState.php?user='+userInfo[0]+'&state='+ArrayToString(firstIdexes)+'&history='+historyStr+'&settings='+settingsCombined, true);
	xhttp.send();

	window.open('index.php','_self',true);
}

//when exit initiated, ask if they want to leave (message not supported by most browsers)
window.onbeforeunload = function (evt) {
	ExitListener();
	
	var message = 'Are you sure you want to leave?';
	
	if(typeof evt == 'undefined') {
		evt = window.event;
	}
	
	if(evt) {
		evt.returnValue = message;
	}
	
	return message;  
}

//format history to string for db
function IndexHistoryToString(arr) {
	historyStr = "";
	
	for(var i = 0; i < arr.length; i++) {
		for(var j = 0; j < arr[i].length; j++) {
			if(j == 0 && i != 0) {
				historyStr += "/";
			}

			if(j == arr[i].length-1) {
				historyStr += arr[i][j];
			} else {
				historyStr += arr[i][j] + ",";
			}
		}
	}
}

//btnEvaluate onClick adds kmers to history display
function EvaluateListener() {
	var motifs = GetMotifs();
	var indexes = CloneArray(firstIdexes);
	var calculated = CalculatePoints();
	
	var points = parseInt(calculated.split('_')[0]);
	var consensus = calculated.split('_')[1];
	
	motifHistory.push(motifs);
	pointsHistory.push(points);
	indexHistory.push(indexes);

	var div = document.getElementById("historyDiv");
	
	var motifsTable = document.createElement("table");
	motifsTable.setAttribute("class", "motifsTable");
	motifsTable.setAttribute("id", "motifsTable_"+(motifHistory.length-1));
	
	var pointRow = document.createElement("tr"); 
	pointRow.setAttribute("id", "pointRow");
	
	var td = document.createElement("td");
	td.setAttribute("colspan", sequences[0].k);
			
	var txt = document.createElement("text");
	txt.innerHTML = "points: " + points;
			
	td.appendChild(txt);
	pointRow.appendChild(td);
	
	motifsTable.appendChild(pointRow);
	
	for(var i = 0; i < motifs.length; i++) {
		var tr = document.createElement("tr");  

		for(var j = 0; j < motifs[i].length; j++) {
			var td = document.createElement("td");
			
			var motifsTxt = document.createElement("text");
			var nucl = motifs[i].charAt(j);
			motifsTxt.innerHTML = nucl;
			
			if(nucl == "A") {
				td.setAttribute("class", "adenosine");
			} else if(nucl == "T") {
				td.setAttribute("class", "thymine");
			} else if(nucl == "C") {
				td.setAttribute("class", "cytosine");
			} else if(nucl == "G") {
				td.setAttribute("class", "guanine");
			} else {
				td.setAttribute("class", "noneine");
			}	
			
			td.appendChild(motifsTxt);
			tr.appendChild(td);
		}
		
		motifsTable.appendChild(tr);
	}
	
	var conMotif = [];
	
	var conRow = document.createElement("tr"); 
	conRow.setAttribute("id", "consensusRow");
	
	for(var i = 0; i < motifs[0].length; i++) {
		conMotif.push(consensus.split(' ')[i]);
		
		var td = document.createElement("td");
			
		var txt = document.createElement("text");
		conMotif[i] = conMotif[i].replace(/-/g, ' ');
		var nucl = conMotif[i];
		txt.innerHTML = nucl;
				
		td.appendChild(txt);
		conRow.appendChild(td);
	}
	
	motifsTable.appendChild(conRow);
	
	div.appendChild(motifsTable);
	div.insertBefore(motifsTable, div.childNodes[2]);
	
	HighestPoints();
	
	ClearMotifs();

	if(this.id === "btnSubmit") {
		SubmitListener();
	}
}

//highlight kmers with highest points
function HighestPoints() {
	var idx = 0;
	var high = 0;
	
	for(var i = 0; i < pointsHistory.length; i++) {
		if(pointsHistory[i] > high) {
			idx = i;
			high = pointsHistory[i];
		}
	}
	
	var tables = document.getElementsByClassName('motifsTable');
	
	for(var i = 0; i < tables.length; i++) {
		tables[i].style.backgroundColor = "white";
		tables[i].style.borderColor = "white";
	}
	
	var table = document.getElementById("motifsTable_"+idx);
	table.style.backgroundColor = "yellow";
	table.style.borderColor = "yellow";
}

//btnSubmit onClick checks points of workspace and displays appropriate message
function SubmitListener() {	
	attempts++;

	var scoreForNow = pointsHistory[pointsHistory.length-1];
	
	if(scoreForNow >= Math.floor(solutionPts*0.85)) {
		if(userInfo[1] === "tutorial") {
			userInfo[1] = 0;
			currLevel = 0;
		}
		
		if(scoreForNow >= Math.floor(solutionPts*0.9) && earnedBadge == false) {	
			badges++;
			earnedBadge = true;
		}
		
		if(scoreForNow >= solutionPts) {
			badges++;
			earnedBadge = true;
			geneiusBadges++;
		}
		
		var overlay = document.createElement("div");
		overlay.setAttribute("id", "overlay");
		document.body.appendChild(overlay);

		document.getElementById("overlay").style.display = "block";
		
		AlertPlayer(-3,attempts,Math.floor(solutionPts*0.85));
	} else {
		var overlay = document.createElement("div");
		overlay.setAttribute("id", "overlay");
		document.body.appendChild(overlay);

		document.getElementById("overlay").style.display = "block";

		AlertPlayer(-2,attempts,Math.floor(solutionPts*0.85));
	}
}

//when moving onto next level, write results of previous level to db
function UpdateDatabase() {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		document.getElementById("blank").innerHTML = this.responseText;
	  }
	};
	
	xhttp.open("POST", 'scripts/write.php?user='+userInfo[0]+'&level='+userInfo[1]+'&score='+levelScore+'&attempts='+attempts+'&solution='+ArrayToString(firstIdexes)+'&badges='+badges+'&genBadges='+geneiusBadges, true);
	xhttp.send();
}

//btnAbout onClick opens about page in new tab
function AboutListener() {	
	window.open("about.html", "_blank");
}

//check for settings updates
function CheckSettings() {
	//interaction
	if(settings_int === "Drag") {
		SettingsDragListener();
	} else if(settings_int === "Click") {
		SettingsClickListener();
	} else if(settings_int === "Arrow Keys") {
		SettingsArrowListener();
	}
	
	//sensitivity
	if(settings_int === "Low") {
		UpdateInteraction(0);
	} else if(settings_int === "Normal") {
		UpdateInteraction(1);
	} else if(settings_int === "High") {
		UpdateInteraction(2);
	}
	
	//color
	if(settings_color === "Scheme1") {
		UpdateSettingsColor(0);
	} else if(settings_color === "Scheme2") {
		UpdateSettingsColor(1);
	} else if(settings_color === "Scheme3") {
		UpdateSettingsColor(2);
	} else if(settings_color === "Scheme4") {
		UpdateSettingsColor(3);
	} else if(settings_color === "Scheme5") {
		UpdateSettingsColor(4);
	}
	
	if(currLevel == 1) {
		badges = 1;
		geniusBadges = 1;
	}

	if(currLevel == 2) {
		badges = 2;
		geniusBadges = 2;
	}
}

//update interaction to selected setting
function UpdateInteraction(num) {
	if(num == 0) { 
		settings_sens = "Low";
		speed = 3;	
	} else if(num == 1) { 
		settings_sens = "Normal";
		speed = 10;	
	} else if(num == 2) { 
		settings_sens = "High";
		speed = 30;
	}
}

//update color to selected setting
function UpdateSettingsColor(num) {
	var btn = document.getElementById("btnColor");
	var options = ["Scheme1", "Scheme2", "Scheme3", "Scheme4", "Scheme5"];
	
	if(num == 0) {
		BuildColorSchemePreview(1,btn,options[num]);
		ChangeColor(0);
	} else if(num == 1) {
		BuildColorSchemePreview(2,btn,options[num]);
		ChangeColor(1);
	} else if(num == 2) {
		BuildColorSchemePreview(3,btn,options[num]);
		ChangeColor(2);
	} else if(num == 3) {
		BuildColorSchemePreview(4,btn,options[num]);
		ChangeColor(3);
	} else if(num == 4) {
		BuildColorSchemePreview(0,btn,options[num]);
		ChangeColor(4);
	}
}

//set n value of puzzle (the length of kmers/pattern-matching window)
function SetN(n) {
	sequences[0].n = parseInt(n);
}

//set k value of puzzle (the length of sequences/amount of blocks per row)
function SetK(k) {
	sequences[0].k = parseInt(k);
}

//set each sequence of puzzle (the order of blocks per row)
function SetSequence(seq,idx) {
	var k = Object.keys(sequences[0]);
	var num = k[idx];
	sequences[0][num] = seq;
}

//set puzzle parameters
function GetNewPuzzle() {
	var cnt = 2;
	
	for(var i = 0; i < 10; i++) {
		SetSequence(jsonSeq[currLevel].sequences[i],cnt);
		cnt++;
	}
	
	cnt = 0;
	
	SetN(jsonSeq[currLevel].n);
	SetK(jsonSeq[currLevel].k);
}

//clear all variables and data structures for new level
function ClearLevel() {
	GetNewPuzzle();
	
	firstIdexes = [];
	seqCopies = [];
	motifs = [];
	dragFlag = false;
	motifHistory = [];
	pointsHistory = [];	
	indexHistory = [];
	DNAvarS = [];
	K = jsonSeq[currLevel].n;
	T = jsonSeq[currLevel].sequences.length;	
	solutionPts = 0;
	attempts = 0;
	userRank = "";
	earnedBadge = false;
	
	RemoveTutorial();
	CopyStrings();
	AddOpenControlPanelBtn();
	BuildZoom_keys();
	BuildOverview_keys();
	AddBottomControls();
	
	BuildStatusBar();
	BuildControlPanel();
	BuildProfile();
	SetProfileValues();
	BuildSettings();
	BeginMotifSearch();
	
	var settingsDiv = document.getElementById('settingsDiv');
	var profileDiv = document.getElementById('profileDiv');
	
	document.onclick = function(e){
		if(e.target.id !== 'btnSettings' && !settingsDiv.contains(e.target)){
			settingsDiv.style.display = "none";
		}
		
		if(e.target.id !== 'btnProfile' && !profileDiv.contains(e.target)){
			profileDiv.style.display = "none";
		}
	}
	
	CheckSettings();
}