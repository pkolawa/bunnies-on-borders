var app = new PIXI.Application(800, 600, {backgroundColor : 0xfafafa});
document.getElementById('app').appendChild(app.view);


var graphics = new PIXI.Graphics();

graphics.lineStyle(7, 0xFF0000, 1);
graphics.beginFill(0xfafafa, 0.4);

// Polygon with polish borders
const polishPolygon = new PIXI.Polygon(
  new PIXI.Point(120, 110),
  new PIXI.Point(370, 50),
  new PIXI.Point(370, 80),
  new PIXI.Point(640, 95),
  new PIXI.Point(690, 240),
  new PIXI.Point(660, 260),
  new PIXI.Point(680, 320),
  new PIXI.Point(695, 420),
  new PIXI.Point(635, 520),
  new PIXI.Point(640, 555),
  new PIXI.Point(580, 520),
  new PIXI.Point(550, 505),
  new PIXI.Point(430, 500),
  new PIXI.Point(390, 500),
  new PIXI.Point(320, 473),
  new PIXI.Point(260, 470),
  new PIXI.Point(160, 415),
  new PIXI.Point(110, 255),
  new PIXI.Point(100, 240),
  new PIXI.Point(120, 110)
);

graphics.drawPolygon(polishPolygon);

var backgroundsContainer = new PIXI.Container();
backgroundsContainer.x = app.renderer.width / 2;
backgroundsContainer.y = app.renderer.height / 2;
backgroundsContainer.zOrder = 10;
var countryBackgrounds = [
    'https://mylifein.pl/bunnies-on-borders/img/joanna_darc.jpg',
    'https://mylifein.pl/bunnies-on-borders/img/duda_sun.jpg',
    'https://mylifein.pl/bunnies-on-borders/img/bunnyVilnus.jpg',
    'https://mylifein.pl/bunnies-on-borders/img/misio.jpg'
];

function addBackground(){
    if(backgroundsContainer.children.length > 0){
        backgroundsContainer.children[0].destroy();
    }
    var bgFront = PIXI.Sprite.fromImage(countryBackgrounds[Math.floor(Math.random() * countryBackgrounds.length)]);
    bgFront.anchor.set(0.5);
    backgroundsContainer.addChild(bgFront);
}
addBackground();

var graphicsCopy = graphics.clone();
backgroundsContainer.mask = graphicsCopy;
app.stage.addChild(backgroundsContainer);


app.stage.addChild(graphics);

// create a texture from an image path
var texture = PIXI.Texture.fromImage('https://mylifein.pl/bunnies-on-borders/img/kroliczek3.png');
// Scale mode for pixelation
texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
// Creating container for bunnies
var bunniesContainer = new PIXI.Container();
// Adding 10 bunnies
function addBunnies(){
  for (var i = 0; i < 10; i++) {
      createBunny();
  }
}
addBunnies();
app.stage.addChild(bunniesContainer);

function createBunny(x, y) {
    // create our little bunny friend..
    var bunny = new PIXI.Sprite(texture);
    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;
    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;
    // center the bunny's anchor point
    bunny.anchor.set(0.5);
    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);
    // setup events for mouse + touch using
    // the pointer events
    bunny
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

        // For mouse-only events
        // .on('mousedown', onDragStart)
        // .on('mouseup', onDragEnd)
        // .on('mouseupoutside', onDragEnd)
        // .on('mousemove', onDragMove);

        // For touch-only events
        // .on('touchstart', onDragStart)
        // .on('touchend', onDragEnd)
        // .on('touchendoutside', onDragEnd)
        // .on('touchmove', onDragMove);
    bunny.x = 0;
    bunny.y = 0;

    while(!polishPolygon.contains(bunny.x, bunny.y)){
      bunny.x = Math.floor(Math.random() * app.renderer.width);
      bunny.y = Math.floor(Math.random() * app.renderer.height);
    }
    bunniesContainer.addChild(bunny);
}

function removeBunnies(container){
    while(container.children.length > 0){
        container.children[0].destroy();
    }
}

// create a text object that will be updated...
var countingTextStyle = {
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontSize: 40,
  fontFamily: 'Arial',
  fill: '#3e1707',
  align: 'center',
  stroke: '#ffffff',
  strokeThickness: 3
};
var countingText = new PIXI.Text('Czas: 0 s', countingTextStyle);

countingText.x = app.renderer.width / 2;
countingText.y = 550;
countingText.anchor.set(0.5, 0.5);

app.stage.addChild(countingText);


var startTime = Date.now();
var tickerStarted = false;
var gameTicker = new PIXI.ticker.Ticker();
gameTicker.add(function() {
    // update the text with a new string
    countingText.text = 'Czas: ' + ((Date.now() - startTime) / 1000).toFixed(3) + ' s';
});



function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;

    // Checking if ticker has already started
    if(!tickerStarted){
      startTime = Date.now();
      tickerStarted = true;
    }
    gameTicker.start();
}
function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;

}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);

        if(newPosition.y <= 51){
          newPosition.y = 51;
        }else if(newPosition.y >= 555){
          newPosition.y = 554;
        }

      	if(newPosition.x < polishPolygonRange[newPosition.y][0]){
          newPosition.x = polishPolygonRange[newPosition.y][0];
        }else if(newPosition.x > polishPolygonRange[newPosition.y][1]){
          newPosition.x = polishPolygonRange[newPosition.y][1];
        }

        this.x = newPosition.x;
        this.y = newPosition.y;

      if(checkBunniesOnBorders()){
        finishGame();
      }
    }

}

function checkBunniesOnBorders(){
  var allBunniesOnBorders = true;
  for(var i = 0; i < 10; i ++){
    var bunnyPos = bunniesContainer.children[i].position;

    if(bunnyPos.x > polishPolygonRange[bunnyPos.y][0] && bunnyPos.x < polishPolygonRange[bunnyPos.y][1]){
      allBunniesOnBorders = false;
    }else{
      bunniesContainer.children[i].interactive = false;
      bunniesContainer.children[i].alpha = 0.5;
    }
  }

  return allBunniesOnBorders;
}

// Show finish screen method
function finishGame(){
  var finishGraphics = new PIXI.Graphics();
  finishGraphics.lineStyle(2, 0xFFFFFF, 1);
  finishGraphics.beginFill(0xFFFFFF, 1);
  finishGraphics.drawRect(0, 0, 800, 300);
  finishGraphics.lineStyle(2, 0xFF0000, 1);
  finishGraphics.beginFill(0xFF0000, 1);
  finishGraphics.drawRect(0, 300, 800, 300);

    var style = new PIXI.TextStyle({
        fontWeight: 'bold',
        fontSize: 50,
        fontFamily: 'Comic Sans MS',
        fill: '#000000',
        align: 'center',
        stroke: '#ff0000',
        strokeThickness: 5,
        wordWrap: true,
        wordWrapWidth: 400
    });

    var basicText = new PIXI.Text('Wszystkie króliczki u bram', style);
    basicText.x = app.renderer.width / 2;
    basicText.y = 300;
    basicText.anchor.set(0.5, 0.5);

    var countingFinishText = new PIXI.Text(countingText.text, countingTextStyle);
    countingFinishText.x = basicText.x;
    countingFinishText.y = 550;
    countingFinishText.anchor.set(0.5, 0.5);

    var finishContainer = new PIXI.Container();
    finishContainer.interactive = true;
    finishContainer.buttonMode = true;
    finishContainer.on('pointerdown', removeContainer);
    finishContainer.addChild(finishGraphics);
    finishContainer.addChild(basicText);
    finishContainer.addChild(countingFinishText);

    // Stopping ticker
    gameTicker.stop();
    // Display finish screen
    app.stage.addChild(finishContainer);
    // Removing placed bunnies
    removeBunnies(bunniesContainer);
    // Adding fresh new bunnies
    addBunnies();
    // Adding new background
    addBackground();
    // Sending time to GA
    dataLayer.push({'event': 'koniecGry','eventCategory': 'Gry online', 'eventAction':'finishGame', 'eventLabel':'Bunnies on Borders', 'eventValue': parseInt(gameTicker.elapsedMS), 'metric10':((Date.now() - startTime) / 1000).toFixed(3)});
    // Reset ticker start time
    tickerStarted = false;
}

function removeContainer(){
  this.destroy();
}

function checkPolygonRange(polygon){
  var rangeArray = [];

  // Y-axis app screen range
  for(var y = 0; y < 600; y++){
    // X-axis borders that shrinks down to polishPolygon borders
    var borders = [0,800];

    // Go right from left app border up to left polishPolygon border
    do{
      borders[0]++;
    }while(!polygon.contains(borders[0],y) && borders[0] < 800);
    // Go left from right app border up to right polishPolygon border
    do{
      borders[1]--;
    }while(!polygon.contains(borders[1],y) && borders[1] > 0);

    rangeArray.push(borders);
  }

  return rangeArray;
}

function startScreen(){
	var finishGraphics = new PIXI.Graphics();
	finishGraphics.lineStyle(2, 0xfafafa, 0.8);
	finishGraphics.beginFill(0xfafafa, 0.8);
	finishGraphics.drawRect(0, 0, 800, 600);
	// finishGraphics.lineStyle(2, 0xFF0000, 1);
	// finishGraphics.beginFill(0xFF0000, 1);
	// finishGraphics.drawRect(0, 300, 800, 300);

	var style = new PIXI.TextStyle({
	    fontWeight: 'bold',
	    fontSize: 50,
	    fontFamily: 'Comic Sans MS',
	    fill: '#000000',
	    align: 'center',
	    stroke: '#ff0000',
	    strokeThickness: 5,
	    wordWrap: true,
	    wordWrapWidth: 500
	});

	var startingText = new PIXI.Text('Przeciągnij wszystkie króliczki na granicę kraju. One też będą odmawiały różaniec...', style);
	startingText.x = app.renderer.width / 2;
	startingText.y = 300;
	startingText.anchor.set(0.5, 0.5);

	var startContainer = new PIXI.Container();
	startContainer.interactive = true;
	startContainer.buttonMode = true;
	startContainer.on('pointerdown', removeContainer);
	startContainer.addChild(finishGraphics);
	startContainer.addChild(startingText);

	// Display finish screen
	app.stage.addChild(startContainer);
}
startScreen();
// Collect the points from inside of polishPolygon to further checking bunnies possitions
polishPolygonRange = checkPolygonRange(polishPolygon);
