/*
 * Game Script for nucleoSLIDE: builds the puzzles
 *
 * author: Allison Poh
 * last modified: 5/12/2020
 * for MS Thesis, UMass Dartmouth (May 2020)
 */

var firstIdexes = [];
var seqCopies = [];
var motifs = [];
var originalFirst = 0;
var dragFlag = false;
var attempts = 0;
var perc = 1.5;
var amount = 10;
var maxPerc = 3;
var blackFlag = false;
var patternLength = 0;
var highlighted = [];
var searching = false;

CopyStrings();
AddOpenControlPanelBtn();
BuildZoom_keys();
BuildOverview_keys();
AddBottomControls();

//Update game's state if there is one in the db
if(state != null && state.length > 0) {
	UpdateState(state);
}

//Create the zoomed view of the puzzle in html
function BuildZoom_keys() {
	var div = document.getElementById("workspaceDiv");

	var zoomTable = document.createElement("table");
	zoomTable.setAttribute("id", "zoomTable");

	for (var i = 0; i < Object.keys(sequences[0]).length - 2; i++) {
		var tr = document.createElement("tr");
		tr.setAttribute("class", "draggableRows");
		tr.setAttribute("id", "row_" + i);

		var nuclIdx = Math.floor(sequences[0].k / 2 - sequences[0].n / 2) - extraNuclsPerSide;
		firstIdexes[i] = nuclIdx;
		originalFirst = nuclIdx;

		for (var j = 0; j < sequences[0].n + (extraNuclsPerSide * 2 + 2); j++) {
			var td = document.createElement("td");

			//pattern matching window
			if (j > extraNuclsPerSide && j < sequences[0].n + (extraNuclsPerSide * 2 + 1) - extraNuclsPerSide) {
				if (i == 0) {
					td.style.borderTop = "thick solid black";
				}

				if (j == extraNuclsPerSide + 1) {
					td.style.borderLeft = "thick solid black";
				}

				if (i == Object.keys(sequences[0]).length - 3) {
					td.style.borderBottom = "thick solid black";
				}

				if (j == sequences[0].n + (extraNuclsPerSide * 2 + 1) - extraNuclsPerSide - 1) {
					td.style.borderRight = "thick solid black";
				}
			}

			//arrow buttons
			if (j == 0) {
				var btn = document.createElement("button");
				btn.innerHTML = "<";
				btn.setAttribute("class", "leftArrow");
				btn.setAttribute("id", "leftArrow_" + i);
				btn.addEventListener("click", ArrowClicked);

				td.appendChild(btn);
			} else if (j == sequences[0].n + (extraNuclsPerSide * 2 + 1)) {
				var btn = document.createElement("button");
				btn.innerHTML = ">";
				btn.setAttribute("class", "rightArrow");
				btn.setAttribute("id", "rightArrow_" + i);
				btn.addEventListener("click", ArrowClicked);

				td.appendChild(btn);
			} else {
				//nucleotides
				var str = Object.values(sequences[0])[2 + i];

				var nucl = document.createElement("text");
				nucl.innerHTML = str.charAt(nuclIdx);
				nucl.setAttribute("id", "nucl(" + i + "," + j + ")");
				nucl.setAttribute("class", "nucleotide");

				if (str.charAt(nuclIdx) == "A") {
					td.setAttribute("class", "adenosine");
				} else if (str.charAt(nuclIdx) == "T") {
					td.setAttribute("class", "thymine");
				} else if (str.charAt(nuclIdx) == "C") {
					td.setAttribute("class", "cytosine");
				} else if (str.charAt(nuclIdx) == "G") {
					td.setAttribute("class", "guanine");
				}

				td.setAttribute("id", "td(" + i + "," + j + ")");

				td.appendChild(nucl);

				nuclIdx++;
			}

			tr.appendChild(td);
		}

		zoomTable.appendChild(tr);
	}

	workspaceDiv.appendChild(zoomTable);
}

//Create the overview of the puzzle in html
function BuildOverview_keys() {
	var div = document.getElementById("workspaceDiv");

	var overviewTable = document.createElement("table");
	overviewTable.setAttribute("id", "overviewTable");

	if (sequences[0].k > 100) {
		overviewTable.style.fontSize = "0px";
	}

	for (var i = 0; i < Object.keys(sequences[0]).length - 2; i++) {
		var tr = document.createElement("tr");
		tr.setAttribute("class", "overviewRows");

		var nuclIdx = 0;

		for (var j = 0; j < sequences[0].k + 2; j++) {
			var td = document.createElement("td");

			//pattern matching window
			if (j > firstIdexes[0] + extraNuclsPerSide && j < (firstIdexes[0] + extraNuclsPerSide) + sequences[0].n + 1) {
				if (i == 0) {
					td.style.borderTop = "3px solid black";
				}

				if (j == firstIdexes[0] + extraNuclsPerSide + 1) {
					td.style.borderLeft = "3px solid black";
				}

				if (i == Object.keys(sequences[0]).length - 3) {
					td.style.borderBottom = "3px solid black";
				}

				if (j == (firstIdexes[0] + extraNuclsPerSide) + sequences[0].n) {
					td.style.borderRight = "3px solid black";
				}

				if (sequences[0].k > 100) {
					td.setAttribute('width', maxPerc + '%');
					td.style.fontSize = "8px";
				}
			}

			//size of blocks
			if (sequences[0].k > 100) {
				if (j > firstIdexes[0] + extraNuclsPerSide - amount && j < firstIdexes[0] + extraNuclsPerSide + 1) {
					td.setAttribute('width', perc + '%');
				}

				if (j > (firstIdexes[0] + extraNuclsPerSide) + sequences[0].n && j < (firstIdexes[0] + extraNuclsPerSide) + sequences[0].n + amount) {
					td.setAttribute('width', perc + '%');
				}
			}

			//nucleotides
			if (j != 0) {
				var str = Object.values(sequences[0])[2 + i];

				var nucl = document.createElement("text");

				if (j == sequences[0].k + 1) {
					nucl.innerHTML = "X";
				} else {
					nucl.innerHTML = str.charAt(nuclIdx);
				}

				nucl.setAttribute("class", "nucleotide");
				nucl.setAttribute("id", "overviewnucl(" + i + "," + (j - 1) + ")");

				if (str.charAt(nuclIdx).toUpperCase() == "A") {
					td.setAttribute("class", "adenosine");
				} else if (str.charAt(nuclIdx).toUpperCase() == "T") {
					td.setAttribute("class", "thymine");
				} else if (str.charAt(nuclIdx).toUpperCase() == "C") {
					td.setAttribute("class", "cytosine");
				} else if (str.charAt(nuclIdx).toUpperCase() == "G") {
					td.setAttribute("class", "guanine");
				} else {
					td.setAttribute("class", "noneine");
				}

				if (nucl.innerHTML === "X") {
					td.setAttribute("class", "noneine");
				}

				td.setAttribute("id", "overviewtd(" + i + "," + (j - 1) + ")");

				td.appendChild(nucl);

				nuclIdx++;
			}

			tr.appendChild(td);
		}

		overviewTable.appendChild(tr);
	}

	workspaceDiv.appendChild(overviewTable);
}

//When sequences are too large to display letters in overview, enlarge and display letters only for enclosed blocks +/- blocks on each side
function ChangeFisheye(grow) {
	var perc, 				//width of block by percent
		extraSideBlocks,	//amount of extra blocks to side of enclosed blocks (per side)
		maxPerc, 			//max width of block by percent
		fontSize = 0;		//size of letters in blocks

	if (grow == true) { //plus button = maximize and display letters
		perc = 2; 
		extraSideBlocks = 10; 
		maxPerc = 3; 
		fontSize = 8; 
	} else {			//minus button = minimize and hide letters
		perc = 1.5;
		extraSideBlocks = 10;
		maxPerc = 3;
		fontSize = 0;
	}

	for (var i = 0; i < Object.keys(sequences[0]).length - 2; i++) {
		var shift = firstIdexes[i]-originalFirst;

		var firstIdx = firstIdexes[i] + extraNuclsPerSide - extraSideBlocks;				  
		var lastIdx = firstIdexes[i] + extraNuclsPerSide + sequences[0].n + extraSideBlocks-1; 

		//to be fisheyed blocks
		for (var j = firstIdx; j <= lastIdx; j++) {
			var td = document.getElementById("overviewtd(" + i + "," + (j - shift - 1) + ")"); //current block
			
			//enclosed blocks
			if (j > firstIdexes[i] + extraNuclsPerSide && j < (firstIdexes[i] + extraNuclsPerSide) + sequences[0].n + 1) { 
				td.setAttribute('width', maxPerc + '%')
			}

			//blocks to left
			if (j > firstIdexes[i] + extraNuclsPerSide - extraSideBlocks && j < firstIdexes[i] + extraNuclsPerSide + 1) { 
				td.setAttribute('width', perc + '%');
				td.style.fontSize = fontSize + "px";
			}

			//blocks to right
			if (j > (firstIdexes[i] + extraNuclsPerSide) + sequences[0].n && j < (firstIdexes[i] + extraNuclsPerSide) + sequences[0].n + extraSideBlocks) { 
				td.setAttribute('width', perc + '%');
				td.style.fontSize = fontSize + "px";
			}
		}
	}
}

//Copy strings into array to preserve originals
function CopyStrings() {
	var cutoff = sequences[0].k;

	for (var i = 0; i < Object.keys(sequences[0]).length - 2; i++) {
		var str = Object.values(sequences[0])[2 + i].substr(0, cutoff).toUpperCase() + "X";
		seqCopies.push(str);
	}
}

function ArrowClicked(){
	var btnId = this.id;
	var rowIdx = parseInt(btnId.split('_')[1]);
	var str = Object.values(sequences[0])[2 + rowIdx];
	
	//right click
	if(btnId.includes("right") && firstIdexes[rowIdx] > 0-extraNuclsPerSide){
		firstIdexes[rowIdx]--;
		ShiftZoomNucleotides(rowIdx,str);
		ShiftOverview("right",rowIdx);
		
		if(blackFlag == true){
			ReColorRow(rowIdx);
			SearchRow(rowIdx,"R");
		}
	//left click
	} else if(btnId.includes("left")&&firstIdexes[rowIdx]<str.length-sequences[0].n-extraNuclsPerSide){
		firstIdexes[rowIdx]++;
		ShiftZoomNucleotides(rowIdx,str);
		ShiftOverview("left",rowIdx);
		
		if(blackFlag==true){
			ReColorRow(rowIdx);
			SearchRow(rowIdx,"L");
		}
	}
	
	//register mouse up and down for drag
	var mousedownID =- 1;
	
	function mousedown(event){
		if(mousedownID ==- 1)
			mousedownID = setInterval(whilemousedown,200);
	}
	
	function mouseup(event){
		if(mousedownID !=- 1){
			clearInterval(mousedownID);
			mousedownID=-1;
		}
		
		document.removeEventListener("mousedown",mousedown);
		document.removeEventListener("mouseup",mouseup);
		document.removeEventListener("mouseout",mouseup)
	}
	
	function whilemousedown(){
		if(btnId.includes("right") && firstIdexes[rowIdx] > 0-extraNuclsPerSide) {
			firstIdexes[rowIdx]--;
			ShiftZoomNucleotides(rowIdx,str);
			ShiftOverview("right",rowIdx);
			
			if(blackFlag == true){
				ReColorRow(rowIdx);
				SearchRow(rowIdx,"R");
			}
		} else if(btnId.includes("left")&&firstIdexes[rowIdx]<str.length-sequences[0].n-extraNuclsPerSide) {
			firstIdexes[rowIdx]++;
			ShiftZoomNucleotides(rowIdx,str);
			ShiftOverview("left",rowIdx);
			
			if(blackFlag == true) {
				ReColorRow(rowIdx);
				SearchRow(rowIdx,"L");
			}
		}
	}
	
	document.addEventListener("mousedown",mousedown);
	document.addEventListener("mouseup",mouseup);
	document.addEventListener("mouseout",mouseup)
}

//If on "click" interaction, allow rows to move on drag
function RowClickedListener(){
	DragRect(this);
}

//Programmatically click arrow buttons
function InitiateClick(id,btn){
	if(searching == false){
		var row = parseInt(id.split("_")[1]);
		var btnId = btn+row;
		var rowIdx = row;
		var str = Object.values(sequences[0])[2+rowIdx];
		
		//click right
		if(btnId.includes("right") && firstIdexes[rowIdx] > 0-extraNuclsPerSide) {
			firstIdexes[rowIdx]--;
			ShiftZoomNucleotides(rowIdx,str);
			ShiftOverview("right",rowIdx);
			
			if(blackFlag == true) {
				ReColorRow(rowIdx);
				SearchRow(rowIdx,"R");
			}
		//click left
		} else if(btnId.includes("left") && firstIdexes[rowIdx] < str.length-sequences[0].n-extraNuclsPerSide) {
			firstIdexes[rowIdx]++;
			ShiftZoomNucleotides(rowIdx,str);
			ShiftOverview("left",rowIdx);
			
			if(blackFlag == true) {
				ReColorRow(rowIdx);
				SearchRow(rowIdx,"L");
			}
		//click none
		} else 
			return-1;
	}
}

//Register dragging sequences and move according to set speed and speed of user drag
function DragRect(rect) {
	var lastPos = 0;
	var newPos = 0;
	var orgPos = 0;
	var pixels;

	var down = rect.offsetLeft;
	var up = 0;

	rect.onmousedown = mouseDown;

	function mouseDown(e) {
		e = e || window.event;
		e.preventDefault();

		newPos = e.clientX;
		orgPos = e.clientX;

		document.onmouseup = endDrag;
		document.onmousemove = drag;
	}

	function drag(e) {
		if (dragFlag == false)
			return;

		e = e || window.event;
		e.preventDefault();

		lastPos = newPos - e.clientX;
		newPos = e.clientX;

		pixels = rect.offsetLeft - lastPos;

		rect.style.left = pixels + "px";

		var distTraveld = orgPos - e.clientX;

		if (distTraveld % speed == 0 && pixels > 0) {
			InitiateClick(rect.id, "rightArrow_");
		} else if (distTraveld % speed == 0 && pixels < 0) {
			InitiateClick(rect.id, "leftArrow_");
		}
	}

	function endDrag(e) {
		up = rect.offsetLeft - down;

		document.onmouseup = null;
		document.onmousemove = null;
	}
}

//Recolors and labels blocks in zoomed view
function ShiftZoomNucleotides(rowIdx, str) {
	for (var i = 1; i < sequences[0].n + (extraNuclsPerSide * 2 + 1); i++) {
		var nucl = document.getElementById("nucl(" + rowIdx + "," + i + ")");
		var td = document.getElementById("td(" + rowIdx + "," + i + ")");

		var nuclLetter = str.charAt(firstIdexes[rowIdx] + i - 1).toUpperCase();

		nucl.innerHTML = nuclLetter;

		if (nuclLetter == "A") {
			td.setAttribute("class", "adenosine");
		} else if (nuclLetter == "T") {
			td.setAttribute("class", "thymine");
		} else if (nuclLetter == "C") {
			td.setAttribute("class", "cytosine");
		} else if (nuclLetter == "G") {
			td.setAttribute("class", "guanine");
		} else {
			td.setAttribute("class", "noneine");
		}

		if (nucl.innerHTML === "X") {
			td.setAttribute("class", "noneine");
		}
	}
}

//Recolors and relabels blocks in overview 
function ShiftOverview(dir, rowIdx) {
	seqCopies[rowIdx] = RotateString(seqCopies[rowIdx], dir);

	var str = seqCopies[rowIdx];

	for (var i = 0; i < str.length; i++) {
		var nucl = document.getElementById("overviewnucl(" + rowIdx + "," + i + ")");
		var td = document.getElementById("overviewtd(" + rowIdx + "," + i + ")");

		var nuclLetter = str.charAt(i).toUpperCase();
		nucl.innerHTML = nuclLetter;

		if (nuclLetter == "A") {
			td.setAttribute("class", "adenosine");
		} else if (nuclLetter == "T") {
			td.setAttribute("class", "thymine");
		} else if (nuclLetter == "C") {
			td.setAttribute("class", "cytosine");
		} else if (nuclLetter == "G") {
			td.setAttribute("class", "guanine");
		} else {
			td.setAttribute("class", "noneine");
		}

		if (nucl.innerHTML === "X") {
			td.setAttribute("class", "noneine");
		}
	}
}

//Used for shifting (changes seq to reflect the order of blocks currently in the puzzle)
function RotateString(str, dir) {
	if (dir === "right") {
		str = str[str.length - 1] + str.substring(0, str.length - 1);
	} else if (dir === "left") {
		str = str.substring(1, str.length) + str[0];
	}

	return str;
}

//Build motifs based on indexes of pattern matching window
function GetMotifs() {
	for (var i = 0; i < Object.keys(sequences[0]).length - 2; i++) {
		var str = Object.values(sequences[0])[2 + i];
		var currMotif = "";

		for(var j = (firstIdexes[i] + extraNuclsPerSide); j < ((firstIdexes[i] + extraNuclsPerSide) + sequences[0].n); j++) {
			currMotif += str[j];
		}

		motifs.push(currMotif);
		currMotif = "";
	}

	return motifs;
}

//Set motifs to empty
function ClearMotifs(){
	motifs=[];
}

//Calculate the point value of the kmers and build the resulting consensus string
function CalculatePoints(currArr) {
	var points = 0;
	var count = [0, 0, 0, 0]; //A,C,T,G
	var consensus = "";

	var arr = [];

	if(currArr != null && currArr.length > 0) {
		arr = CloneArray(currArr);
	} else {
		arr = CloneArray(motifs);
	}

	for (var i = 0; i < arr[0].length; i++) {
		//count nucleotides
		for (var j = 0; j < arr.length; j++) {
			var nucl = arr[j].charAt(i).toUpperCase();

			if (nucl === "A") {
				count[0]++;
			} else if (nucl === "C") {
				count[1]++;
			} else if (nucl === "T") {
				count[2]++;
			} else if (nucl === "G") {
				count[3]++;
			}
		}

		var maxVal = 0;

		//calculate points
		for (var k = 0; k < count.length; k++) {
			if (count[k] > maxVal) {
				maxVal = count[k];
			}
		}

		var cnt = 0;

		//build consensus
		for (var k = 0; k < count.length; k++) {
			if (count[k] == maxVal) {
				cnt++;

				if (cnt > 1) {
					consensus += "-";
				}

				if (k == 0) {
					consensus += "A";
				} else if (k == 1) {
					consensus += "C";
				} else if (k == 2) {
					consensus += "T";
				} else if (k == 3) {
					consensus += "G";
				}
			}
		}

		consensus += " ";

		points += maxVal;
		count = [0, 0, 0, 0];
	}

	return points + "_" + consensus;
}

//Copy array but preserve the original
function CloneArray(array) {
	var clone = [];
	var val, key;

	for (key in array) {
		val = array[key];
		clone[key] = (typeof val === "object") ? CloneArray(val) : val;
	}

	return clone;
}

//Convert an array to a comma seperated string
function ArrayToString(arr) {
	var str = "";

	for (var i = 0; i < arr.length; i++) {
		if (i < arr.length - 1) {
			str += arr[i] + ",";
		} else {
			str += arr[i];
		}
	}

	return str;
}

//Build +/- button into workspace
function AddOpenControlPanelBtn() {
	var div = document.getElementById("workspaceDiv");

	AddLogo(div,18);

	var plusBtn = document.createElement("button");
	plusBtn.addEventListener('click', PlusBtnListener);
	plusBtn.setAttribute("id", "plusBtn");
	plusBtn.innerHTML = "-";

	div.appendChild(plusBtn);
}

//Build logo (nucleoSLIDE) into workspace
function AddLogo(div,size) {
	var titleText = document.createElement("text");
	titleText.setAttribute("id", "loginTitleP2");
	titleText.innerHTML = "nucleo";
	titleText.style.fontSize = size+"px";
	div.appendChild(titleText);

	var titleText = document.createElement("text");
	titleText.setAttribute("id", "loginTitleP3");
	titleText.innerHTML = "SLIDE";
	titleText.style.fontSize = size+"px";
	div.appendChild(titleText);
}

//Build refresh and search box
function AddBottomControls() {
	var wsDiv = document.getElementById("workspaceDiv");

	var newDiv = document.createElement("bottomControlsDiv");
	newDiv.setAttribute("id", "bottomControlsDiv");

	var refeshBtn = document.createElement("button");
	refeshBtn.addEventListener('click', RefreshBtnListener);
	refeshBtn.setAttribute("id", "refeshBtn");
	refeshBtn.innerHTML = "refresh puzzle";

	var searchBox = document.createElement("input");
	searchBox.setAttribute("type", "text");
	searchBox.setAttribute("name", "searchBox");
	searchBox.setAttribute("id", "searchBox");
	searchBox.placeholder = "pattern..."

	var clearBtn = document.createElement("button");
	clearBtn.addEventListener('click', ClearBtnListener);
	clearBtn.setAttribute("id", "clearBtn");
	clearBtn.innerHTML = "x";

	var searchBtn = document.createElement("button");
	searchBtn.addEventListener('click', SearchBtnListener);
	searchBtn.setAttribute("id", "searchBtn");
	searchBtn.innerHTML = "search";

	newDiv.appendChild(document.createElement("br"));
	newDiv.appendChild(refeshBtn);
	newDiv.appendChild(searchBox);
	newDiv.appendChild(clearBtn);
	newDiv.appendChild(searchBtn);

	wsDiv.appendChild(newDiv);
}

//Controls the +/- button for expanding/shrinking workspace
function PlusBtnListener() {
	var gameDiv = document.getElementById("gameDiv");
	var controlDiv = document.getElementById("controlPanelDiv");
	var plusBtn = document.getElementById("plusBtn");

	if (plusBtn.innerHTML === "-") {
		controlDiv.style.display = "none";
		gameDiv.style.width = "100%";
		plusBtn.innerHTML = "+";

		if (sequences[0].k > 100) {
			ChangeFisheye(true);
		}
	} else {
		controlDiv.style.display = "block";
		gameDiv.style.width = "calc(80% - 100px)";
		plusBtn.innerHTML = "-";

		if (sequences[0].k > 100) {
			ChangeFisheye(false);
		}
	}
}

//Controls the refresh button, sliding the puzzle to original positions and clearing colors
function RefreshBtnListener() {
	if(blackFlag == true) {
		ReColor();
	}
	
	var currIndexes = CloneArray(firstIdexes);

	for (var i = 0; i < currIndexes.length; i++) {
		var dif = originalFirst - currIndexes[i];

		if (dif == 0) {
			continue;
		} else {
			for (var j = 0; j < Math.abs(dif); j++) {
				if (dif > 0) {
					InitiateClick("row_" + i, "leftArrow_" + i);
				} else if (dif < 0) {
					InitiateClick("row_" + i, "rightArrow_" + i);
				}
			}
		}
	}
}

//Search the whole puzzle for the inputted pattern
function SearchBtnListener(){
	highlighted = new Array(jsonSeq[currLevel].sequences.length);
	
	for(var i = 0; i < highlighted.length; i++) {
		highlighted[i] = [];
	}
	
	ReColor();
		
	for(var i = 0; i < Object.keys(sequences[0]).length-2; i++)
		SearchRow(i);
}

function GetXPos() {
	var idx = [];
	
	for(var i = 0; i < Object.keys(sequences[0]).length - 2; i++) {
		for(var j = 0; j < sequences[0].k + 1; j++) {
			var td = document.getElementById("overviewtd("+i+","+j+")");
			
			if(td.innerText.toUpperCase() === "X") {
				idx.push(j);
			}
			
			continue;
		}
	}
	
	return idx;
}

//Search for inputted pattern in a single row
function SearchRow(i,dir){
	var pattern = document.getElementById("searchBox").value.toUpperCase();
	var highlightedDivs = 0;
	
	//check if pattern is valid
	if(!isNaN(pattern) || pattern.length < 1 || CheckPattern(pattern) == false) {
		ClearBtnListener();
		return;
	}
	
	var orgFirst = Math.floor(sequences[0].k/2-sequences[0].n/2)-extraNuclsPerSide;
	var str = Object.values(sequences[0])[2+i].substr(0,sequences[0].k);
	
	//var xPositions = GetXPos();
	
	if(str.includes(pattern)){
		var substrings = GetAllSubstrings(str,pattern);
		var dif = orgFirst-firstIdexes[i];
		
		for(var j = 0; j < substrings.length; j++) {
			var onRight = 0;
			var onLeft = 0;
			
			for(var k = 0; k < pattern.length; k++) {
				var td;
				
				if(substrings[j]+k+dif >= sequences[0].k+1){
					onRight++;
					
					if(dir==="R") {
						if(highlighted[i][j] === undefined)
							highlighted[i][j] =- 1;
						else if(onRight == pattern.length)
								highlighted[i][j]++;
					} 
					else if(dir === "L" && onRight == pattern.length)
						highlighted[i][j]--;
				} else if(substrings[j]+k+dif < 0) {
					onLeft++;
					
					if(dir==="L") {
						if(highlighted[i][j] === undefined)
							highlighted[i][j]=-1;
						else if(onLeft == pattern.length)
								highlighted[i][j]++;
					} else if(dir === "R" && onLeft == pattern.length)
						highlighted[i][j]--;
				} else {
					td = document.getElementById("overviewtd("+i+","+(substrings[j]+k+dif)+")");
					highlightedDivs++;
					td.setAttribute("class","highlightedTD");
					td.addEventListener("click",PatternSelectedListener);
					blackFlag = true;
				}
				
				if(substrings[j]+k+dif >= originalFirst && substrings[j]+k+dif < originalFirst+sequences[0].n+extraNuclsPerSide*2){
					td = document.getElementById("td("+i+","+(substrings[j]+k+dif-originalFirst+1)+")");
					
					try{td.setAttribute("class","highlightedTD")}catch(e){}
				}
			}
			
			if(onRight > 0) { //if to right of pattern matching window
				var neg = false;
				
				if(highlighted[i][j] < 0) {
					highlighted[i][j] = 0;
					neg = true;
				}
				
				for(var k = highlighted[i][j]; k < highlighted[i][j]+onRight; k++){
					td = document.getElementById("overviewtd("+i+","+k+")");
					highlightedDivs++;
					td.setAttribute("class","highlightedTD");
					td.addEventListener("click",PatternSelectedListener);
					blackFlag = true;
				}
				
				if(neg == true) {
					highlighted[i][j] =- 1;
				}
			} else if(onRight == 0 && highlighted[i][j] >= 0 && onLeft == 0) { //if in pattern matching window
				highlighted[i][j]--;
			} else if(onLeft > 0) { //if to left of pattern matching window
				var neg = false;
				
				if(highlighted[i][j] < 0) {
					highlighted[i][j] = 0;
					neg = true;
				}
				
				for(var k=highlighted[i][j];k<highlighted[i][j]+onLeft;k++) {
					td = document.getElementById("overviewtd("+i+","+(sequences[0].k-k)+")");
					highlightedDivs++;
					td.setAttribute("class","highlightedTD");
					td.addEventListener("click",PatternSelectedListener);
					blackFlag = true;
				}
				
				if(neg == true)
					highlighted[i][j] =- 1;
			} else if(onLeft == 0 && highlighted[i][j] >= 0) {
				highlighted[i][j]--;
			}
		}
		
		//check if pattern is split (part of pattern on leftmost side and other part on rightmost side of puzzle)
		if(highlightedDivs != patternLength*substrings.length){
			var remaining = highlightedDivs-patternLength;
			var dir="L";
			
			if(document.getElementById("overviewtd("+i+","+0+")").className === "highlightedTD") {
				dir="R";
			}
			
			CheckSplit(i,remaining,dir)
		}
	}
}

//If pattern is split (part on left and part on right), color accordingly
function CheckSplit(i,num,dir){
	//console.log(num+" "+dir);
	
	for(var j = 0; j < Math.abs(num); j++){
		var k = 0;
		
		if(dir==="R")
			k = sequences[0].k-j;
		else 
			k = j;
		
		var td = document.getElementById("overviewtd("+i+","+k+")");
		td.setAttribute("class","highlightedTD");
	}
		
}

//Make sure input of search box is a valid pattern (made up of A,C,T,Gs only) 
function CheckPattern(pattern) {
	for(var i = 0; i < pattern.length; i++) {
		var curr = pattern.charAt(i);
		
		if(curr.toUpperCase() !== "A" && curr.toUpperCase() !== "C" && curr.toUpperCase() !== "T" && curr.toUpperCase() !== "G") {
			return false;
		}
	}

	return true;
}

//Find the pattern in the string and return first index of each found pattern
function GetAllSubstrings(str,pattern) {
	patternLength = pattern.length;
	str = str.toUpperCase();

	if (str.length == 0) {
        return [];
	}
	
	var startIndex = 0;
	var index = [];
	var indices = [];

    while((index = str.indexOf(pattern, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + pattern.length;
	}
	
    return indices;
}

//Restore original nucleotide colors of whole puzzle
function ReColor(){
	blackFlag = false;
	
	for(var i = 0; i < Object.keys(sequences[0]).length-2; i++) {
		ReColorRow(i);
	}
}

//Restore original nucleotide colors of row of zoomed and overviews
function ReColorRow(i){
	for(var j = 0; j < sequences[0].k+1; j++){
		var td = document.getElementById("overviewtd("+i+","+j+")");
		
		if(td.innerText==="A")
			td.setAttribute("class","adenosine");
		else if(td.innerText==="T")
			td.setAttribute("class","thymine");
		else if(td.innerText==="C")
			td.setAttribute("class","cytosine");
		else if(td.innerText==="G")
			td.setAttribute("class","guanine");
		else 
			td.setAttribute("class","noneine");
		
		td.removeEventListener("click",PatternSelectedListener)
	}
	
	for(var j = 1; j < sequences[0].n+extraNuclsPerSide*2+1; j++){
		var td = document.getElementById("td("+i+","+j+")");
		
		if(td.innerText==="A")
			td.setAttribute("class","adenosine");
		else if(td.innerText==="T")
			td.setAttribute("class","thymine");
		else if(td.innerText==="C")
			td.setAttribute("class","cytosine");
		else if(td.innerText==="G")
			td.setAttribute("class","guanine");
		else 
			td.setAttribute("class","noneine");
		
		td.removeEventListener("click",PatternSelectedListener)
	}
}

//When pattern is selected, shift pattern into pattern matching window, up against left side
function PatternSelectedListener() {
	var id = this.id;
	var firstSplit = id.split("(");
	var secSplit = firstSplit[1].split(",");
	var thirdSplit = secSplit[1].split(")");
	var i = parseInt(secSplit[0]);
	var j = parseInt(thirdSplit[0]);
	var orgFirst = Math.floor(sequences[0].k/2-sequences[0].n/2)-extraNuclsPerSide;
	var placePattern = orgFirst+extraNuclsPerSide;
	var orgLast = orgFirst+sequences[0].n+extraNuclsPerSide-1;
	var rightMax = orgLast-patternLength+1;
	var firstJ = j;
	var firstFound = false;
	
	while(firstFound==false) {
		if(firstJ-1 > 0) {
			var prevTd = document.getElementById("overviewtd("+i+","+(firstJ-1)+")");
			
			if(prevTd.classList.contains("highlightedTD") == true)
				firstJ--;
			else 
				firstFound=true;
		} else 
			firstFound=true;
	}
		
	var numOfShifts = 0;
	
	if(firstJ < placePattern){
		var dif = placePattern-firstJ;
		var k = 0;
		var reverse = false;
		
		while(k < dif) {
			if(InitiateClick("row_"+i,"rightArrow_"+i) ==- 1){
				k = dif;
				reverse = true;
			} else {
				k++; 
				numOfShifts++;
			}
			
			if(reverse == true) 
				ReverseShift("L",i,firstJ+numOfShifts);
		}
	} else if(firstJ > orgLast){
		var dif = firstJ-placePattern;
		var k = 0;
		var reverse = false;
		
		while(k < dif) {
			if(InitiateClick("row_"+i,"leftArrow_"+i) ==- 1) {
				if(!(firstJ-k<=rightMax)) {
					reverse=true;
				}
				
				k=dif
			} else {
				k++;
				numOfShifts++;
			}
			
			if(reverse == true)
				ReverseShift("R",i,firstJ-numOfShifts);
		}
	} else if(firstJ > placePattern){
		var shift = true;
		
		while(shift){
			if(InitiateClick("row_"+i,"leftArrow_"+i) ==- 1 || firstJ == placePattern+1)
				shift = false;
			
			firstJ--;
		}
	}
}

//Change shifting direction if blocked by 'x'
function ReverseShift(dir,i,firstJ) {
	var orgFirst = Math.floor(sequences[0].k/2-sequences[0].n/2);
	var cont = true;
	
	while(cont==true)
		if(dir==="R") {
			firstJ++;
			
			if(firstJ == sequences[0].k+1)
				firstJ = 0;
			if(InitiateClick("row_"+i,"rightArrow_"+i) == -1 || firstJ == orgFirst)
				cont = false;
		} else if(InitiateClick("row_"+i,"leftArrow_"+i)==-1)
			cont=false;
}

//Clear button in search box removes text and reverts colors of blocks
function ClearBtnListener() {
	document.getElementById("searchBox").value = "";
	ReColor();
}

//Change puzzle to represent preserved state
function UpdateState(state) {
	var stateIndexes = state.split(",")

	var currIndex = Math.floor(sequences[0].k / 2 - sequences[0].n / 2) - extraNuclsPerSide;

	for (var i = 0; i < stateIndexes.length; i++) {
		var dif = stateIndexes[i] - currIndex;

		if (dif == 0) {
			continue;
		} else {
			for (var j = 0; j < Math.abs(dif); j++) {
				if (dif > 0) {
					InitiateClick("row_" + i, "leftArrow_" + i);
				} else if (dif < 0) {
					InitiateClick("row_" + i, "rightArrow_" + i);
				}
			}
		}
	}
}

//Build the history div in html
function BuildHistoryDisplay(indexes) {
	var div = document.getElementById("historyDiv");

	indexHistory = [];
	motifHistory = [];
	pointsHistory = [];

	var idInd = 0;

	//each history is a table
	for(var i = indexes.length-1; i >= 0; i--) {
		var motifsTable = document.createElement("table");
		motifsTable.setAttribute("class", "motifsTable");
		motifsTable.setAttribute("id", "motifsTable_"+idInd);

		idInd++;

		indexHistory.push(indexes[i].map(Number));
		
		var motifArr = [];

		//add nucleotides (cells) to table
		for(var j = 0; j < indexes[i].length; j++) {			
			var tr = document.createElement("tr");

			var str = Object.values(sequences[0])[2 + j];

			var motifSubstring = "";

			for(var k = extraNuclsPerSide; k < sequences[0].n+extraNuclsPerSide; k++) {
				var td = document.createElement("td");

				var motifsTxt = document.createElement("text");
				var nucl = str.charAt(parseInt(indexes[i][j])+k);
				motifsTxt.innerHTML = nucl;
				motifSubstring+=nucl;

				if (nucl == "A") {
					td.setAttribute("class", "adenosine");
				} else if (nucl == "T") {
					td.setAttribute("class", "thymine");
				} else if (nucl == "C") {
					td.setAttribute("class", "cytosine");
				} else if (nucl == "G") {
					td.setAttribute("class", "guanine");
				} else {
					td.setAttribute("class", "noneine");
				}

				td.appendChild(motifsTxt);
				tr.appendChild(td);
			}

			motifArr.push(motifSubstring);

			motifsTable.appendChild(tr);
		}

		motifHistory.push(motifArr);
		
		div.appendChild(motifsTable);
	}

	//display points and consensus of each history table
	for(var i = 0; i < motifHistory.length; i++) {
		var calculated = CalculatePoints(motifHistory[i]);
		var motifsTable = document.getElementById("motifsTable_" + i);

		var points = parseInt(calculated.split('_')[0]);
		pointsHistory.push(points);

		var consensus = calculated.split('_')[1];

		var pointRow = motifsTable.insertRow(0);
		pointRow.setAttribute("id", "pointRow");

		var td = document.createElement("td");
		td.setAttribute("colspan", sequences[0].k);
				
		var txt = document.createElement("text");
		txt.innerHTML = "points: " + points;

		td.appendChild(txt);
		pointRow.appendChild(td);

		var conMotif = [];
	
		var conRow = document.createElement("tr"); 
		conRow.setAttribute("id", "consensusRow");
		
		for(var j = 0; j < parseInt(sequences[0].n); j++) {
			conMotif.push(consensus.split(' ')[j]);
			
			var td = document.createElement("td");
				
			var txt = document.createElement("text");
			conMotif[j] = conMotif[j].replace(/-/g, ' ');
			var nucl = conMotif[j];
			txt.innerHTML = nucl;
					
			td.appendChild(txt);
			conRow.appendChild(td);
		}

		motifsTable.appendChild(conRow);
	}
	
	HighestPoints();	
	ClearMotifs();
}

//Transform db saved history string to an array or histories
function ConvertHistoryToArray(stateHistory) {
	var evals = stateHistory.split("/");

	var arr = [];

	for (var i = 0; i < evals.length; i++) {
		var values = evals[i].split(",");

		arr.push(values);
	}

	return arr;
}

/*
//When leaving webpage
window.addEventListener('beforeunload', function (e) {
	e.preventDefault();
	e.returnValue = '';
});*/

//If search box is selected, only allow movement in searchbox
document.getElementById('searchBox').onkeypress = function(e){
    if (!e) e = window.event;
	var keyCode = e.keyCode || e.which;
	
    if (keyCode == '13') {
		SearchBtnListener();

    	return false;
    }
}