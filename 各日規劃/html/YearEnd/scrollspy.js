(function(){
  var localNav = document.querySelector('nav.tabs-local');
  if(!localNav) return;
  var links = Array.prototype.slice.call(localNav.querySelectorAll('a[href^="#"]'));
  if(!links.length) return;

  var targets = links.map(function(a){
    return document.getElementById(a.getAttribute('href').slice(1));
  });

  function offsetTop(){
    var globalNav = document.querySelector('nav.tabs-global');
    return (globalNav ? globalNav.offsetHeight : 0) + localNav.offsetHeight + 4;
  }

  function update(){
    var y = window.scrollY + offsetTop() + 2;
    var activeIndex = 0;
    for(var i = 0; i < targets.length; i++){
      if(targets[i] && targets[i].offsetTop <= y) activeIndex = i;
    }
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2){
      activeIndex = targets.length - 1;
    }
    links.forEach(function(a, i){
      a.classList.toggle('current', i === activeIndex);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function(){
    if(!ticking){
      window.requestAnimationFrame(function(){ update(); ticking = false; });
      ticking = true;
    }
  }, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
