/*
KeySplines.
A tool to interactively explore CSS and SVG Animation KeySplines.
Franz Heidl, 2014.
MIT License.
*/


function keySplines() {
  'use strict';
  
  var segments = 10,
      keySpline = '0.1 0.8 0.9 0.1',
      sx1,
      sy1,
      sx2,
      sy2,
      direction,
      directionVal = 'horizontal',
      horizontal,
      vertical,
      radios,
      duration,
      durationVal = 2,
      ball,
      showIndicator,
      showIndicatorVal = true,
      radius,
      animate,
      animateWidth,
      animateHeight,
      animateAttribute,
      animateBaseVal,
      animateVal,
      animateSVG,
      animateParent,
      spline,
      splineSVG,
      splineWidth,
      splineHeight,
      splineParent,
      handle1,
      line1,
      handle2,
      line2,
      indicator,
      indicatorSVG,
      indicatorAnimate,
      indicatorBallAnimate,
      output,
      outputButton,
      tooltip,
      dragging,
      draggable,
      prevPosX,
      prevPosY,
      labelOrigin,
      labelX,
      labelY;
  
  
  
  function initSplines() {
    duration = document.getElementById('duration');
    if (!duration.value) {
      duration.value = durationVal;
    }
    direction = document.getElementById('direction');
    horizontal = document.getElementById('horizontal');
    vertical = document.getElementById('vertical');
    radios = direction.querySelectorAll('input[type=radio]');
    
    if (!direction.selectedItem) {
      for (var r = 0; r < radios.length; r++) {
        if (radios[r].value === directionVal) {
          radios[r].checked = true;
        }
      }
    }
    
    animate = document.getElementById('animate');
    ball = document.getElementById('ball');
    animateSVG = document.getElementById('animate-svg');
    animateParent = animateSVG.parentNode;
    animateWidth = animateParent.clientWidth;
    animateHeight = animateParent.clientHeight;
    animateSVG.setAttributeNS(null, 'width', animateWidth);
    animateSVG.setAttributeNS(null, 'height', animateHeight);
    animateSVG.setAttributeNS(null, 'viewBox', '0 0 ' + animateWidth + ' ' + animateHeight);
    spline = document.getElementById('spline');
    splineSVG = document.getElementById('spline-svg');
    splineParent = splineSVG.parentNode;
    splineWidth = splineParent.clientWidth;
    splineHeight = splineParent.clientHeight;
    splineSVG.setAttributeNS(null, 'width', splineWidth);
    splineSVG.setAttributeNS(null, 'height', splineHeight);
    splineSVG.setAttributeNS(null, 'viewBox', '0 0 ' + splineWidth + ' ' + splineHeight);
    
    var segLineV, segLineH, posV, posH;
    for (var s = 0; s < (segments - 1); s++) {
      posH = splineWidth / segments * (s + 1);
      segLineV = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      segLineV.setAttributeNS(null, 'stroke', '#f2f2f2');
      segLineV.setAttributeNS(null, 'stroke-width', '1');
      segLineV.setAttributeNS(null, 'x1', posH);
      segLineV.setAttributeNS(null, 'y1', '0');
      segLineV.setAttributeNS(null, 'x2', posH);
      segLineV.setAttributeNS(null, 'y2', splineHeight);
      splineSVG.insertBefore(segLineV, spline);
      posV = splineHeight / segments * (s + 1);
      segLineH = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      segLineH.setAttributeNS(null, 'stroke', '#f2f2f2');
      segLineH.setAttributeNS(null, 'stroke-width', '1');
      segLineH.setAttributeNS(null, 'x1', 0);
      segLineH.setAttributeNS(null, 'y1', posV);
      segLineH.setAttributeNS(null, 'x2', splineWidth);
      segLineH.setAttributeNS(null, 'y2', posV);
      splineSVG.insertBefore(segLineH, spline);
    }
    
    labelOrigin = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelOrigin.setAttributeNS(null, 'x', 5);
    labelOrigin.setAttributeNS(null, 'y', splineHeight - 5);
    labelOrigin.setAttributeNS(null, 'font-size', '13px');
    labelOrigin.setAttributeNS(null, 'fill', '#666');
    labelOrigin.textContent = '0';
    splineSVG.insertBefore(labelOrigin, spline);
    
    labelX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelX.setAttributeNS(null, 'x', 5);
    labelX.setAttributeNS(null, 'y', 15);
    labelX.setAttributeNS(null, 'font-size', '13px');
    labelX.setAttributeNS(null, 'fill', '#666');
    labelX.textContent = '1';
    splineSVG.insertBefore(labelX, spline);
    
    labelY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelY.setAttributeNS(null, 'x', splineWidth - 13);
    labelY.setAttributeNS(null, 'y', splineHeight -5);
    labelY.setAttributeNS(null, 'font-size', '13px');
    labelY.setAttributeNS(null, 'fill', '#666');
    labelY.textContent = '1';
    splineSVG.insertBefore(labelY, spline);
      
    handle1 = document.getElementById('handle1');
    line1 = document.getElementById('line1');
    handle2 = document.getElementById('handle2');
    line2 = document.getElementById('line2');
    indicator = document.getElementById('indicator');
    indicatorBallAnimate = document.getElementById('indicator-ball-animate');
    indicatorSVG = splineSVG;
    indicatorAnimate = document.getElementById('indicator-animate');
    output = document.getElementById('output');
    outputButton = document.getElementById('output-button');
    showIndicator = document.getElementById('show-indicator');
    showIndicator.setAttribute('checked', showIndicatorVal);
    tooltip = document.getElementById('tooltip');
    update();
  }
  
  
  
  function update() {
    // update animation
    durationVal = duration.value;
    radius = ball.getAttribute('r');
    directionVal = direction.querySelector('input:checked').value;
    if (directionVal === 'horizontal') {
      animateBaseVal = animateWidth; // wrong in FF (0)
      ball.setAttributeNS(null, 'cx', radius);
      ball.setAttributeNS(null, 'cy', splineHeight / 2);
      animateAttribute = 'cx';
    }
    else if (directionVal === 'vertical') {
      animateBaseVal = animateHeight; // wrong in FF (0)
      ball.setAttributeNS(null, 'cy', radius);
      ball.setAttributeNS(null, 'cx', splineWidth / 2);
      animateAttribute = 'cy';
    }
    // animateVal = (animateBaseVal - radius) / animateBaseVal * 100;
    animateVal = animateBaseVal - radius;
    animate.setAttributeNS(null, 'attributeName', animateAttribute);
    animate.setAttributeNS(null, 'from', radius);
    animate.setAttributeNS(null, 'to', radius);
    animate.setAttributeNS(null, 'dur', durationVal + 's');
    animate.setAttributeNS(null, 'calcMode', 'spline');
    animate.setAttributeNS(null, 'values', radius + ';' + animateVal + ';' + radius);
    animate.setAttributeNS(null, 'keySplines', keySpline + ';' + keySpline);
    
    // update Spline
    var keySplineArr = keySpline.split(' ');
    sx1 = keySplineArr[0] * splineWidth;
    sy1 = keySplineArr[1] * (splineHeight * -1) + splineHeight;
    sx2 = keySplineArr[2] * splineWidth;
    sy2 = keySplineArr[3] * (splineHeight * -1) + splineHeight;
    spline.setAttributeNS(null, 'd', 'M0,' + splineWidth +  ' C' + sx1 + ',' + sy1 + ' ' + sx2 + ',' + sy2 + ' ' + splineWidth + ',' + 0);
    
    
    // update Handles
    handle1.setAttributeNS(null, 'cx', sx1);
    handle1.setAttributeNS(null, 'cy', sy1);
    line1.setAttributeNS(null, 'x1', 0);
    line1.setAttributeNS(null, 'y1', splineHeight);
    line1.setAttributeNS(null, 'x2', sx1);
    line1.setAttributeNS(null, 'y2', sy1);
    handle2.setAttributeNS(null, 'cx', sx2);
    handle2.setAttributeNS(null, 'cy', sy2);
    line2.setAttributeNS(null, 'x1', splineWidth);
    line2.setAttributeNS(null, 'y1', 0);
    line2.setAttributeNS(null, 'x2', sx2);
    line2.setAttributeNS(null, 'y2', sy2);
  
    
    // Update Indicator
    if (!showIndicator.checked) {
      indicator.setAttribute('style', 'display:none;');
    } else {
      indicator.removeAttribute('style');
    }
    indicator.setAttributeNS(null, 'd', 'M0,0' + ' l0,' + splineHeight);
    indicatorAnimate.setAttributeNS(null, 'from', 'M0,0' + 'L0,' + splineHeight);
    indicatorAnimate.setAttributeNS(null, 'to', 'M' + splineWidth + ',0 ' + 'L' + splineWidth + ',' + splineHeight);
    indicatorAnimate.setAttributeNS(null, 'dur', durationVal / 2 + 's');
    
    // update Output
    output.value = Math.round(keySplineArr[0] * 100) / 100 + ' ' + Math.round(keySplineArr[1] * 100) / 100 + ' ' + Math.round(keySplineArr[2] * 100) / 100 + ' ' + Math.round(keySplineArr[3] * 100) / 100;
                 
    // disable output button again
    outputButton.setAttribute('disabled', 'disabled');
    
  }
  
  
  
  function beginDrag(e) {
    e.preventDefault();
    draggable = e.target;
    dragging = true;
    prevPosX = e.pageX;
    prevPosY = e.pageY;
  }
  
  function doDrag(e) {
    if (dragging) {
      var delta = {
        x: e.pageX - prevPosX,
        y: e.pageY - prevPosY
      };
      var oldPos = {
        x: parseInt(draggable.getAttribute('cx'), 10),
        y: parseInt(draggable.getAttribute('cy'), 10)
      };
      var newPos = {
        x: oldPos.x += delta.x,
        y: oldPos.y += delta.y
      };
          
      if (newPos.x < 0) {
        newPos.x = 0;
      }
      else if (newPos.x > splineWidth) {
        newPos.x = splineWidth;
      }
      if (newPos.y < 0) {
        newPos.y = 0;
      }
      else if (newPos.y > splineHeight) {
        newPos.y = splineHeight;
      }
      
      draggable.setAttributeNS(null, 'cx', newPos.x);
      draggable.setAttributeNS(null, 'cy', newPos.y);
      
      prevPosX = e.pageX;
      prevPosY = e.pageY;
      
      var keySplineArr = keySpline.split(' ');
      if (draggable.getAttribute('id') === 'handle1') {
        keySpline =  newPos.x / splineWidth + ' ' +  (newPos.y - splineHeight) / (splineHeight * -1)   + ' ' + keySplineArr[2] + ' ' + keySplineArr[3];
      }
      else if (draggable.getAttribute('id') === 'handle2') {
        keySpline = keySplineArr[0] + ' ' + keySplineArr[1] + ' ' + newPos.x / splineWidth + ' ' + (newPos.y - splineHeight) / (splineHeight * -1);
      }
      
      showTooltip(draggable);
      
      update();
      
    }
  }
  
  function endDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (draggable) {
      draggable.setAttributeNS(null, 'r', 4);
    }
    dragging = false;
    draggable = undefined;
    hideTooltip();
  }
  
  function showTooltip(target) {
    var tRect = target.getBoundingClientRect();
    var keySplineArr = keySpline.split(' ');
    if (target.getAttribute('id') === 'handle1') {
      tooltip.textContent = 'x: ' + Math.round(keySplineArr[0] * 100) / 100 + ', y: ' + Math.round(keySplineArr[1] * 100) / 100;
    }
    else if (target.getAttribute('id') === 'handle2') {
      tooltip.textContent = 'x: ' + Math.round(keySplineArr[2] * 100) / 100 + ', y: ' + Math.round(keySplineArr[3] * 100) / 100;
    }
    addClass(tooltip, 'active');
    tooltip.setAttribute('style', 'top:' + (tRect.bottom + 10) + 'px;' + 'left:' + (tRect.left - (tooltip.scrollWidth / 2)) + 'px;');
  }
  
  function hideTooltip() {
    tooltip.classList.remove('active');
  }
  
  
  function validKeySpline(s) {
    var arr = s.split(' ');
    var nArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].trim() !== '' && isNumber(arr[i].trim())) {
        nArr.push(parseFloat(arr[i]));
      }
    }
    if (nArr.length === 4) {
      for (var j = 0; j < 4; j++) {
        if(nArr[j] < 0 || nArr[j] > 1) {
          return false;
        }
      }
      return nArr;
    }
    else {
      return false;
    }
  }
  
  
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  
  
  function updateFromOutput() {
    var newKeySpline = validKeySpline(output.value);
    if (newKeySpline) {
      keySpline = newKeySpline.join(' ');
    }
    else {
      // show an error?
    }
    output.blur();
    update();
  }
  
  
  function checkValidInput() {
    if (validKeySpline(output.value)) {
      outputButton.removeAttribute('disabled');
    }
    else {
      outputButton.setAttribute('disabled', 'disabled');
    }
  }
  
  function updateOnEnter(e) {
    if (e.keyCode === 13 && outputButton.getAttribute('disabled') !== 'disabled') {
      updateFromOutput();
    }
  }
  
  function addClass(el, cl) {
    if (el.classList.add) {
      console.log('supports classList');
      el.classList.add(cl);
    }
    else {
      var oldClasses = el.getAttribute('class').split(' ');
      var newClasses = [];
      for (var c = 0; c < oldClasses.length; c++) {
        if (oldClasses[c].trim() !== '') {
          newClasses.push(oldClasses[c]);
        }
      }
      newClasses.push(cl);
      el.setAttribute('class', newClasses.join(' '));
    }
  }
  
  function removeClass(el, cl) {
    if (el.classList.remove) {
      el.classList.remove(cl);
    }
    else {
      var oldClasses = el.getAttribute('class').split(' ');
      var newClasses = [];
      for (var c = 0; c < oldClasses.length; c++) {
        if (oldClasses[c].trim() !== '' && oldClasses[c] !== cl) {
          newClasses.push(oldClasses[c]);
        }
      }
      el.setAttribute('class', newClasses.join(' '));
    }
  }
  
  function hoverHandle(e) {
    e.target.setAttributeNS(null, 'r', 5);
    showTooltip(e.target);
  }
  
  function unhoverHandle(e) {
    if (!dragging) {
      e.target.setAttributeNS(null, 'r', 4);
      hideTooltip();
    }
  }
  
  
  
    initSplines();
    
    var dirRadios = [horizontal, vertical];
    
    duration.addEventListener('input', update, false);
    
    for (var d = 0; d < 2; d++) {
      dirRadios[d].addEventListener('change', update, false);
    }
    
    var handles = [handle1, handle2];
    
    for (var h = 0; h < 2; h++) {
      handles[h].addEventListener('mouseover', hoverHandle, false);
      
      handles[h].addEventListener('mouseout', unhoverHandle, false);
      
      handles[h].addEventListener('mousedown', beginDrag, false);
      
      handles[h].addEventListener('mousemove', doDrag, false);
      
      handles[h].addEventListener('mouseup', endDrag, false);
    }
    
    document.addEventListener('mouseup', endDrag, false);
    
    document.addEventListener('mousemove', doDrag, false);
    
    showIndicator.addEventListener('change', update, false);
    
    output.addEventListener('input', checkValidInput, false);
    
    outputButton.addEventListener('click', updateFromOutput, false);
    
    document.addEventListener('keydown', updateOnEnter, false);
  
}
