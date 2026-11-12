/* GearEx focused-view animation and navigation enhancements. */
'use strict';
(() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const setCardSequence=()=>{
    document.querySelectorAll('main > [data-active] .lesson-grid > .lesson-card').forEach((card,i)=>{
      card.style.setProperty('--card-idx',String(Math.min(i,7)));
    });
  };
  const sync=()=>{
    setCardSequence();
    const heading=document.querySelector('main > [data-active] .section-heading h2');
    if(heading && !reduced?.matches) {
      // A short accent flourish only when switching views; never on each keystroke.
      heading.classList.remove('heading-enter');
      void heading.offsetWidth;
      heading.classList.add('heading-enter');
    }
  };
  window.addEventListener('gearex:viewchange',sync);
  requestAnimationFrame(sync);
  const grids=[...document.querySelectorAll('.lesson-grid')];
  if('MutationObserver' in window){
    const observer=new MutationObserver(()=>setCardSequence());
    grids.forEach(grid=>observer.observe(grid,{childList:true}));
  }
  // Keep Escape available to close the palette even after navigating with the keyboard.
  document.addEventListener('keydown',event=>{
    if(event.key==='Home'&&event.altKey){
      const link=document.querySelector('.topbar nav a[href="#home"]');
      if(link){event.preventDefault();link.click();}
    }
  });
})();