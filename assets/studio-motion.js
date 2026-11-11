/* GearEx Studio motion: navigation awareness and accessible content reveals. */
'use strict';
(() => {
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const sectionLinks=[...document.querySelectorAll('.topbar nav a[href^="#"]')];
  const sections=sectionLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if(!reduce&&'IntersectionObserver' in window){
    const reveal=[...document.querySelectorAll('.section > .section-heading,.lesson-card,.hero-simulator,.dashboard-tile,.benefits-strip')];
    for(const item of reveal)item.classList.add('reveal-on-scroll');
    document.body.classList.add('motion-ready');
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },{threshold:0.07,rootMargin:'0px 0px 48px 0px'});
    for(const item of reveal)observer.observe(item);
  }
  if('IntersectionObserver' in window){
    const navObserver=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        const active='#'+entry.target.id;
        sectionLinks.forEach(link=>{
          const isCurrent=link.getAttribute('href')===active;
          link.classList.toggle('is-current',isCurrent);
          if(isCurrent)link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      }
    },{rootMargin:'-15% 0px -75% 0px'});
    for(const section of sections)navObserver.observe(section);
  }
  const setThemeMeta=()=>{
    const map={cyberpunk:'#0e151b',quantum:'#08191b',synthwave:'#191526',matrix:'#10191c',hologram:'#1a1424'};
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=map[document.body.dataset.theme]||map.cyberpunk;
  };
  setThemeMeta();
  document.querySelector('#themeSelect')?.addEventListener('change',setThemeMeta);
})();
