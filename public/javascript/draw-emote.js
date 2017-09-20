$("form").submit(function(e){
    e.preventDefault();
});

var Drawing = {
    canvasObject: "",
    canvasArea: "",
    canvasDimensions: {
        height: 0,
        width: 0
    },
    cursorPosition: ["", ""],
    isDown: 0,
    thickness: document.getElementById("size"),
    color: document.getElementById("color"),
    tempArray: {
        color: "",
        opacity: "",
        compositeOperation: ""
    },
    opacity: document.getElementById("opacity"),
    overpaintingIsActive: 0,
    drawingSurfaceImageData: [],
    eraseElement: document.getElementById("eraser"),
    overpaintElement: document.getElementById("paint"),

    setCanvas: function (canvas) {
        //safe the canvas
        this.canvasObject = canvas;
        //automatically set the size of the canvas relative to the window size
        // setTimeout(function(){
        //     Drawing.sizeCanvas()
        // }, 15);
        this.sizeCanvas();
        //safe it's surface area
        this.canvasArea = this.canvasObject.getContext("2d");
        this.canvasDimensions.height = this.canvasArea.canvas.height;
        this.canvasDimensions.width = this.canvasArea.canvas.width;
        this.savePaths();
    },

    checkLocation: function (xy) {
        var isInsideCanvas = true;
        var posX = xy[0];
        var posY = xy[1];
        var canvasHeight = this.canvasDimensions.height;
        var canvasWidth = this.canvasDimensions.width;
        var spaceToBorder = this.canvasObject.getBoundingClientRect();
        if( posX <= spaceToBorder.left ||
            posX >= (spaceToBorder.left + canvasWidth)||
            posY <= spaceToBorder.top ||
            posY >= (spaceToBorder.top + canvasHeight)) {

            isInsideCanvas = false;

        }
        return isInsideCanvas;
    },

    updateCursorPosition: function (event) {
        //get the distances from the canvas to the top left corner
        var boundingClientRect = this.canvasObject.getBoundingClientRect();
        this.cursorPosition[0] = event.pageX - boundingClientRect.left;
        this.cursorPosition[1] = event.pageY - boundingClientRect.top;
    },

    draw: function () {
        var fillColor = this.hexToRgb(this.color.value, Number(this.opacity.value));
        this.canvasArea.beginPath();
        this.canvasArea.fillStyle = fillColor;
        // arc function: arc(posX, posY, radius, angleStartingPoint, angleEndPoint, counterclockwise)
        this.canvasArea.arc(this.cursorPosition[0], this.cursorPosition[1], this.thickness.value, 0, 2 * Math.PI, false);
        this.canvasArea.fill();
    },

    clearCanvas: function () {
        this.savePaths();
        this.tempArray.compositeOperation = this.canvasArea.globalCompositeOperation;
        this.canvasArea.globalCompositeOperation = "destination-out";
        this.canvasArea.beginPath();
        this.canvasArea.rect(0, 0, this.canvasArea.canvas.width, this.canvasArea.canvas.height);
        this.canvasArea.fill();
        this.canvasArea.globalCompositeOperation = this.tempArray.compositeOperation;
    },

    toggleEraser: function () {
        if(this.canvasArea.globalCompositeOperation !== "destination-out"){
            this.tempArray.compositeOperation = this.canvasArea.globalCompositeOperation;
            this.canvasArea.globalCompositeOperation = "destination-out";
            this.eraseElement.classList.add('active-button');
        } else {
            if(this.canvasArea.globalCompositeOperation !== this.tempArray.compositeOperation){
                this.canvasArea.globalCompositeOperation = this.tempArray.compositeOperation;
            } else {
                this.canvasArea.globalCompositeOperation = 'source-over'
            }
            this.eraseElement.classList.remove('active-button');
        }
    },

    paintOver: function () {
        if(this.canvasArea.globalCompositeOperation !== "source-atop"){
            this.tempArray.compositeOperation = this.canvasArea.globalCompositeOperation;
            this.canvasArea.globalCompositeOperation = "source-atop";
            this.overpaintElement.classList.add('active-button');
        } else {
            if(this.canvasArea.globalCompositeOperation !== this.tempArray.compositeOperation){
                this.canvasArea.globalCompositeOperation = this.tempArray.compositeOperation;
            } else {
                this.canvasArea.globalCompositeOperation = 'source-over'
            }
            this.overpaintElement.classList.remove('active-button');
        }
    },

    setIsDown: function (isDown) {
        this.isDown = isDown;
    },

    savePaths: function () {
        var surfaceData = this.canvasArea.getImageData(0, 0, this.canvasArea.canvas.width, this.canvasArea.canvas.height);
        this.drawingSurfaceImageData.push(surfaceData);
    },

    restorePaths: function () {
        var surfaceData = this.drawingSurfaceImageData.pop();
        this.canvasArea.putImageData(surfaceData, 0, 0);
    },

    sizeCanvas: function () {
        var canvasDimensions;
        var wrapperHeight = document.documentElement.clientHeight;
        var wrapperWidth = document.documentElement.clientWidth;
        if(wrapperHeight > wrapperWidth){
            canvasDimensions = wrapperHeight;
        } else {
            canvasDimensions = wrapperWidth;
        }
        // canvas dimensions / 10 * 6 / 2
        canvasDimensions = (canvasDimensions / 100 * 60 / 2);
        this.canvasObject.setAttribute("height", canvasDimensions);
        this.canvasObject.setAttribute("width", canvasDimensions);
    },

    hexToRgb: function (hex, opacity) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var rgba = {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: opacity
        };
        result = "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
        return result;
    }
}

var element = document.getElementById('char');
Drawing.setCanvas(element);

element.addEventListener("mousemove", function(e) {
    Drawing.updateCursorPosition(e);
    if(Drawing.isDown === 1){
        var coordinates = [e.pageX, e.pageY];
        if(Drawing.checkLocation(coordinates)) {
            Drawing.draw();
        }
    }
});

window.addEventListener("mousedown", function(e){
    var coordinates = [e.pageX, e.pageY];
    if(Drawing.checkLocation(coordinates)){
        Drawing.savePaths();
        Drawing.setIsDown(1);
    }
});

window.addEventListener("mouseup", function(e){
    Drawing.setIsDown(0);
});

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        var overlay = document.getElementById('overlay');
        var overlayWrapper = document.getElementById('overlay-wrapper');
        overlay.parentNode.removeChild(overlay);
        overlayWrapper.parentNode.removeChild(overlayWrapper);
    }
});