var gridsize;
var color1 = "white";
var color2 = "gray";
var gamepiece;
var sel1, sel1n;
var sel2;
var turn, turnclass;
var truetap = true;
var cellarr = [];
var cellels;
var potentials = [];
var havepotential = 0;
var owners = [ ['playerone', ''], ['playertwo', ''] ];
var hopagain = false;
var boardcontainer = document.getElementById("board-container");

function mapBuilder(boardsize) {  //64
    for (i=0; i<boardsize; i++){
        cellarr[i] = {
            cell: i,
            row: "",
            col: "",
            owner: "",
	    selected: "",
            color: color1,
            level: "C"
        }
    }

    var powner = 1.5*(Math.sqrt(boardsize));  //12
    var twopieces = [1,3,5,7,8,10,12,14,17,19,21,23];
    var onepieces = [40,42,44,46,49,51,53,55,56,58,60,62];

	/* set owners here */
	for (i=0; i<powner; i++){
        cellarr[twopieces[i]].owner = "playertwo";
    }
    for (i=0; i<powner; i++){
        cellarr[onepieces[i]].owner = "playerone";
    }

    for (i=0; i<8; i++){
        for (j=i; j<64; j+=8){
            cellarr[j].col = i;
        }
    }
    for (i=0; i<64; i+=8){
        for (j=i; j<(i+8); j++) {
            cellarr[j].row = (i/8);
        }
    }


    ReactDOM.render(React.createElement(TheGame, { 
		boardstate: cellarr, 
		ponepieces: powner, 
		ptwopieces: powner,
		turno: owners[0]
	}), boardcontainer);
}


function builderarrow() {
	console.log("arrow");
	document.getElementById('builder-size-menu').classList.toggle('down');
}

function builderbutton() {
	//console.log("buildbutton");
	var brdsize = document.getElementById('builder-size-button-container').querySelector('.open').firstElementChild.innerText;
	var p1 = 'playerone', p2 = 'playertwo';

	if (document.getElementById('p1input').value.length > 0 ) {
		p1 = document.getElementById('p1input').value;
	}
	if (document.getElementById('p2input').value.length > 0 ) {
		p2 = document.getElementById('p2input').value;
	}

	owners[0][1] = p1;
	owners[1][1] = p2;
	
	document.getElementById('builder').classList.add('displaynone');
	/* document.getElementById('effectsq1').classList.add('displaynone');
	document.getElementById('effectsq2').classList.add('displaynone');
	document.getElementById('effectsq3').classList.add('displaynone'); */
	document.getElementById('board-container').classList.remove('displaynone');
	mapBuilder(Math.pow(brdsize,2));
}



Number.prototype.between = function (min, max) {
    return this > min && this < max;
};


window.onload = function() {
    console.log("LOADED")
    gridsize = 8;
}
