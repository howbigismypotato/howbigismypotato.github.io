




/*
     FILE ARCHIVED ON 8:41:32 Dec 8, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:17:13 May 8, 2014.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
var creditCardWidth = 325;
var potatoWidth = 235;
var potatoHeight = 160;

var mouseDownPositionX;
var mouseDownPositionY;
var oldX;
var oldY;
var isMouseDown = false;
var currentlyDragging;

function drag_onmousedown_calibrate(e) {
    drag_onmousedown(e, "dragme_calibrate");
}

function drag_onmousedown_measure(e) {
    drag_onmousedown(e, "dragme_measure");
}

function drag_onmousedown(e, dragMeElementId) {
    dragMeElement = document.getElementById(dragMeElementId);
    e = getEvent(e, dragMeElement);
    mouseDownPositionX = e.screenX;
    mouseDownPositionY = e.screenY;
    oldX = parseInt(dragMeElement.style.left);
    oldY = parseInt(dragMeElement.style.top);
    isMouseDown = true;
    currentlyDragging = dragMeElementId;
}

function drag_onmouseup(e) {
    isMouseDown = false;
}

function drag_onmousemove(e) {
    if (isMouseDown) {
        if (currentlyDragging == "dragme_calibrate") {
            interpretCalibrationDragGesture(e,
                    document.getElementById("dragme_calibrate"), document.getElementById("ccard"));
        } else if (currentlyDragging == "dragme_measure") {
            interpretMeasurementDragGesture(e,
                    document.getElementById("dragme_measure"), document.getElementById("potato"));
        }
        recalculate();
    }
}

function interpretCalibrationDragGesture(e, dragMeElement, stretchMeElement) {
    e = getEvent(e, dragMeElement);
    newLeft = oldX + e.screenX - mouseDownPositionX;
    dragMeElement.style.left = newLeft;
    dragMeElement.style.top = oldY + e.screenY - mouseDownPositionY;

    creditCardWidth = newLeft - stretchMeElement.offsetLeft
    stretchMeElement.width = creditCardWidth;
}

function interpretMeasurementDragGesture(e, dragMeElement, stretchMeElement) {
    e = getEvent(e, dragMeElement);
    newLeft = oldX + e.screenX - mouseDownPositionX;
    newTop = oldY + e.screenY - mouseDownPositionY;
    dragMeElement.style.left = newLeft;
    dragMeElement.style.top = newTop;

    potatoWidth = newLeft - stretchMeElement.offsetLeft;
    potatoHeight = newTop - stretchMeElement.offsetTop;
    stretchMeElement.width = potatoWidth;
    stretchMeElement.height = potatoHeight;
}

function registerListeners() {
    document.getElementById("dragme_calibrate").onmousedown = drag_onmousedown_calibrate;
    document.getElementById("dragme_measure").onmousedown = drag_onmousedown_measure;
    window.onmouseup = drag_onmouseup;
    window.onmousemove = drag_onmousemove;
}

function getEvent(e, el) {
    if (!e) {
        if (el)
            e = el.document.parentWindow.event;
        else
            e = window.event;
    }
    if (!e.srcElement) {
        var element = e.target;
        while (element != null && element.nodeType != 1)
            element = element.parentNode;
        e.srcElement = element;
    }
    if (typeof e.offsetX == "undefined") {
        e.offsetX = e.layerX;
        e.offsetY = e.layerY;
    }

    return e;
}

// function gratefully reproduced from /web/20131208084132/http://www.quirksmode.org/js/findpos.html
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];
}

function moveDragMeToBottomCornerOfCreditCard() {
    moveDragMeToBottomCornerOfStretchMe(document.getElementById("dragme_calibrate"), document.getElementById("ccard"));
}

function moveDragMeToBottomCornerOfPotato() {
    moveDragMeToBottomCornerOfStretchMe(document.getElementById("dragme_measure"), document.getElementById("potato"));
}

function moveDragMeToBottomCornerOfStretchMe(dragMeElement, stretchMeElement) {
    dragMeElement.style.left = parseInt(stretchMeElement.offsetLeft) + parseInt(stretchMeElement.clientWidth);
    dragMeElement.style.top = parseInt(stretchMeElement.offsetTop) + parseInt(stretchMeElement.clientHeight);
}

function recalculate() {
    var pixelSize = 85.6 / creditCardWidth;
    var potatoWeight = Math.pow(potatoWidth * potatoHeight, 1.5) * Math.pow(pixelSize, 3) * 0.0005;
    var potatoEnergy = potatoWeight * 0.8;
    var cookingTime = potatoWeight;

    updateDisplayField("pixelSizeDisplay", pixelSize.toFixed(3) + "mm");
    updateDisplayField("potatoWeight", potatoWeight.toFixed(0) + "g");
    updateDisplayField("cookingTime", formatCookingTime(cookingTime));
    updateDisplayField("potatoEnergy", potatoEnergy.toFixed(0) + "kCal");
}

function formatCookingTime(cookingTime) {
    var minutePart = Math.floor(cookingTime / 60);
    var secondPart = Math.floor(cookingTime - (minutePart * 60));
    var secondPadding = "";
    if (secondPart < 10) secondPadding = "0";
    return minutePart + ":" + secondPadding + secondPart;
}

function updateDisplayField(elementId, value) {
    var element = document.getElementById(elementId);
    element.removeChild(element.firstChild);
    element.appendChild(document.createTextNode(value));
}

function startMeasuring() {
    switchVisibility("none", "block");
    moveDragMeToBottomCornerOfPotato();
}

function goBackToCalibration() {
    switchVisibility("block", "none");
    moveDragMeToBottomCornerOfCreditCard();
}

function switchVisibility(calibrationVisibility, measurementVisibility) {
    document.getElementById('div_calibrate').style.display = calibrationVisibility;
    document.getElementById('div_measure').style.display = measurementVisibility;
    document.getElementById('tabset_calibrate').style.display = calibrationVisibility;
    document.getElementById('tabset_measure').style.display = measurementVisibility;
    document.getElementById('results_calibrate').style.display = calibrationVisibility;
    document.getElementById('results_measure').style.display = measurementVisibility;
}

function explain(rowElement) {
    metric = rowElement.getElementsByTagName('td')[1].getElementsByTagName('span')[0].id;
    rowElement.className = 'explained';

    if (rowElement.clientHeight > 0) {
        // clientHeight and clientWidth not implemented in all browsers.
        explanation = document.getElementById('explain_' + metric);
        explanation.style.display = 'block';
        metricCoordinates = findPos(rowElement);
        explanation.style.left = metricCoordinates[0] + 10;
        explanation.style.top = metricCoordinates[1] + rowElement.clientHeight;
        explanation.style.width = rowElement.clientWidth - 20;
    }
}

function unexplain(rowElement) {
    metric = rowElement.getElementsByTagName('td')[1].getElementsByTagName('span')[0].id;
    rowElement.className = '';

    document.getElementById('explain_' + metric).style.display = 'none';
}

function debugInformation() {
    alert("creditCardWidth=" + creditCardWidth +
            "\npotatoWidth=" + potatoWidth +
            "\npotatoHeight=" + potatoHeight);
}


