/*
 * UI Script for nucleoSLIDE: build workspace, side panel, and status bar
 *
 * author: Allison Poh
 * last modified: 5/12/2020
 * for MS Thesis, UMass Dartmouth (May 2020)
 */

BuildStatusBar();
BuildControlPanel();
BuildProfile();
BuildSettings();
SetProfileValues();

var tutorialCnt = 0;

//show tutorial when new account made
if(currLevel == 0) {
	SetUpTutorial();
}

//add components to status bar
function BuildStatusBar() {
	var texts = ["User Name", "Level", "Score"];	
	
	var div = document.getElementById("statusBarDiv");
	
	for(var i = 0; i < texts.length; i++) {
		var txt = document.createElement("text");
		txt.innerHTML = texts[i].bold() + ": " + userInfo[i];
		
		if(texts[i] === "Level") {
			var levelDesc = jsonSeq[currLevel].source;
			
			if(levelDesc.charAt(0) !== "!") {
				txt.innerHTML += " (" + levelDesc + ")";
			}
		}
		
		txt.setAttribute("class", "statusTexts");
		txt.setAttribute("id", "text" + texts[i].split(' ').join(''));
		div.appendChild(txt);
	}
	
	txt.style.marginRight = "50px";
}

//add components to control panel/side panel
function BuildControlPanel() {
	var btns = ["Profile", "Settings", "Evaluate", "Submit", "About"];
	
	var upperRightBtnsDiv = document.createElement("div");
	upperRightBtnsDiv.setAttribute("id", "upperRightBtnsDiv");
	
	var midBtnsDiv = document.createElement("div");
	midBtnsDiv.setAttribute("id", "midBtnsDiv");
	
	var div = document.getElementById("controlPanelDiv");

	for(var i = 0; i < btns.length-1; i++) {
		var btn = document.createElement("button");
		btn.innerHTML = btns[i];
		btn.setAttribute("id", "btn" + btns[i]);
		
		if(i < 2) {
			upperRightBtnsDiv.appendChild(btn);
		} else if(i != btns.length-1){
			midBtnsDiv.appendChild(btn);
		}
	}
	
	div.appendChild(upperRightBtnsDiv);
	
	var historyDiv = document.createElement("div");
	historyDiv.setAttribute("id", "historyDiv");
	historyDiv.addEventListener("click", DisableArrowsInHistory);
	
	var historyHeaderTxt = document.createElement("text");
	historyHeaderTxt.innerHTML = "History";
	historyHeaderTxt.setAttribute("id", "historyHeaderTxt");
	historyDiv.appendChild(historyHeaderTxt);
	
	historyDiv.appendChild(document.createElement("hr"));
	
	div.appendChild(historyDiv);

	div.appendChild(midBtnsDiv);
	
	var aboutBtnDiv = document.createElement("div");
	aboutBtnDiv.setAttribute("id", "aboutBtnDiv");
	
	var btn = document.createElement("button");
	btn.innerHTML = btns[btns.length-1];
	btn.setAttribute("id", "btn" + btns[btns.length-1]);
	aboutBtnDiv.appendChild(btn);
	
	div.appendChild(aboutBtnDiv);

	if(stateHistory != null && stateHistory.length > 0) {	
		indexHistory = ConvertHistoryToArray(stateHistory);
		
		BuildHistoryDisplay(indexHistory);
	}
	
	AddBtnActions();
}

//do not allow arrow keys to scroll history div (affects gameplay)
function DisableArrowsInHistory() { 
	window.addEventListener("keydown", function(e) { 
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1){ 
			e.preventDefault(); 
		} 
	}, false); 
}  

//add components to profile dropdown
function BuildProfile() {
	var texts = [userInfo[0],"Levels Cleared:","Total Badges:","Gene-ius Badges:","Ranking:"];
	
	var div = document.getElementById("upperRightBtnsDiv");
	
	var profileDiv = document.createElement("div");
	profileDiv.setAttribute("id", "profileDiv");
	profileDiv.style.display = "none";
	
	var profileTable = document.createElement("table");
	profileTable.setAttribute("id", "settingsTable");
	
	for(var i = 0; i < texts.length; i++) {
		var tr = document.createElement("tr"); 
		tr.setAttribute("class", "profileRow");
		
		var td1 = document.createElement("td"); 
		td1.setAttribute("class", "profileCell textCell");
		
		var txt = document.createElement("text");
		txt.innerHTML = texts[i];	
		
		td1.appendChild(txt);
		
		tr.appendChild(td1);
		
		if(i > 0) {
			var td2 = document.createElement("td"); 
			td2.setAttribute("class", "profileCell textCell");
			
			var txt = document.createElement("text");
			txt.setAttribute("id","profileTxt_"+i);
			txt.innerHTML = "0";	
			
			td2.appendChild(txt);
			
			tr.appendChild(td2);
		} else {
			td1.colSpan = "2";
			td1.style.textAlign = "center";
			tr.style.fontWeight = "900";
			tr.style.color = "rgb(0,154,255)";
		}
		
		profileTable.appendChild(tr);
	}

	profileDiv.appendChild(profileTable);
	div.appendChild(profileDiv);
}

//update values in profile dropdown
function SetProfileValues() {
	var txt1 = document.getElementById("profileTxt_"+1); //levels played
	txt1.innerHTML = currLevel;
	
	var txt2 = document.getElementById("profileTxt_"+2); //badges earned
	txt2.innerHTML = badges;
	
	var txt3 = document.getElementById("profileTxt_"+3); //excellence badges
	txt3.innerHTML = geneiusBadges;
	
	var txt4 = document.getElementById("profileTxt_"+4); //ranking
	txt4.innerHTML = GetRanking();
}

//add components to settings dropdown
function BuildSettings() {
	var texts = ["Interaction","Sensitivity","Color"];
	
	var div = document.getElementById("upperRightBtnsDiv");
	
	var settingsDiv = document.createElement("div");
	settingsDiv.setAttribute("id", "settingsDiv");
	settingsDiv.style.display = "none";
	
	var settingsTable = document.createElement("table");
	settingsTable.setAttribute("id", "settingsTable");
	
	for(var i = 0; i < texts.length; i++) {
		var tr = document.createElement("tr"); 
		tr.setAttribute("class", "settingsRow");
		
		var td1 = document.createElement("td"); 
		td1.setAttribute("class", "settingsCell textCell");
		
		var txt = document.createElement("text");
		txt.innerHTML = texts[i];
		
		var td2 = document.createElement("td"); 
		td2.setAttribute("class", "settingsCell btnCell");
	
		var btn = document.createElement("button");
		
		if(i == 0) {
			btn.innerHTML = settings_int;
		} else if(i == 1) {
			btn.innerHTML = settings_sens;
		} else if(i == 2) {
			var scheme = settings_color;
			
			if(scheme === "Scheme1" || scheme === "Scheme2") {
				var colors = ["rgb(255,43,8)", "rgb(0,188,13)", "rgb(0,154,255)", "rgb(255,181,7)","rgb(255,43,8)", "rgb(0,188,13)", "rgb(0,154,255)", "rgb(255,181,7)"];
			} else if(scheme === "Scheme3") {
				var colors = ["rgb(102,255,0)", "rgb(255,51,0)", "rgb(255,255,0)", "rgb(102,0,255)","rgb(102,255,0)", "rgb(255,51,0)", "rgb(255,255,0)", "rgb(102,0,255)"];
			} else if(scheme === "Scheme4") {
				var colors = ["rgb(160,160,255)", "rgb(160,255,160)", "rgb(255,140,75)", "rgb(255,112,122)","rgb(160,160,255)", "rgb(160,255,160)", "rgb(255,140,75)", "rgb(255,112,122)"];
			} else if(scheme === "Scheme5") {
				var colors = ["rgb(255,109,109)", "rgb(116,206,152)", "rgb(118,157,204)", "rgb(242,190,60)","rgb(255,109,109)", "rgb(116,206,152)", "rgb(118,157,204)", "rgb(242,190,60)"];
			}
			
			for(var j = 0; j < scheme.length; j++) {
				var span = document.createElement("span");
				span.innerHTML = scheme.charAt(j);
				span.style.color = colors[j];
				btn.appendChild(span);
			}
		}			
			
		btn.setAttribute("id", "btn" + texts[i]);
		
		td1.appendChild(txt);
		td2.appendChild(btn);
		
		tr.appendChild(td1);
		tr.appendChild(td2);
		
		settingsTable.appendChild(tr);
	}
	settingsDiv.appendChild(settingsTable);
	div.appendChild(settingsDiv);
	
	AddSettingsActions();
	CheckSettings();
}

//give listeners to each button in side panel
function AddBtnActions() {
	document.getElementById("btnProfile").addEventListener("click", ProfileListener);
	document.getElementById("btnSettings").addEventListener("click", SettingsListener);	
	document.getElementById("btnEvaluate").addEventListener("click", EvaluateListener);
	document.getElementById("btnSubmit").addEventListener("click", EvaluateListener);
	document.getElementById("btnAbout").addEventListener("click", AboutListener)
}

//give listeners to each button in settings dropdown
function AddSettingsActions() {
	document.getElementById("btnInteraction").addEventListener("click", SettingsInteractionListener);
	document.getElementById("btnSensitivity").addEventListener("click", SettingsSensitivityListener)
	document.getElementById("btnColor").addEventListener("click", SettingsColorListener)
}

//get left position of element
function GetLeftPos(el) {
	var left = 0;
	
	while(el && !isNaN(el.offsetLeft)) {
		left += el.offsetLeft - el.scrollLeft;
		el = el.offsetParent;
	}
	
	return left;
}

//determine when to show/hide dropdowns and, for tutorial, when to show the discription of the history display
window.onload = function(){
	var settingsDiv = document.getElementById('settingsDiv');
	var profileDiv = document.getElementById('profileDiv');
	var historyDiv = document.getElementById('historyDiv');
	
	var tables = document.getElementsByClassName("motifsTable");
	
	document.onclick = function(e){
		if(e.target.id !== 'btnSettings' && !settingsDiv.contains(e.target)){
			settingsDiv.style.display = "none";
		}
		
		if(e.target.id !== 'btnProfile' && !profileDiv.contains(e.target)){
			profileDiv.style.display = "none";
		}
		
		if(historyDiv.contains(e.target)) {
			for(var i = 0; i < tables.length; i++) {
				if(tables[i].contains(e.target)) {
					UpdateWorkspaceToSelection(tables[i].id);
				}
			}
		}

		if(e.target.id === 'btnEvaluate' && tutorialCnt == 3){
			var textInfo = document.getElementById("textInfo");
			textInfo.innerHTML = "The top-most entry is the most recent and the highlighted entry is the one with the highest score. The black letters represent the best matched pattern. When you believe you have completed the puzzle and found the best pattern (the one with the highest score), you can select Submit below.";

			var gotItBtn = document.getElementById("gotItBtn");
			gotItBtn.disabled = false;
			gotItBtn.style.cursor = "pointer";
		}
	};
};

//when kmers in history display selected, match workspace to kmers
function UpdateWorkspaceToSelection(id) {
	var num = id.split("_")[1];		//table number
	var motifs = motifHistory[num]; //motifs of table
	
	var currIndexes = CloneArray(firstIdexes); 	  //first indexes of current table 
	var selectedTableIndexes = CloneArray(indexHistory[num]);  //first indexes of selected table (in which to replace currIndexes)
	
	for(var i = 0; i < selectedTableIndexes.length; i++) {
		var dif = selectedTableIndexes[i] - currIndexes[i];
		
		if(dif == 0) {
			continue;
		} else {
			for(var j = 0; j < Math.abs(dif); j++) {
				if(dif > 0) {
					InitiateClick("row_"+i, "leftArrow_"+i);
				} else if(dif < 0) {
					InitiateClick("row_"+i, "rightArrow_"+i);
				}
			}	
		}
	}

	SearchBtnListener();
}

//start tutorial
function SetUpTutorial() {
	var overlay = document.createElement("div");
	overlay.setAttribute("id", "overlay");
	document.body.appendChild(overlay);

	document.getElementById("overlay").style.display = "block";

	TutorialAlert(1);
}

//end tutorial
function RemoveTutorial() {
	var infoDiv = document.getElementById("infoDiv");
	
	if(typeof(infoDiv) != 'undefined' && infoDiv != null){
		infoDiv.style.display = "none";
	}
}

//determines the placement of each interactive tutorial step
function OpenTutorialLevel() {
	var box = InformationBox(tutorialCnt);
	document.body.appendChild(box);

	if(tutorialCnt == 0) { //Here's your workspace
		var section = document.getElementById("workspaceDiv");
		var rect = section.getBoundingClientRect();
		var xPos = rect.right-100;
		var yPos = rect.bottom/2;
	} else if(tutorialCnt == 1) { //Blocks
		var section = document.getElementById("td(0,19)");
		var rect = section.getBoundingClientRect();
		var xPos = rect.right-10;
		var yPos = rect.bottom;
	} else if(tutorialCnt == 2) { //Pattern searc box
		var section = document.getElementById("searchBtn");
		var rect = section.getBoundingClientRect();
		var xPos = rect.right;
		var yPos = rect.top-(box.offsetHeight);
	} else if(tutorialCnt == 3) { //History log
		var section = document.getElementById("historyDiv");
		var rect = section.getBoundingClientRect();
		var xPos = rect.left-(section.offsetWidth/2);
		var yPos = rect.bottom/2;
	} else if(tutorialCnt == 4) { //Refresh puzzle button
		var section = document.getElementById("refeshBtn");
		var rect = section.getBoundingClientRect();
		var xPos = rect.right;
		var yPos = rect.top-(box.offsetHeight);
	} else if(tutorialCnt == 5) { //Status bar
		var section = document.getElementById("textScore");
		var rect = section.getBoundingClientRect();
		var xPos = rect.right+10;
		var yPos = rect.top-(box.offsetHeight)+10;
	} 
	
	if(tutorialCnt < 5) { //allow submitting after tutorial
		var sBtn = document.getElementById("btnSubmit");
		sBtn.style.cursor = "not-allowed";
		sBtn.disabled = true;
	} else {
		var sBtn = document.getElementById("btnSubmit");
		sBtn.style.cursor = "pointer";
		sBtn.disabled = false;
	}

	box.style.left = xPos + "px";
	box.style.top = yPos + "px";
}

//places text inside each interactive tutorial step
function InformationBox(num) {
	var infoDiv = document.createElement("div");
	infoDiv.setAttribute("id", "infoDiv");

	switch(num) {
		case 0:
			dir = "topL";
			title = "Here's your workspace:";
			txt = "The top view is identical to the bottom view, just zoomed in on the pattern matching window. In the top view, move the rows left and right by clicking the arrow buttons (you can change how you interact with the puzzle in Settings).";
			break;
		case 1:
			dir = "topL";
			title = "Blocks:";
			txt = "There are four colored blocks that can be used to make patterns: red, blue, orange, and green (you can change the color scheme in Settings). In each row, there is also a grey block that symbolizes the end of the sequence. The grey block can never enter the pattern-matching window.";
			break;
		case 2:
			dir = "botL";
			title = "Pattern search box:";
			txt = "You may want to check a pattern without having to move all the rows around. Enter a pattern here to highlight it above. You can click a highlighted pattern to automatically shift the row it belongs to.";
			break;
		case 3:
			dir = "topR";
			title = "History log:";
			txt = "You can evaluate your workspace at any time by selecting Evaluate below. This will save your workspace here and allow you to go back to it at any point. You will also be given the score of your current solution. Try evaluating your workspace right now.";
			break;
		case 4:
			dir = "botL";
			title = "Refresh puzzle button:";
			txt = "If at any time you'd like to restart the puzzle, click here. Your history log will not be erased.";
			break;
		case 5:
			dir = "botL";
			title = "Status bar:";
			txt = 'After completing each puzzle, you will move on to a new level. The score of your solutions will be totaled here. The higher the score the better. (For anyone familar with MFP, this should seem backwards to you. But doesn\'t bragging feel better when you can say, "My score is huge!" rather than, "I got a zero today!"?';
			break;
		case 6:
			dir = "";
			title = "";
			txt = "";
			break;
		default:
			dir = "topL";
			title = "";
			txt = "";
	}

	if(dir === "topL") {
		infoDiv.setAttribute("class", "infoDiv pointTopLeft");
	} else if(dir === "topR") {
		infoDiv.setAttribute("class", "infoDiv pointTopRight");
	} else if(dir === "botL") {
		infoDiv.setAttribute("class", "infoDiv pointBotLeft");
	} else if(dir === "botR") {
		infoDiv.setAttribute("class", "infoDiv pointBotRight");
	}

	var textTop = document.createElement("text");
	textTop.setAttribute("class", "textTop");
	textTop.innerHTML = title;

	var textInfo = document.createElement("text");
	textInfo.setAttribute("id", "textInfo");
	textInfo.innerHTML = txt;

	var gotItBtn = document.createElement("button");
	gotItBtn.setAttribute("class", "gotItBtn");
	gotItBtn.setAttribute("id", "gotItBtn");
	gotItBtn.addEventListener("click", GotItListener);
	gotItBtn.innerHTML = "got it";
	
	if(num == 1) { //to show grey blocks, slide first row to left
		var slideCnt = jsonSeq[0].k/2;
		
		for(var i = 0; i < 84; i++) {
			InitiateClick("leftArrow_0","leftArrow");
		}
	}

	if(num == 3) { //to force understanding of evaluate, hide 'got it' until evaluate selected
		gotItBtn.disabled = true;
		gotItBtn.style.cursor = "not-allowed";
	}

	infoDiv.appendChild(textTop);
	infoDiv.appendChild(document.createElement("br"));
	infoDiv.appendChild(textInfo);
	infoDiv.appendChild(document.createElement("br"));
	infoDiv.appendChild(gotItBtn);

	return infoDiv;
}

//gotItBtn onClick for interactive tutorial
function GotItListener() {
	tutorialCnt++;

	var element = document.getElementById("infoDiv");
	element.parentNode.removeChild(element);
	
	if(tutorialCnt < 6) {
		OpenTutorialLevel();
	} else if(tutorialCnt == 6) {
		var overlay = document.createElement("div");
		overlay.setAttribute("id", "overlay");
		document.body.appendChild(overlay);

		document.getElementById("overlay").style.display = "block";

		AlertPlayer(1);
	}
}

