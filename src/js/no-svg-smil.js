document.addEventListener("DOMContentLoaded", function() {
  var closes = document.getElementsByName('close');
  
  for (var c = 0; c < closes.length; c++) {
    closes[c].addEventListener('click', closeOverlay, false);
  }
  
  function closeOverlay(e) {
    e.preventDefault();
    var overlay = document.getElementById('overlay');
    overlay.parentNode.removeChild(overlay);
  }

}, false);
