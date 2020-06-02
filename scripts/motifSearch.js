/*
 * Motif Search Algorithm for nucleoSLIDE: Greedy Motif Search with Pseudocounts
 *
 * author: Allison Poh
 * last modified: 5/12/2020
 * for MS Thesis, UMass Dartmouth (May 2020)
 */

var DNAvarS = [];
var K = jsonSeq[currLevel].n;
var T = jsonSeq[currLevel].sequences.length;
var solutionPts = 0;

BeginMotifSearch();

//Start search
function BeginMotifSearch() {
	var dnas = [];
	var bestMotifs = [];
	
	for(var i = 0; i < T; i++) {
		dnas.push(jsonSeq[currLevel].sequences[i]);
	}
	
	bestMotifs = BuildFirstMotifs(dnas,K);
	bestMotifs = GreedyMotifSearchWithPseudocounts(bestMotifs,dnas,K,T);
	Complete(bestMotifs);
	DNAvarS = bestMotifs;
}

//Build first motif matrix where each motif is the first possible motif of each sequence
function BuildFirstMotifs(dnas,k) {
	var bestMotifs = [];
	
	for(var i = 0; i < dnas.length; i++) {
		var subSeq = dnas[i].substring(0,k);
		bestMotifs.push(subSeq);
	}
	
	return bestMotifs;
}

//Find best motifs
function GreedyMotifSearchWithPseudocounts(bestMotifs,dnas,K,T) {
	var bestScore = MotifsScore(bestMotifs);
	
	for(var i = 0; i < dnas[0].length-K+1; i++) { //for each kmer motif in the first string of dnas
		var currMotifs = []; 
		currMotifs.push(dnas[0].substring(i,i+K)); //motif1 = motif
		
		for(var j = 1; j < T; j++) { //for 2 to t, form profile and set motif1 to profile-most probable
			var profile = CreateProfileMatrix(currMotifs);
			var nextMotif = ProfileMostProbable(profile,dnas[j],K);
			currMotifs.push(nextMotif);
		}
		
		var currScore = MotifsScore(currMotifs);
		
		if(currScore < bestScore) { //compare scores
			bestScore = currScore;
			bestMotifs = CloneArray(currMotifs);
		}
	}
	
	return bestMotifs;
}

//Calculate the score of the motifs
function MotifsScore(motifs){
	var row = motifs.length;
	var col = motifs[0].length;
	var score = 0;
	
	for(var i = 0; i < col; i++) {
		var a = 0, c = 0, g = 0, t = 0;
		
		for(var j = 0; j < row; j++) {
			var par = motifs[j].charAt(i);
			var errorMsg = "error scoring motifs";
			
			switch(par){
				case "A":
					a++;
					break;
				case "C":
					c++;
					break;
				case "G":
					g++;
					break;
				case "T":
					t++;
					break;
				default:
					console.log(errorMsg);
			}
		}
			
		score += (row - Math.max(a,c,g,t));
	}
	
	return score;
}

//Build th eprofile matrix
function CreateProfileMatrix(motifs){
	var row = motifs.length;
	var col = motifs[0].length;
	var profile = [];
	
	for(var i = 0; i < 4; i++) {
		profile[i] = [];
	}
	
	for(var i = 0; i < col; i++){
		var nuclCnt = motifs.length;
		var a = 1, c = 1, g = 1, t = 1; //start at one (pseudocounts)
		
		for(var j = 0; j < row; j++) {
			var par = motifs[j].charAt(i);
			var errorMsg = "error creating profile matrix";
			
			switch(par){
				case "A":
					a++;
					break;
				case "C":
					c++;
					break;
				case "G":
					g++;
					break;
				case "T":
					t++;
					break;
				default:
					console.log(errorMsg);
			}
		}
			
		profile[0][i] = a/nuclCnt;
		profile[1][i] = c/nuclCnt;
		profile[2][i] = g/nuclCnt;
		profile[3][i] = t/nuclCnt;
	}
	
	return profile;
}

//Find the profile-most probable kmer
function ProfileMostProbable(profile,seq,K) {
	var kmer = seq.substring(0,K);
	var score = ProfileScore(kmer,profile);
	var length = seq.length-K+1;
	var last = seq.length-K+1;
	
	for(var i = 1; i < last; i++) {
		var currSeq = seq.substring(i,i+K);
		var currProf = ProfileScore(currSeq,profile);
		
		if(currProf > score) {
			kmer = currSeq;
			score = currProf;
		}
	}
	
	return kmer;
}

//Score profile
function ProfileScore(seq,profile) {
	var score = 1;
	
	for(var i = 0; i < seq.length; i++) {
		var curr = 0;
		
		switch(seq.charAt(i)) {
			case "A":
				curr = profile[0][i];
				break;
			case "C":
				curr = profile[1][i];
				break;
			case "G":
				curr = profile[2][i];
				break;
			case "T":
				curr = profile[3][i];
				break;
			default:
				console.log("error scoring profile");
		}
		
		score *= curr;
	}
	
	return score;
}

//Build a consensus string
function BuildConsensus(motifs,length) {
	var consensus = "";
	var profile = CreateProfileMatrix(motifs);
	
	for(var i = 0; i < length; i++) {
		var max = 0;
		var nucl = " ";
		
		for(var j = 0; j < 4; j++) {
			if(profile[j][i] > max) {
				max = profile[j][i];
				
				switch(j) {
					case 0:
						nucl = "A";
						break;
					case 1:
						nucl = "C";
						break;
					case 2:
						nucl = "G";
						break;
					case 3:
						nucl = "T";
						break;
					default:
						console.log("error building consensus");
				}
			}
		}
				
		consensus += nucl;
	}
	
	return consensus;
}

//End search
function Complete(motifs){
	var motifLen = jsonSeq[currLevel].n;
	var points = motifLen*jsonSeq[currLevel].sequences.length-MotifsScore(motifs);
	
	consensus = BuildConsensus(motifs,motifLen);
	solutionPts = points;
	
	/*console.log("consensus: "+consensus+", score: "+solutionPts)*/
}

//Allows for copying arrays without altering the original
function CloneArray(array) {
	var clone = [];
	var val, key;

	for (key in array) {
		val = array[key];
		clone[key] = (typeof val === "object") ? CloneArray(val) : val;
	}

	return clone;
}
