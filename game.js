var maxScreenWidth = 768;
var regGrid = true;
var numberOfColumns = 5;
var numberOfRows = 5;
var maxColumns = 8;
var maxRows = 8;
// Amount of screen space to be saved for the UI in pixels
var reservedSpace = 150;
// Side wall in pixels
var reservedSides = 15;



function mapBuilder() {

    // Get display width
    screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    // Max screen width for desktop viewing
    if (screenWidth > maxScreenWidth) { screenWidth = maxScreenWidth; }
    console.log("screenwidth: "+screenWidth);

    // Change grid by game type
    if (regGrid) {
        numberOfColumns = maxColumns;
        numberOfRows = maxRows;
    }

    // Get display height
    screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    screenWidth = screenWidth - (reservedSides * 2);

    cellSize = Math.floor(screenWidth / numberOfColumns);
    console.log("cellsize: "+cellSize);
    totalCells = numberOfColumns * numberOfRows;

    // Resize UI to match grid size
    cellFontSize = cellSize / 5 + 'px';
    uiWidth = (numberOfColumns * cellSize) + 'px';
    console.log("uiwidth: "+uiWidth);
    topBar = document.getElementById('top-bar');
    topBar.style.width = uiWidth;
    bottomBar = document.getElementById('bottom-bar');
    bottomBar.style.width = uiWidth;
    boardContainer = document.getElementById('board-container');
    boardContainer.style.width = numberOfColumns * cellSize + 'px';
    timeBar = document.getElementById('time');
    
    boardContainer.innerHTML = '';
    map = [];

    //cycle through each row
    for (var r = 0; r < numberOfRows; r++) {
        var newRow = [];
        var row = 'r' + r;
        // Cycle through each column
        for (var c = 0; c < numberOfColumns; c++) {
            var col = 'c' + c;
            var location = row + col;
            // Create an object with these details and push to an array
            location = new Cell(location,r,c);
            newRow.push(location);
        }
        map.push(newRow);
    }
    console.log(map);
}


// Object constructor for building the map
function Cell(location,row,col) {
    this.location = location
    this.row = row;
    this.col = col;
    this.mypiece = false;
    this.enepiece = false;
}