$("form").submit(function(e){
    e.preventDefault();
});

var Drawing = {
    canvasObject: "",
    eraserIsActive: 0,
    canvasArea: "",
    cursorPosition: ["", ""],
    isDown: 0,
    thickness: document.getElementById("thickness"),
    color: document.getElementById("color"),
    tempColor: "",
    opacity: document.getElementById("opacity"),
    overpaintingIsActive: 0,

    setCanvas: function (canvas) {
        //safe the canvas
        this.canvasObject = canvas;
        //safe it's surface area
        this.canvasArea = this.canvasObject.getContext("2d");
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
        this.canvasArea.beginPath();
        this.canvasArea.rect(0, 0, 300, 300);
        this.canvasArea.fillStyle = "#FFFFFF";
        this.canvasArea.fill();
    },

    toggleEraser: function () {
        if(this.eraserIsActive === 0){
            this.canvasArea.globalCompositeOperation = "destination-out";
            this.eraserIsActive = 1;
        } else {
            this.canvasArea.globalCompositeOperation = "source-over";
            this.eraserIsActive = 0;
        }
    },

    paintOver: function () {
        console.log(this.overpaintingIsActive);
        if(this.overpaintingIsActive === 0){
            this.canvasArea.globalCompositeOperation = "source-atop";
            this.overpaintingIsActive = 1;
        } else {
            this.canvasArea.globalCompositeOperation = "source-over";
            this.overpaintingIsActive = 0;
        }
        console.log(this.canvasArea.globalCompositeOperation);
    },

    setIsDown: function (isDown) {
        this.isDown = isDown;
    },

    hexToRgb: function (hex, opacity) {
    console.log("[" + hex + " / " + opacity + "]");
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
        Drawing.draw();
    }
});

window.addEventListener("mousedown", function(){
    Drawing.setIsDown(1);
});

window.addEventListener("mouseup", function(){
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