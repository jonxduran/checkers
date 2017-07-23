
class GameBoard extends React.Component {

	render() {
		var self = this;
		return React.createElement(
			'div',
			{ id: 'boardrender', className: 'boardrender', displayName: "GameBoard" },
			this.props.boardstate.map(function (el, i) {
				var self2 = el;
				return React.createElement(
					'div',
					{ key: i, className: 'board-cell', onClick: () => self.props.onClick(i) },
					React.createElement(
						'div', 
						{ className: 'indexu ' + el.owner + ' ' + el.level + ' ' + el.selected }, 
						el.cell
					),
				);
			})
		);
	}

};

class TheGame extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			boardstate: this.props.boardstate,
			turno: this.props.turno,
			ponepieces: this.props.ponepieces,  //pieces not passed down, so
			ptwopieces: this.props.ptwopieces   //don't need to update props, only state
		};
	}

	handleClick(i) {
		//console.log("handleclick " + i);
		if (!sel1) {
			if(this.props.boardstate[i].owner === this.state.turno[0]) {
				sel1 = this.props.boardstate[i];
				//change color of piece to show selected
				sel1.selected = 'selected';
				this.setState({ boardstate: this.props.boardstate });
			} else {
				console.log("not " + this.state.turno[0] + " piece");
			}
		} else if (sel1) {

			var colcheck = () => {	
				const changed = (sel1.col - this.props.boardstate[i].col);
				const abschanged = Math.abs(changed);
				const sign = changed > 0 ? 1 : -1;

				switch (sel1.level) {

					case "A":	
						return [abschanged, (this.props.boardstate[i].col + sign)];
					
					default:
						if (abschanged > 2) { return false; } 
						else { return [abschanged, (this.props.boardstate[i].col + sign)]; }
						
				}
			}

			var rowcheck = () => {
				const changed = (sel1.row - this.props.boardstate[i].row);
				const abschanged = Math.abs(changed);
				const sign = changed > 0 ? 1 : -1;
				
				switch (sel1.level) {
					
					case "A":
						return [Math.abs(changed), (this.props.boardstate[i].row + sign)];

					case "B":
						if (abschanged > 2) { return false; } 
						else { return [abschanged, (this.props.boardstate[i].row + sign)]; }

					default:
						if (sel1.owner == 'playerone') {
							if (changed < 0 || abschanged > 2) { return false; }
							else { return [abschanged, (this.props.boardstate[i].row + sign)]; }
						} else if (sel1.owner == 'playertwo') {
							if (changed > 0 || abschanged > 2) { return false; }
							else { return [abschanged, (this.props.boardstate[i].row + sign)]; }
						}
				}
			}
			

			if (this.props.boardstate[i].owner == '') {
				
				if ( (colcheck()[0] && rowcheck()[0]) && (colcheck()[0] == rowcheck()[0]) ) {
					
					var ren;
					if ( rowcheck()[0]>1 && (colcheck()[0]==rowcheck()[0]) ) {
						hopper(colcheck()[1], rowcheck()[1], this, sel1, i);
						console.log('rowcolcheck');
					} else if (havepotential>0) {
						console.log('incorrect hop continuation');
					} else {
						this.props.boardstate[i].level = sel1.level;
						this.props.boardstate[i].owner = this.state.turno[0];
						sel1.owner = '';
						hopagain = false;
						ren = true;
						console.log('rowcolelse');
					}
										
					if(ren) {						
						if (this.props.boardstate[i].level == 'C') {
							if ( (this.props.turno[0] == 'playerone' && this.props.boardstate[i].row == 0) 
							|| (this.props.turno[0] == 'playertwo' && this.props.boardstate[i].row == 7) ) {
								this.props.boardstate[i].level = 'B';  //king piece at end row
							} 
						}

						if (!hopagain) {	
							if (this.props.turno == owners[0]) {this.props.turno = owners[1];}
							else {this.props.turno = owners[0];}  //change player turn
							sel1.selected = '';
							console.log("not hopagain");
						}						
						if (hopagain) { 
							sel1.selected = '';  //reset old spot
							sel1 = this.props.boardstate[i];  //set new spot as first select
							sel1.selected = 'selected';       //add glow to new first select
							console.log("hopagain");
						}
						
						this.winnar();
						this.setState({ 
							boardstate: this.props.boardstate,
							turno: this.props.turno
						});
						if (!hopagain) { 
							sel1 = "";
							potentials = [];
							havepotential = 0;
						} //successful turn, reset for next person
					} else {
						resetsel(this, sel1.cell,1);
					}
					
				} else {
					resetsel(this, sel1.cell,2);
				}
			} else {
				resetsel(this, sel1.cell,3);
			}

			function hopper(c,r,t,s,i) {
				var hc = true;			
				var dhop = c + (r * gridsize);
				console.log("hopped: "+dhop);
				
				if(t.props.boardstate[dhop].owner == t.props.turno[0]) { 
					hc = false;
					hopagain = true;
					console.log("badhop1 - hop mine");
				}
				if(t.props.boardstate[s.cell].level != 'A' && t.props.boardstate[dhop].owner == '') { 
					hc = false;
					hopagain = true;
					console.log("badhop2"); 
				}

				if (hc) {
					t.props.boardstate[dhop].owner = '';
					t.props.boardstate[dhop].level = 'C';
					t.props.boardstate[i].level = s.level;
					t.props.boardstate[i].owner = t.state.turno[0];
					t.props.boardstate[s.cell].owner = '';
					t.props.boardstate[s.cell].level = 'C';
					ren = true;

					potentialcheck(t,s,i,dhop);	
				}

							
			}


			function potentialcheck(t,s,i,dhop) {
				
				var hop = (co,ro,ci,ri) => ( ((co).between(-1,8)) && ((ro).between(-1,8)) && ((ci).between(-1,8)) && ((ri).between(-1,8)) ) ? [ (co + (ro * gridsize)), (ci + (ri * gridsize)) ] : false;

				
				potentials[0] = hop(t.props.boardstate[i].col-1, t.props.boardstate[i].row-1, t.props.boardstate[i].col-2, t.props.boardstate[i].row-2)	;
				potentials[1] = hop(t.props.boardstate[i].col+1, t.props.boardstate[i].row-1, t.props.boardstate[i].col+2, t.props.boardstate[i].row-2)	;
				potentials[2] = hop(t.props.boardstate[i].col-1, t.props.boardstate[i].row+1, t.props.boardstate[i].col-2, t.props.boardstate[i].row+2) ;
				potentials[3] = hop(t.props.boardstate[i].col+1, t.props.boardstate[i].row+1, t.props.boardstate[i].col+2, t.props.boardstate[i].row+2) ;
								
				console.log(t.props.turno);
				if (t.props.boardstate[i].level == 'C') {
					if (t.props.turno[0] == 'playerone') { potentials[2] = false, potentials[3] = false; }
					if (t.props.turno[0] == 'playertwo') { potentials[0] = false, potentials[1] = false; }
				}
				
				havepotential = 0;
				for (let j=0; j<4; j++) {
					
					if (potentials[j] && (t.props.boardstate[potentials[j][1]].owner.length > 0) ) {
						console.log("bad hop, landing full: " + potentials[j][1] + " " + t.props.boardstate[potentials[j][1]].owner);
						potentials[j] = false;
					}
					if (potentials[j] && (t.props.boardstate[potentials[j][1]].owner == '') && (t.props.boardstate[potentials[j][0]].owner == t.props.turno[0]) ) { 
						potentials[j] = false;
					}
					if (potentials[j] && (t.props.boardstate[potentials[j][0]].owner == '') ) {
						//console.log(j+" bad hop, empty hop: " + potentials[j][0]);
						potentials[j] = false;
					}
					if (potentials[j]) { havepotential++; }
				}
				console.log("final potentials");
				console.log(potentials);
				console.log(havepotential);

				hopagain = (havepotential > 0) ? true : false;
				
			}


			function resetsel(t,s,n) {
				if (!hopagain){
					sel1 = '';
					console.log(n+ " unselect " + s);
					t.props.boardstate[s].selected = '';
					t.setState({ boardstate: t.props.boardstate });
				}
			}

		} //end of sel2
		
	}

	winnar() {
		var p1=0, p2=0;
		this.props.boardstate.forEach(function(el) {
			if(el.owner == 'playerone') {p1 += 1;}
			else if(el.owner == 'playertwo') {p2 += 1;}
		}, this);
		this.props.ponepieces = p1;
		this.props.ptwopieces = p2;
		this.setState({ 
			ponepieces: this.props.ponepieces,
			ptwopieces: this.props.ptwopieces
		})
		if (p1==0 || p2==0) {
			//alert("game over!");
		}
	}

	render() {
		
		return React.createElement(
			"div",
			null,
			React.createElement(
				'div',
				{ id: 'topbar' },
				React.createElement(
					"div",
					{ id: 'topbar-left', className: this.state.turno[0] },
					React.createElement(
						"div",
						{ id: 'topbar-left-inner'},
						'Turn:  ' + this.state.turno[1]
					)
				),
				React.createElement(
					"div",
					{ id: 'topbar-right'},	
					React.createElement(
						"div",
						{ className: 'row'},
						owners[0][1] + ': ' + this.state.ponepieces
					),
					React.createElement(
						"div",
						{ className: 'row'},
						owners[1][1] + ': ' + this.state.ptwopieces
					)
				)
			),
			
			React.createElement(
				'div',
				{ className: 'theboard' },
				React.createElement(GameBoard, { 
					boardstate: this.state.boardstate,
					onClick: i => this.handleClick(i)
				} )
			),

			React.createElement(
				'div',
				{ id: 'bottombar' },
				null				
			)
		);
	}

}

