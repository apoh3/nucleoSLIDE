/*
 * Date Extractor for nucleoSLIDE: information about the player and level
 *
 * author: Allison Poh
 * last modified: 5/12/2020
 * for MS Thesis, UMass Dartmouth (May 2020)
 */

var settings_int = "Click";			//["Click", "Arrow Keys", "Drag"]
var settings_sens = "Normal";		//["Low", "Normal", "High"]
var settings_color = "Scheme1";		//["Scheme1", "Scheme2", "Scheme3", "Scheme4", "Scheme5"]
var speed = 10;
var userInfo = ['n/a',1,0];			//[username,level,score]
var currLevel = userInfo[1];
var state = null;
var stateHistory = null;
var firsts = [];
var extraNuclsPerSide = 3;
var levelsMade = jsonSeq.length;
var currRank = 0;
var badges = 0;
var geneiusBadges = 0;
var overPuzzleLimit = false;

//default puzzle (tutorial puzzle) from Bioinformativs Algorithms: An Active Learning Approach, ed. 2, vol. 1, ch. 2, pg. 70 (1st example) 
var sequences = [{ 
	"n":15,
	"k":82,
	"s1":"ATGACCGGGATACTGATAAAAAAAAGGGGGGGGGCGTACACATTAGATAAACGTATGAAGTACGTTAGACTCGGCGCCGCCG",
	"s2":"ACCCCTATTTTTTGAGCAGATTTAGTGACCTGGAAAAAAAATTTGAGTACAAAACTTTTCCGAATAAAAAAAAAGGGGGGGA",
	"s3":"AGAGTATCCCTGGGATGACTTAAAAAAAAGGGGGGGTGCTCTCCCGATTTTTGAATATGTAGGATCATTCGCCAGGGTCCGA",
	"s4":"GCTGAGAATTGGATGAAAAAAAAGGGGGGGTCCACGCAATCGCGAACCAACGCGGACCCAAAGGCAAGACCGATAAAGGAGA",
	"s5":"CCCCTTTTGCGGTAATGTGCCGGGAGGCTGGTTACGTAGGGAAGCCCTAACGGACTTAATAAAAAAAAGGGGGGGCTTATAG",
	"s6":"CTCAATCATGTTCTTGTGAATGGATTTAAAAAAAAGGGGGGGGACCGCTTGGCGCACCCAAATTCAGTGTGGGCGAGCGCAA",
	"s7":"CGGTTTTGGCCCTTGTTAGAGGCCCCCGTAAAAAAAAGGGGGGGCAATTATGAGAGAGCTAATCTATCGCGTGCGTGTTCAT",
	"s8":"TACTTGAGTTAAAAAAAAGGGGGGGCTGGGGCACATACAAGAGGAGTCTTCCTTATCAGTTAATGCTGTATGACACTATGTA",
	"s9":"TTGGCCCATTGGCTAAAAGCCCAACTTGACAAATGGAAGATAGAATCCTTGCATAAAAAAAAGGGGGGGACCGAAAGGGAAG",
	"s10":"CTGGTGAGCAACGACAGATTCTTACGTGCATTAGCTCGCTTCCGGGGATCTAATAGCACGAAGCTTAAAAAAAAGGGGGGGA"
}];

// data collected from game.php; sets variables above to database values
function RetrieveUserProfile(userid,username,email,password,level,score,settings,st,his,bad,genBad) {
	userInfo = [username,level,score];
	currLevel = level;
	badges = bad;
	geneiusBadges = genBad;
	
	if(currLevel >= levelsMade) {
		overPuzzleLimit = true;
	} 

	if(st != null && st.length > 0) {
		state = st;

		if(his != null && his.length > 0) {
			stateHistory = his;
		}
	}

	if(currLevel == 0) {
		userInfo[1] = "tutorial";
	}
	
	if(settings.length > 0) {
		var settPieces = settings.split('/');
		
		settings_int = settPieces[0];	
		settings_sens = settPieces[1];
		settings_color = settPieces[2];
	} else {
		settings_int = "Click";	
		settings_sens = "Normal";
		settings_color = "Scheme1";
	}
}

//builds puzzle and displays initial information in overlay
function BuildPuzzleOnLoad() {
	if(overPuzzleLimit == true) {
		var overlay = document.createElement("div");
		overlay.setAttribute("id", "overlay");
		document.body.appendChild(overlay);
		document.getElementById("overlay").style.display = "block";
		
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
		exitAlertBtn.style.visibility = "hidden";

		td.appendChild(exitAlertBtn);
		tr.appendChild(td);

		alertTable.appendChild(tr);
		
		var tr = document.createElement("tr");
		var td = document.createElement("td");

		var titleText = document.createElement("text");
		titleText.setAttribute("id", "titleText");
		titleText.innerHTML = "There are no new puzzles at the time.";

		td.appendChild(titleText);
		tr.appendChild(td);
		alertTable.appendChild(tr);

		var tr = document.createElement("tr"); //row 2: text
		var td = document.createElement("td");

		var stepText = document.createElement("text");
		stepText.setAttribute("id", "stepText");
		stepText.innerHTML = "Stay tuned for more.";

		td.appendChild(stepText);
		tr.appendChild(td);
		alertTable.appendChild(tr);

		var tr = document.createElement("tr"); //row 3: begin btn
		var td = document.createElement("td");

		var beginTutBtn = document.createElement("button");
		beginTutBtn.setAttribute("id", "beginTutBtn");
		beginTutBtn.innerHTML = "exit";
		beginTutBtn.addEventListener("click", ReturnToLoginListener);

		td.appendChild(beginTutBtn);
		tr.appendChild(td);

		alertTable.appendChild(tr);
		alertDiv.appendChild(alertTable);
		overlay.appendChild(alertDiv);
		
		currLevel--;
	} else {
		var cnt = 2;
	
		for(var i = 0; i < 10; i++) {
			SetSequence(jsonSeq[currLevel].sequences[i],cnt);
			cnt++;
		}
		
		cnt = 0;
		
		SetN(jsonSeq[currLevel].n);
		SetK(jsonSeq[currLevel].k);
	}
}

//replace page with index
function ReturnToLoginListener() {
	window.open('index.php','_self',true);
}

//format ranking display
function SetRanking(rank,tot) {
	var end = "";
	
	switch(rank%10) {
		case 1: 
			end = "st";
			break;
		case 2:
			end = "nd";
			break;
		case 3:
			end = "rd";
			break;
		default:
			end = "th";
	}
	
	currRank = rank + "" + end;
}

//retrieve rank
function GetRanking() {
	return currRank;
}

//updates n value (length of motif/pattern)
function SetN(n) {
	sequences[0].n = parseInt(n);
}

//updates k value (length of nucleotides to be shown)
function SetK(k) {
	sequences[0].k = parseInt(k);
}

//updates sequences to correct puzzle
function SetSequence(seq,idx) {
	var k = Object.keys(sequences[0]);
	var num = k[idx];
	sequences[0][num] = seq;
}