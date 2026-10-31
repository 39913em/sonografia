(function(){
  const overlay=document.getElementById('infoOverlay');
  const frame=document.getElementById('infoFrame');
  const close=document.getElementById('infoWindowClose');
  const tabs=[...document.querySelectorAll('[data-info-tab]')];
  const links=[...document.querySelectorAll('[data-info-page]')];
  if(!overlay||!frame)return;

  const pages={about:'about.html',terms:'terminos.html',privacy:'privacidad.html'};
  let active='about';

  function adaptFrame(){
    try{
      const doc=frame.contentDocument;
      if(!doc)return;
      if(!doc.getElementById('info-modal-frame-overrides')){
        const style=doc.createElement('style');
        style.id='info-modal-frame-overrides';
        style.textContent=`
          html,body{margin:0!important;min-height:0!important;background:#000000!important;color:#fff!important}
          body::before{display:none!important}
          .page-shell{display:block!important;min-height:0!important;padding:0!important;background:#000000!important}
          .page-box{width:100%!important;min-height:100%!important;height:auto!important;border:0!important;box-shadow:none!important;background:#000000!important}
          .page-close{display:none!important}
          .page{width:100%!important;max-width:none!important}
          .section{padding:34px 24px!important}
          .page-body{overflow:visible!important}
          .page-foot{display:none!important}
        `;
        doc.head.appendChild(style);
      }
    }catch(e){console.warn('No fue posible adaptar la página informativa',e)}
  }

  function selectPage(key){
    if(!pages[key])return;
    active=key;
    tabs.forEach(tab=>tab.classList.toggle('active',tab.dataset.infoTab===key));
    if(frame.getAttribute('src')!==pages[key])frame.src=pages[key];
    else adaptFrame();
  }
  function open(key){
    selectPage(key||'about');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    close&&close.focus();
  }
  function shut(){
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  links.forEach(link=>link.addEventListener('click',e=>{
    e.preventDefault();open(link.dataset.infoPage);
  }));
  tabs.forEach(tab=>tab.addEventListener('click',()=>selectPage(tab.dataset.infoTab)));
  frame.addEventListener('load',adaptFrame);
  close&&close.addEventListener('click',shut);
  overlay.addEventListener('click',e=>{if(e.target===overlay)shut()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('is-open'))shut()});
})();
