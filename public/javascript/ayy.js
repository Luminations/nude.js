//Speicherort für Cursor-Koordinaten
var cursorPosition = ["", ""];
//Canvas Objekt
var canvasObject = document.getElementById("char");
//Canvas Grösse
canvasObject.width = window.innerHeight / 2 - 1;
canvasObject.height = window.innerHeight / 2;
//Zugriff auf die Fläche des Canvas Objekts
var canvasArea = canvasObject.getContext("2d");
//Fensterbreite / -höhe
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
//Stiftdicke
var penThickness = document.getElementById("thickness");
//Abstand des Canvas Objekts zum Rand
var windowidth = windowWidth - window.innerHeight / 2;
var windowheight = window.innerHeight / 2;
//Bool prüft ob Linksklick betägtigt wird
var isDown = 0;
//Zwischenspeicher für Farben
var color;
//Speicher für die Stiftdicke
var thickness = penThickness.value;
//Clear Button
var clear = document.getElementById("clear");
//Radiergummi Button
var eraser = document.getElementById("eraser");
//Radiergummi aktiv / deaktiviert
var eraserActive = 0;
//Zwischenspeicher
var temp;
//Zwischenspeicher für Farben
var trans;
//Zeit
var d = new Date();
var h = d.getHours();
var m = d.getMinutes();
//Pinsel Rund
var circle = document.getElementById("circle");
//Pinsel Eckig
var square = document.getElementById("square");
//Pinselform
var penForm = true;

//Umrechnung Hex-Wert -> rbga-Wert
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: document.getElementById('plz').value / 100
    } : null;
}

//Cursor Position speichern

canvasObject.onmousemove = function(e) {
    var optw = canvasObject.getBoundingClientRect().left;
    var opth = canvasObject.getBoundingClientRect().top;
    cursorPosition[0] = e.pageX - optw;
    cursorPosition[1] = e.pageY - opth;
};

//Färben des Canvas Elements

canvasObject.addEventListener("mousemove", function() {
    if (isDown === 1){
        if (document.getElementById("plz").value === "100"){
            canvasArea.fillStyle = String(color);
            thickness = penThickness.value;
            if (penForm){
                canvasArea.beginPath();
                canvasArea.arc(cursorPosition[0], cursorPosition[1], thickness, 0, 2 * Math.PI, false);
                canvasArea.fill();
            } else {
                canvasArea.fillRect(cursorPosition[0] - thickness / 2, cursorPosition[1] - thickness / 2, thickness, thickness);
            }
            var send = [cursorPosition, thickness, color, penForm];
        }else {
            var rgba = hexToRgb(color);
            trans = "rgba" + "(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
            thickness = penThickness.value;
            canvasArea.fillStyle = trans;
            if (penForm){
                canvasArea.beginPath();
                canvasArea.arc(cursorPosition[0], cursorPosition[1], thickness, 0, 2 * Math.PI, false);
                canvasArea.fill();
            } else {
                canvasArea.fillRect(cursorPosition[0] - thickness / 2, cursorPosition[1] - thickness / 2, thickness, thickness);
            }
            var send = [cursorPosition, thickness, trans, penForm];
        }
        connection.send(send);
    }
});

//Clear funktion

clear.addEventListener("mousedown", function(){
    canvasArea.clearRect(0, 0, windowheight, windowheight);
    connection.send(42);
});

//Farbe nur bei deaktiviertem Radiergummi setzen

window.addEventListener("mousedown", function(){
    if(eraserActive === 1){
        isDown = 1;
    } else {
        color = document.getElementById("color").value;
        isDown = 1;
    }
});

window.addEventListener("mouseup", function(){
    isDown = 0;
});

//Radiergummi aktivieren / deaktivieren

eraser.addEventListener("click", function(){
    if (eraserActive === 0){
        eraser.style.background = "#rgba(72, 71, 71, 0.8)";
        temp = color;
        color = "#ffffff";
        eraserActive = 1;
    } else {
        eraser.style.background = "#rgba(140, 138, 138, 0.64)";
        color = temp;
        eraserActive = 0;
    }
});

//Pinselform Eckig / Rund
circle.addEventListener("click", function(){penForm = true; circle.style.backgroundColor = "rgba(121, 120, 120, 0.8)"; square.style.backgroundColor = "rgba(72, 71, 71, 0.8)";})
square.addEventListener("click", function(){penForm = false; circle.style.backgroundColor = "rgba(72, 71, 71, 0.8)"; square.style.backgroundColor = "rgba(121, 120, 120, 0.8)";})

//Download image
function download() {
    var dt = canvasObject.toDataURL('image/jpg');
    this.href = dt;
}

document.getElementById('download').addEventListener('click', download, false);