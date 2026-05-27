document.querySelectorAll('.nav-toggle').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var links = btn.closest('.nav-inner').querySelector('.nav-links');
    if (links) links.classList.toggle('open');
  });
});
