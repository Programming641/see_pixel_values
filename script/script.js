window.onload = init;

const IMAGE_SOURCE = "../swan.png";

const STARTING_X_ON_CANVAS = 0;
const STARTING_Y_ON_CANVAS = 0;

// after choosing starting coordinate on the original image. width and height values are fixed 
// instead of letting the user to choose the width and height
const IMAGE_WIDTH = 150;
const IMAGE_HEIGHT = 150;

// same as the chosen image size, the pixel range is also fixed, instead of letting the user to 
// decide it
const PIXEL_VALUES_RANGE_WIDTH = 100;
const PIXEL_VALUES_RANGE_HEIGHT = 100;


function init() { // ------------------------                     init function                       ------------------------

var XYvaluesArray = { x: null, y: null, initialx: 0, initialy: 200 };

var imgSource = document.getElementById("imageSource");
imgSource.src = IMAGE_SOURCE;

var messageBox = document.getElementById("divForEnteringPixelCoordinates");
var coordinateInfoBox = document.getElementById("mouseCoordinateDisplay");
var ConfirmButton = document.getElementById("pixelRangeInfoByClicking");
var cancelButton = document.getElementById("startOverAgain");
var canvasClipped = document.getElementById("canvasForClippedImage");

var canvasOriginal = document.getElementById("canvasForOriginalimage");
canvasOriginal.width = imgSource.width;
canvasOriginal.height = imgSource.height;
var ctxOriginal = canvasOriginal.getContext("2d"); 
ctxOriginal.drawImage(imgSource, 0, 0, imgSource.width, imgSource.height, STARTING_X_ON_CANVAS, STARTING_Y_ON_CANVAS, imgSource.width, imgSource.height);



canvasOriginal.addEventListener('mousemove', canvasOriginalMouseMove, false);
canvasOriginal.addEventListener('click', canvasOriginalMouseClick, false);
messageBox.addEventListener('mouseenter', messageBoxEnter, false);
coordinateInfoBox.addEventListener('mouseenter', coordinateInfoBoxEnter, false);
ConfirmButton.addEventListener('click', confirmButtonClick, false);
cancelButton.addEventListener('click', cancelButtonClick, false);
canvasClipped.addEventListener('click', clippedCanvasClick, false);
window.onscroll = function() {windowScroll();}


initClipedCanvasDisplay();

drawImageOnSecondCanvas(XYvaluesArray);

drawRectangleOnCanvas( canvasOriginal, XYvaluesArray["initialx"] , XYvaluesArray["initialy"] , IMAGE_WIDTH , IMAGE_HEIGHT );

} // ------------------------                     init function                       ------------------------


function drawImageOnSecondCanvas(xyValues) {

	var canvasClipped = document.getElementById("canvasForClippedImage");
	canvasClipped.width = IMAGE_WIDTH ;
	canvasClipped.height = IMAGE_HEIGHT ;
	var ctx = canvasClipped.getContext("2d");
	var img = new Image();
	img.src = IMAGE_SOURCE;

	if (xyValues["x"] != null && xyValues["y"]  != null ) {
	  ctx.drawImage(img, xyValues["x"], xyValues["y"], IMAGE_WIDTH, IMAGE_HEIGHT, STARTING_X_ON_CANVAS, STARTING_Y_ON_CANVAS, canvasClipped.width, canvasClipped.height );
	  getPixelValues(ctx);
	} else {

	  ctx.drawImage(img, xyValues["initialx"]  , xyValues["initialy"] , IMAGE_WIDTH, IMAGE_HEIGHT, STARTING_X_ON_CANVAS, STARTING_Y_ON_CANVAS, IMAGE_WIDTH, IMAGE_HEIGHT ) ;
	  
	  getPixelValues(ctx);
	}
  
}

function getPixelValues(ctx) { // ------------------------                     getPixelValues function                       ------------------------

			var imgData = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
			var index = 0;
			var   displayData = "";
			var alphaPrev = 0;
			var alphaCurrent = 0;
			var alphaHasDifferentValueCounter = 0;
			var i;

			for ( i=0;i<imgData.data.length;i+=4) { // for loop for displaying pixel values
			red = imgData.data[index];
			green = imgData.data[index +1];
			blue = imgData.data[index + 2];
			alpha = imgData.data[index + 3];

			// check if all alpha values are the same 
			// if they are all the same values, don't display alpha values
			if (index == 0) { // first time loop
				alphaPrev = alpha ;
					} else if (alphaCurrent == 0) { // second time loop. alphaCurrent is empty (initialized state, 0)
						alphaCurrent = alpha;
					} else { // 3rd time onward
						alphaPrev = alphaCurrent;
						alphaCurrent = alpha;
					}

			if(alphaCurrent != 0){ // make sure alphaCurrent contains value to be compared
				if(alphaPrev != alphaCurrent){
					alphaHasDifferentValueCounter += 1;
			}
			}

			index += 4;
			
			// deciding how much spaces to put between pixels so that all lines will align 
			var spaces = "";
			
			var redLength = String(red).length;
			var greenLength = String(green).length;
			var blueLength = String(blue).length;
			var alphaLength = String(alpha).length;
			
			var TotalLength = redLength + greenLength + blueLength + alphaLength;
			
			// Maximum digits is when red, green, blue, alpha are all 3 digits
			var HowManySpacesToPut = 12 - TotalLength;
			
			var MinimumSpaces = 2;
			
			var NumberOfSpaces = MinimumSpaces + HowManySpacesToPut;
			
			for ( var counter =0; counter <NumberOfSpaces; counter +=1) {
				spaces += "&nbsp;&nbsp;";
				
			}
			
			
			
			// break line after every 150 color sets becuase resolution is 150 pixels in width
			var SpacesOrLineBreak = spaces;			
			if ( i == 596 || ( ( i % 600 ) == 596) ){ // first time i == 596 . then from the second line, divide by 600 produces 596 remainder
				SpacesOrLineBreak = "<br/>";
			}
			
			if (alphaHasDifferentValueCounter != 0) { 
			displayData += "<div id='pixelValue" + i + "' style='display: inline;' >red " + red +" green " + green + " blue " + blue + " alpha " + alpha; + "</div>" + SpacesOrLineBreak;
			} else {
			displayData += "<div id='pixelValue" + i + "' style='display: inline;' >red " + red +  " green " + green + " blue " + blue + "</div>" +  SpacesOrLineBreak;
			}


			
			
			
			} // for loop for displaying pixel values
			

			
			

			//displaying alpha info
			if (alphaHasDifferentValueCounter != 0) { 
			document.getElementById("alphaInfo").innerHTML = "alpha has " + alphaHasDifferentValueCounter + " different values";
			} else {
			document.getElementById("alphaInfo").innerHTML = "alpha has been removed because alpha has " + alphaHasDifferentValueCounter + " different values";
			}
			//display pixel info
			document.getElementById("imagePixelDisplay").innerHTML = displayData;

			// change background color for all pixels
			changeBackgroundColorForAllPixels(imgData);
			
			
			
			
} // ------------------------                     getPixelValues function                       ------------------------




function canvasOriginalMouseMove(mousePositionInOriginalCanvas) {
	// display coordinate info box and message box
	var mouseDiv = document.getElementById("mouseCoordinateDisplay");
	mouseDiv.style.display = "block";
	var messageBox = document.getElementById("divForEnteringPixelCoordinates");
	messageBox.style.display = "block";
	
	var canvasOriginal = document.getElementById("canvasForOriginalimage");
	var mousePos = getMousePos(canvasOriginal, mousePositionInOriginalCanvas);
	mouseDiv.innerHTML = "mouse coordinate info:<br/>";
	mouseDiv.innerHTML += "Positions in respect to window: x = " + mousePositionInOriginalCanvas.clientX + " y = " + mousePositionInOriginalCanvas.clientY + "<br/>";
	mouseDiv.innerHTML += "Positions on the canvas :x = " + mousePos.x + " y = " + mousePos.y;
	
	moveMouseCoordinateDisplayOrNot(mouseDiv, mousePositionInOriginalCanvas);
	
}



function getMousePos(element, evt) {
    var rect = element.getBoundingClientRect();
    return {
        x: Math.floor(evt.clientX - rect.left),
        y: Math.floor(evt.clientY - rect.top)
    };
}



function initClipedCanvasDisplay() {
	var clippedCanvasWidth = document.getElementById("canvasForClippedImage").style.width;
	var aroundCanvasWidth = document.getElementById("aroundCanvas").style.width;
	document.getElementById("aroundCanvas").style.width = window.innerWidth - clippedCanvasWidth;
}


function moveMouseCoordinateDisplayOrNot(mouseCoordinateDisplayObj, mousePositionInCanvas) {
var topLeftCornerOfDisplayBox = mouseCoordinateDisplayObj.getBoundingClientRect();
var differenceInX = mousePositionInCanvas.clientX - topLeftCornerOfDisplayBox.left;
var differenceInY = mousePositionInCanvas.clientY - topLeftCornerOfDisplayBox.top;
	if ( (differenceInX > 350)  || ( differenceInX <= -350) ) {
		var number = getElementLeftPosition(mouseCoordinateDisplayObj);
		var newLeftValue = 0;	
		
		if (differenceInX > 350) {
			newLeftValue = number + 150;
			mouseCoordinateDisplayObj.style.left = newLeftValue + "px";
			} else { // diference is greater than 350, meaning that displayBox is far on the right from the mouse pointer

			newLeftValue = number - 150;
			mouseCoordinateDisplayObj.style.left = newLeftValue + "px";
				
			}
	}
	
		if( (differenceInY > 350)  || ( differenceInY <= -350) ) {
		 var number = getElementTopPosition(mouseCoordinateDisplayObj);

		var newTopValue = 0;
				if (differenceInY > 350) {

					newTopValue = number + 150;
					mouseCoordinateDisplayObj.style.top = newTopValue + "px";
				} else { // diference is greater than -350, meaning that displayBox is far at the bottom from the mouse pointer

					newTopValue = number - 150;
					mouseCoordinateDisplayObj.style.top = newTopValue + "px";
		}
	}
	
}

function canvasOriginalMouseClick(mousePositionInCanvas) {
	var canvasOriginal = document.getElementById("canvasForOriginalimage");
	
	// mousePos contains the current coordinates
	var mousePos = getMousePos(canvasOriginal, mousePositionInCanvas);

	var pStartingPosition = document.getElementById("pForStartingPosition");
	var ConfirmButton = document.getElementById("pixelRangeInfoByClicking");
	var cancelButton = document.getElementById("startOverAgain");
	
	
	// display the clicked starting position information
	if (pStartingPosition.innerHTML == "") {
		pStartingPosition.innerHTML = "you have chosen the following coordinates.<br/>  x = " + mousePos.x + 
			" , y = " + mousePos.y + "<br/> confirm?";
		
		pStartingPosition.style.display = "block";
		ConfirmButton.style.display = "inline-block";
		cancelButton.style.display = "inline-block";
	}
}

function clippedCanvasClick(mousePositionInCanvas) {
	var canvasClipped = document.getElementById("canvasForClippedImage");
	
	// mousePos contains the current coordinates
	var mousePos = getMousePos(canvasClipped, mousePositionInCanvas);
	
	// get the selected pixel value and highlight it
	var pixelValueNumber = convertCurrentCoordinateToPixelValueNumber(mousePos , STARTING_X_ON_CANVAS , STARTING_Y_ON_CANVAS , PIXEL_VALUES_RANGE_WIDTH );
	var pixelValueDivID = "pixelValue" + pixelValueNumber;
	var pixelValueDiv = document.getElementById(pixelValueDivID);
	
	var searchString = pixelValueDiv.innerHTML;
	
	var red = getNumberFromString(searchString, "red", "green");
	var green = getNumberFromString(searchString ,"green", "blue");
	var blue = null ;
	// check if alpha is present in the pixel values
	var alphaPresent = searchString.indexOf("alpha");
	if (alphaPresent != -1 ) {
		blue = getNumberFromString(searchString, "blue", "alpha");
	} else {
		blue = getNumberFromString(searchString, "blue");
	}

	
	pixelValueDiv.style.backgroundColor = "rgb( " + red + ", " + green + ", " + blue + ")";
	pixelValueDiv.scrollIntoView();

	
	
}

function convertCurrentCoordinateToPixelValueNumber(currentXY, startingX, startingY, width) {
	var numberOfRowsFulfilled = currentXY.y - startingY;
	var currentPixelNumber = ( width * numberOfRowsFulfilled ) + 
			( currentXY.x - startingX  + 1);
	var lastImageDataNumber = (currentPixelNumber * 4 ) - 1;
	var pixelValueNumber = lastImageDataNumber - 3;
	return pixelValueNumber;
}



function messageBoxEnter() {
		var messageBox = document.getElementById("divForEnteringPixelCoordinates");
	messageBox.style.display = "block";

}

function coordinateInfoBoxEnter() {
	var coordinateInfoBox = document.getElementById("mouseCoordinateDisplay");
	moveElementToTheRight(coordinateInfoBox, 100);

}




/*
condition to use this function


*/
function getNumberFromString(searchString, immediatelyBeforeNumber, immediatelyAfterNumber) {
	var numberString = null;
	
	var immediatelyBeforeNumberPosition = searchString.indexOf(immediatelyBeforeNumber);

	var immediatelyBeforeNumberLength = immediatelyBeforeNumber.length;
	var endingPosition = searchString.indexOf(immediatelyAfterNumber);
	
	// this function received two parameters or all parameters?
	if ( !immediatelyAfterNumber) {
		numberString = searchString.substring(immediatelyBeforeNumberPosition + immediatelyBeforeNumberLength);
	} else {
		numberString = searchString.substring(immediatelyBeforeNumberPosition + immediatelyBeforeNumberLength, endingPosition);
	}
	var number = Number(numberString.trim() );
	
	return number;
	

}


function moveElementToTheRight(element, right) {
	var currentLeft = getElementLeftPosition(element);
	var newLeftValue = currentLeft + right;
	element.style.left = newLeftValue + "px";
}



function getElementLeftPosition(element) {
		var left = element.style.left ;
		var position = left.indexOf("px");
		var numberString = left.substring(0, position);
		var number = Number( numberString.trim() );
	return number;
}


function getElementTopPosition(element) {
		var top = element.style.top;
		var position = top.indexOf("px");
		var numberString = top.substring(0, position);
		 var number = Number( numberString.trim() );
	return number;
}

function confirmButtonClick() {
	// paragraph contains 2 brackets "<" start from right after the first bracket.
	var pStartingPosition = document.getElementById("pForStartingPosition");
	var paragraphText = pStartingPosition.innerHTML;
	var position = paragraphText.indexOf("<");
	var firstBracketRemoved = paragraphText.substring(position + 1 );
	
	var Xnumber = getNumberFromString(firstBracketRemoved, "x =",  ",");
	var Ynumber = getNumberFromString(firstBracketRemoved, "y =",  "<");
	var xyvaluesArray = { x: Xnumber , y: Ynumber };

	drawImageOnSecondCanvas(xyvaluesArray);
	var canvasOriginal = document.getElementById("canvasForOriginalimage");
	
	// redraw the image on the original canvas and also remove the previous rectangle
		var ctxOriginal = canvasOriginal.getContext("2d");
	var img = new Image();
	img.src = IMAGE_SOURCE;
	ctxOriginal.clearRect( 0, 0, canvasOriginal.width, canvasOriginal.height );
	ctxOriginal.drawImage(img, 0, 0, img.width, img.height, STARTING_X_ON_CANVAS, STARTING_Y_ON_CANVAS, img.width, img.height);
	drawRectangleOnCanvas( canvasOriginal , Xnumber , Ynumber, IMAGE_WIDTH , IMAGE_HEIGHT );

}

function cancelButtonClick() {
	var pStartingPosition = document.getElementById("pForStartingPosition");
	pStartingPosition.innerHTML= "";
	var ConfirmButton = document.getElementById("pixelRangeInfoByClicking");
	var cancelButton = document.getElementById("startOverAgain");
	ConfirmButton.style.display = "none";
	cancelButton.style.display = "none";
}

function drawRectangleOnCanvas(canvas, x, y, width, height) {
	
	var  ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(x - 1, y - 1);
	ctx.lineTo( (x - 1 ) + width + 1, y - 1);
	ctx.lineTo( (x - 1 ) + width + 1, (y - 1 ) + (height + 1) );
	ctx.lineTo(x - 1, (y - 1 ) + (height + 1) );
	ctx.closePath();
	ctx.stroke();

}

function windowScroll() {
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var clippedCanvasContainer = document.getElementById("ClippedCanvasContainer");
	var clippedCanvasWrapper = document.getElementById("wapperForClippedCanvas");
	
	var rect = clippedCanvasContainer.getBoundingClientRect();
	var rectWrapper = clippedCanvasWrapper.getBoundingClientRect();
	
    if (document.body.scrollTop > rect.top + 10) {
        clippedCanvasContainer.style.position = "fixed";
		clippedCanvasContainer.style.top = "10px";
    } else if (  document.body.scrollTop <  rectWrapper.top ) {
        clippedCanvasContainer.style.position = "static";
    }


}


function changeBackgroundColorForAllPixels(imgData) {
			var index = 0;
			var i;

			for ( i=0;i<imgData.data.length;i+=4) { // for loop for displaying pixel values
			red = imgData.data[index];
			green = imgData.data[index +1];
			blue = imgData.data[index + 2];
			alpha = imgData.data[index + 3];
			
						index += 4;
			

	var pixelValueDivID = "pixelValue" + i;
	var pixelValueDiv = document.getElementById(pixelValueDivID);
	
	var searchString = pixelValueDiv.innerHTML;
	
	var red = getNumberFromString(searchString, "red", "green");
	var green = getNumberFromString(searchString ,"green", "blue");
	var blue = null ;
	// check if alpha is present in the pixel values
	var alphaPresent = searchString.indexOf("alpha");
	if (alphaPresent != -1 ) {
		blue = getNumberFromString(searchString, "blue", "alpha");
	} else {
		blue = getNumberFromString(searchString, "blue");
	}

	// check if color is too dar to see the pixel value. If they are too dark, change the pixel value to white so
	// pixel values can be read
	var darknessCheck = red + green + blue;
	
	if ( darknessCheck <= 180 ) {
		pixelValueDiv.style.color = "rgb(0,153,255)";
	}
	
	
	
	pixelValueDiv.style.backgroundColor = "rgb( " + red + ", " + green + ", " + blue + ")";
			
			
			
}

}
