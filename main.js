<<<<<<< HEAD
// mobile nav toggle
(function(){
      const toggle = document.getElementById('navToggle');
      const panel  = document.getElementById('mobilePanel');

      const open  = () => { toggle.setAttribute('aria-expanded','true');  panel.classList.add('open'); };
      const close = () => { toggle.setAttribute('aria-expanded','false'); panel.classList.remove('open'); };

      toggle.addEventListener('click', () => {
        (toggle.getAttribute('aria-expanded') === 'true') ? close() : open();
      });

      // Close on outside click
      document.addEventListener('click', (e)=>{
        if(!panel.contains(e.target) && !toggle.contains(e.target)) close();
      });

      // ESC to close
      document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
    })();


// slider cards
  document.querySelectorAll('.slider-card').forEach(card => {
    const input = card.querySelector('input[type="range"]');
    const valueEl = card.querySelector('.value');
    valueEl.textContent = input.value;
    input.addEventListener('input', () => valueEl.textContent = input.value);
  });


// service page hero section
    (function(){
        const items = document.querySelectorAll('.reveal');
        const io = new IntersectionObserver((entries)=>{
          entries.forEach((entry)=>{
            if(entry.isIntersecting){
              entry.target.classList.add('in-view');
              io.unobserve(entry.target);
            }
          });
        }, { root: null, threshold: 0.12 })
        items.forEach((el, i)=>{
          if(!el.style.getPropertyValue('--delay')){
            el.style.setProperty('--delay', (80 + i*60) + 'ms');
          }
          io.observe(el);
        });
      })();


    


//   HERO SLIDER
 (function(){
    const root = document.currentScript.closest('.hero') || document;
    const slides = Array.from(root.querySelectorAll('.slide'));
    const dots = Array.from(root.querySelectorAll('.slider-dot'));
    const slider = root.querySelector('.slider');


    let index = 0;
    let timer = null;
    const DURATION = 6000; // ms per slide


    function setActive(i){
    slides.forEach((s, n) => {
    const active = n === i;
    s.classList.toggle('is-active', active);
    s.toggleAttribute('hidden', !active);
});

    dots.forEach((d, n) => d.setAttribute('aria-selected', n === i ? 'true' : 'false'));
    index = i;
}


    function nextSlide(){ setActive((index + 1) % slides.length); }


    function startAuto(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAuto();
    timer = setInterval(nextSlide, DURATION);
}
    function stopAuto(){ clearInterval(timer); timer = null; }


    dots.forEach((dot, i) => dot.addEventListener('click', () => { setActive(i); startAuto(); }));


    // Pause on hover/focus inside slider
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);


    // Keyboard arrows for convenience (no on-screen arrows)
    slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive((index + 1) % slides.length); startAuto(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setActive((index - 1 + slides.length) % slides.length); startAuto(); }
});


    // Init
    setActive(0);
    startAuto();
})();



/*=============== TESTIMONIAL SWIPER ===============*/
 (function(){
      const track = document.getElementById('cfTrack');
      const cards = Array.from(track.querySelectorAll('.cf-card'));
      const prev  = document.getElementById('cfPrev');
      const next  = document.getElementById('cfNext');
      const idxEl = document.getElementById('cfIndex');

      let index = 0;
      let auto;

      function setOffsets(){
        // Apply CSS variable --offset based on current index
        cards.forEach((card, i) => {
          const off = i - index; // negative left, positive right
          card.style.setProperty('--offset', off);
          card.classList.toggle('is-center', off === 0);
          card.setAttribute('aria-selected', off === 0 ? 'true' : 'false');
        });
        idxEl.textContent = (index + 1) + ' / ' + cards.length;
      }

      function clamp(n, min, max){ return Math.max(min, Math.min(n, max)); }
      function go(n){ index = clamp(n, 0, cards.length - 1); setOffsets(); resetAuto(); }
      function nextSlide(){ index = (index + 1) % cards.length; setOffsets(); }
      function prevSlide(){ index = (index - 1 + cards.length) % cards.length; setOffsets(); }

      // autoplay (desktop & tablet)
      function startAuto(){ stopAuto(); auto = setInterval(nextSlide, 5000); }
      function stopAuto(){ if(auto) clearInterval(auto); }
      function resetAuto(){ startAuto(); }

      // Controls
      prev.addEventListener('click', () => { prevSlide(); resetAuto(); });
      next.addEventListener('click', () => { nextSlide(); resetAuto(); });

      // Click a card to center
      cards.forEach((c, i) => c.addEventListener('click', () => { go(i); }));

      // Keyboard
      track.tabIndex = 0;
      track.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowLeft'){ e.preventDefault(); prevSlide(); resetAuto(); }
        if(e.key === 'ArrowRight'){ e.preventDefault(); nextSlide(); resetAuto(); }
      });

      // Pause on hover (desktop)
      track.addEventListener('mouseenter', stopAuto);
      track.addEventListener('mouseleave', startAuto);

      // Touch swipe hint (desktop transforms only; mobile uses scroll-snap)
      let startX = 0;
      track.addEventListener('pointerdown', e => { startX = e.clientX; });
      track.addEventListener('pointerup', e => {
        const dx = e.clientX - startX;
        if(Math.abs(dx) > 40){ dx < 0 ? nextSlide() : prevSlide(); resetAuto(); }
      });

      // Init
      setOffsets();
      startAuto();

      // On resize: just reapply offsets so transforms fit new width
      window.addEventListener('resize', setOffsets);
    })();


// (function(){
//   const track = document.getElementById('cfTrack');
//   const cards = Array.from(track.querySelectorAll('.cf-card'));
//   const prev = document.getElementById('cfPrev');
//   const next = document.getElementById('cfNext');
//   const idxEl = document.getElementById('cfIndex');

//   let index = 0; 
//   let autoPlayInterval;

//   function clamp(n, min, max){ return Math.max(min, Math.min(n, max)); }

//  function applyCoverflow(){
//   cards.forEach((card, i) => {
//     const offset = i - index;
//     card.classList.remove('is-center','is-left','is-right','is-left-2','is-right-2');
//     card.setAttribute('aria-selected', offset === 0 ? 'true' : 'false');

//     if(offset === 0) card.classList.add('is-center');
//     else if(offset === -1) card.classList.add('is-left');
//     else if(offset === 1) card.classList.add('is-right');
//     else if(offset <= -2) card.classList.add('is-left-2');
//     else if(offset >= 2) card.classList.add('is-right-2');
//   });

  
//   idxEl.textContent = (index + 1) + ' / ' + cards.length;
// }

//   function go(n){
//     index = clamp(n, 0, cards.length - 1);
//     applyCoverflow();
//     resetAutoPlay();
//   }

//   function nextSlide(){
//     index = (index + 1) % cards.length;
//     applyCoverflow();
//   }

//   function prevSlide(){
//     index = (index - 1 + cards.length) % cards.length;
//     applyCoverflow();
//   }


//   function startAutoPlay(){
//     stopAutoPlay();
//     autoPlayInterval = setInterval(nextSlide, 5000);
//   }
//   function stopAutoPlay(){ clearInterval(autoPlayInterval); }
//   function resetAutoPlay(){ startAutoPlay(); }

 
//   prev.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
//   next.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });


//   track.addEventListener('keydown', (e) => {
//     if(e.key === 'ArrowLeft'){ e.preventDefault(); prevSlide(); resetAutoPlay(); }
//     if(e.key === 'ArrowRight'){ e.preventDefault(); nextSlide(); resetAutoPlay(); }
//   });
//   track.tabIndex = 0;


//   cards.forEach((card, i) => card.addEventListener('click', () => { go(i); }));

 
//   let startX = 0;
//   track.addEventListener('pointerdown', (e)=>{ startX = e.clientX; });
//   track.addEventListener('pointerup', (e)=>{
//     const dx = e.clientX - startX;
//     if(Math.abs(dx) > 40){
//       if(dx < 0) nextSlide(); else prevSlide();
//       resetAutoPlay();
//     }
//   });

 
//   applyCoverflow();
//   startAutoPlay();

 
//   track.addEventListener('mouseenter', stopAutoPlay);
//   track.addEventListener('mouseleave', startAutoPlay);

  

//       setOffsets();
//       startAuto();

     
//       window.addEventListener('resize', setOffsets);

// })();

// COTACT FORM
 (function(){
    const form = document.getElementById('contactForm');
    const msg  = document.getElementById('formMsg');
    const btn  = form.querySelector('.btn');

    function setError(id, text=''){
      const el = form.querySelector(`.err[data-for="${id}"]`);
      if(el) el.textContent = text;
    }

    function validate(){
      let ok = true;
      const required = ['name','email','topic','message','consent'];
      required.forEach(id => setError(id, ''));
      // basic checks
      const email = form.email.value.trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError('email','Enter a valid email.'); ok = false; }
      ['name','topic','message'].forEach(id=>{
        if(!form[id].value.trim()){ setError(id,'This field is required.'); ok = false; }
      });
      if(!form.consent.checked){ setError('consent','Consent is required.'); ok = false; }
      // honeypot
      if(form.company.value) ok = false;
      return ok;
    }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      msg.textContent = '';
      if(!validate()) return;

      btn.classList.add('loading'); btn.disabled = true;

      try{
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            topic: form.topic.value,
            message: form.message.value.trim(),
            consent: !!form.consent.checked
          })
        });
        const data = await res.json();
        if(res.ok){
          form.reset();
          msg.textContent = 'Thanks! Your message has been sent. Check your email for confirmation.';
        }else{
          msg.textContent = data?.error || 'Something went wrong. Please try again or email info@elitebooksolution.com.';
        }
      }catch(err){
        msg.textContent = 'Network error. Please try again later.';
      }finally{
        btn.classList.remove('loading'); btn.disabled = false;
      }
    });
  })();

// BACK TO TOP BUTTON
(function(){
  const btn = document.getElementById('backToTop');
  const fg = btn.querySelector('.ring-fg');
  const R = 16;                      // radius used in the SVG
  const CIRC = 2 * Math.PI * R;      // circle length

  // init ring dash
  fg.style.strokeDasharray = `${CIRC} ${CIRC}`;
  fg.style.strokeDashoffset = CIRC;

  function setProgress(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? scrollTop / docHeight : 0;
    fg.style.strokeDashoffset = CIRC * (1 - p);
  }

  function toggle(){
    if (window.scrollY > 300) { btn.classList.add('show'); }
    else { btn.classList.remove('show'); }
    setProgress();
  }

  window.addEventListener('scroll', toggle, {passive:true});
  window.addEventListener('resize', setProgress);

  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  // Keyboard accessibility
  btn.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
  });

  // first paint
  toggle();
})();


// current year for footer
  document.getElementById("year").textContent = new Date().getFullYear();


  
=======
// mobile nav toggle
(function(){
      const toggle = document.getElementById('navToggle');
      const panel  = document.getElementById('mobilePanel');

      const open  = () => { toggle.setAttribute('aria-expanded','true');  panel.classList.add('open'); };
      const close = () => { toggle.setAttribute('aria-expanded','false'); panel.classList.remove('open'); };

      toggle.addEventListener('click', () => {
        (toggle.getAttribute('aria-expanded') === 'true') ? close() : open();
      });

      // Close on outside click
      document.addEventListener('click', (e)=>{
        if(!panel.contains(e.target) && !toggle.contains(e.target)) close();
      });

      // ESC to close
      document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
    })();


// slider cards
  document.querySelectorAll('.slider-card').forEach(card => {
    const input = card.querySelector('input[type="range"]');
    const valueEl = card.querySelector('.value');
    valueEl.textContent = input.value;
    input.addEventListener('input', () => valueEl.textContent = input.value);
  });


// service page hero section
    (function(){
        const items = document.querySelectorAll('.reveal');
        const io = new IntersectionObserver((entries)=>{
          entries.forEach((entry)=>{
            if(entry.isIntersecting){
              entry.target.classList.add('in-view');
              io.unobserve(entry.target);
            }
          });
        }, { root: null, threshold: 0.12 })
        items.forEach((el, i)=>{
          if(!el.style.getPropertyValue('--delay')){
            el.style.setProperty('--delay', (80 + i*60) + 'ms');
          }
          io.observe(el);
        });
      })();


    


//   HERO SLIDER
 (function(){
    const root = document.currentScript.closest('.hero') || document;
    const slides = Array.from(root.querySelectorAll('.slide'));
    const dots = Array.from(root.querySelectorAll('.slider-dot'));
    const slider = root.querySelector('.slider');


    let index = 0;
    let timer = null;
    const DURATION = 6000; // ms per slide


    function setActive(i){
    slides.forEach((s, n) => {
    const active = n === i;
    s.classList.toggle('is-active', active);
    s.toggleAttribute('hidden', !active);
});

    dots.forEach((d, n) => d.setAttribute('aria-selected', n === i ? 'true' : 'false'));
    index = i;
}


    function nextSlide(){ setActive((index + 1) % slides.length); }


    function startAuto(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAuto();
    timer = setInterval(nextSlide, DURATION);
}
    function stopAuto(){ clearInterval(timer); timer = null; }


    dots.forEach((dot, i) => dot.addEventListener('click', () => { setActive(i); startAuto(); }));


    // Pause on hover/focus inside slider
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);


    // Keyboard arrows for convenience (no on-screen arrows)
    slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive((index + 1) % slides.length); startAuto(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setActive((index - 1 + slides.length) % slides.length); startAuto(); }
});


    // Init
    setActive(0);
    startAuto();
})();



/*=============== TESTIMONIAL SWIPER ===============*/
 (function(){
      const track = document.getElementById('cfTrack');
      const cards = Array.from(track.querySelectorAll('.cf-card'));
      const prev  = document.getElementById('cfPrev');
      const next  = document.getElementById('cfNext');
      const idxEl = document.getElementById('cfIndex');

      let index = 0;
      let auto;

      function setOffsets(){
        // Apply CSS variable --offset based on current index
        cards.forEach((card, i) => {
          const off = i - index; // negative left, positive right
          card.style.setProperty('--offset', off);
          card.classList.toggle('is-center', off === 0);
          card.setAttribute('aria-selected', off === 0 ? 'true' : 'false');
        });
        idxEl.textContent = (index + 1) + ' / ' + cards.length;
      }

      function clamp(n, min, max){ return Math.max(min, Math.min(n, max)); }
      function go(n){ index = clamp(n, 0, cards.length - 1); setOffsets(); resetAuto(); }
      function nextSlide(){ index = (index + 1) % cards.length; setOffsets(); }
      function prevSlide(){ index = (index - 1 + cards.length) % cards.length; setOffsets(); }

      // autoplay (desktop & tablet)
      function startAuto(){ stopAuto(); auto = setInterval(nextSlide, 5000); }
      function stopAuto(){ if(auto) clearInterval(auto); }
      function resetAuto(){ startAuto(); }

      // Controls
      prev.addEventListener('click', () => { prevSlide(); resetAuto(); });
      next.addEventListener('click', () => { nextSlide(); resetAuto(); });

      // Click a card to center
      cards.forEach((c, i) => c.addEventListener('click', () => { go(i); }));

      // Keyboard
      track.tabIndex = 0;
      track.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowLeft'){ e.preventDefault(); prevSlide(); resetAuto(); }
        if(e.key === 'ArrowRight'){ e.preventDefault(); nextSlide(); resetAuto(); }
      });

      // Pause on hover (desktop)
      track.addEventListener('mouseenter', stopAuto);
      track.addEventListener('mouseleave', startAuto);

      // Touch swipe hint (desktop transforms only; mobile uses scroll-snap)
      let startX = 0;
      track.addEventListener('pointerdown', e => { startX = e.clientX; });
      track.addEventListener('pointerup', e => {
        const dx = e.clientX - startX;
        if(Math.abs(dx) > 40){ dx < 0 ? nextSlide() : prevSlide(); resetAuto(); }
      });

      // Init
      setOffsets();
      startAuto();

      // On resize: just reapply offsets so transforms fit new width
      window.addEventListener('resize', setOffsets);
    })();


// (function(){
//   const track = document.getElementById('cfTrack');
//   const cards = Array.from(track.querySelectorAll('.cf-card'));
//   const prev = document.getElementById('cfPrev');
//   const next = document.getElementById('cfNext');
//   const idxEl = document.getElementById('cfIndex');

//   let index = 0; 
//   let autoPlayInterval;

//   function clamp(n, min, max){ return Math.max(min, Math.min(n, max)); }

//  function applyCoverflow(){
//   cards.forEach((card, i) => {
//     const offset = i - index;
//     card.classList.remove('is-center','is-left','is-right','is-left-2','is-right-2');
//     card.setAttribute('aria-selected', offset === 0 ? 'true' : 'false');

//     if(offset === 0) card.classList.add('is-center');
//     else if(offset === -1) card.classList.add('is-left');
//     else if(offset === 1) card.classList.add('is-right');
//     else if(offset <= -2) card.classList.add('is-left-2');
//     else if(offset >= 2) card.classList.add('is-right-2');
//   });

  
//   idxEl.textContent = (index + 1) + ' / ' + cards.length;
// }

//   function go(n){
//     index = clamp(n, 0, cards.length - 1);
//     applyCoverflow();
//     resetAutoPlay();
//   }

//   function nextSlide(){
//     index = (index + 1) % cards.length;
//     applyCoverflow();
//   }

//   function prevSlide(){
//     index = (index - 1 + cards.length) % cards.length;
//     applyCoverflow();
//   }


//   function startAutoPlay(){
//     stopAutoPlay();
//     autoPlayInterval = setInterval(nextSlide, 5000);
//   }
//   function stopAutoPlay(){ clearInterval(autoPlayInterval); }
//   function resetAutoPlay(){ startAutoPlay(); }

 
//   prev.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
//   next.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });


//   track.addEventListener('keydown', (e) => {
//     if(e.key === 'ArrowLeft'){ e.preventDefault(); prevSlide(); resetAutoPlay(); }
//     if(e.key === 'ArrowRight'){ e.preventDefault(); nextSlide(); resetAutoPlay(); }
//   });
//   track.tabIndex = 0;


//   cards.forEach((card, i) => card.addEventListener('click', () => { go(i); }));

 
//   let startX = 0;
//   track.addEventListener('pointerdown', (e)=>{ startX = e.clientX; });
//   track.addEventListener('pointerup', (e)=>{
//     const dx = e.clientX - startX;
//     if(Math.abs(dx) > 40){
//       if(dx < 0) nextSlide(); else prevSlide();
//       resetAutoPlay();
//     }
//   });

 
//   applyCoverflow();
//   startAutoPlay();

 
//   track.addEventListener('mouseenter', stopAutoPlay);
//   track.addEventListener('mouseleave', startAutoPlay);

  

//       setOffsets();
//       startAuto();

     
//       window.addEventListener('resize', setOffsets);

// })();

// COTACT FORM
 (function(){
    const form = document.getElementById('contactForm');
    const msg  = document.getElementById('formMsg');
    const btn  = form.querySelector('.btn');

    function setError(id, text=''){
      const el = form.querySelector(`.err[data-for="${id}"]`);
      if(el) el.textContent = text;
    }

    function validate(){
      let ok = true;
      const required = ['name','email','topic','message','consent'];
      required.forEach(id => setError(id, ''));
      // basic checks
      const email = form.email.value.trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError('email','Enter a valid email.'); ok = false; }
      ['name','topic','message'].forEach(id=>{
        if(!form[id].value.trim()){ setError(id,'This field is required.'); ok = false; }
      });
      if(!form.consent.checked){ setError('consent','Consent is required.'); ok = false; }
      // honeypot
      if(form.company.value) ok = false;
      return ok;
    }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      msg.textContent = '';
      if(!validate()) return;

      btn.classList.add('loading'); btn.disabled = true;

      try{
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            topic: form.topic.value,
            message: form.message.value.trim(),
            consent: !!form.consent.checked
          })
        });
        const data = await res.json();
        if(res.ok){
          form.reset();
          msg.textContent = 'Thanks! Your message has been sent. Check your email for confirmation.';
        }else{
          msg.textContent = data?.error || 'Something went wrong. Please try again or email info@elitebooksolution.com.';
        }
      }catch(err){
        msg.textContent = 'Network error. Please try again later.';
      }finally{
        btn.classList.remove('loading'); btn.disabled = false;
      }
    });
  })();

// BACK TO TOP BUTTON
(function(){
  const btn = document.getElementById('backToTop');
  const fg = btn.querySelector('.ring-fg');
  const R = 16;                      // radius used in the SVG
  const CIRC = 2 * Math.PI * R;      // circle length

  // init ring dash
  fg.style.strokeDasharray = `${CIRC} ${CIRC}`;
  fg.style.strokeDashoffset = CIRC;

  function setProgress(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? scrollTop / docHeight : 0;
    fg.style.strokeDashoffset = CIRC * (1 - p);
  }

  function toggle(){
    if (window.scrollY > 300) { btn.classList.add('show'); }
    else { btn.classList.remove('show'); }
    setProgress();
  }

  window.addEventListener('scroll', toggle, {passive:true});
  window.addEventListener('resize', setProgress);

  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  // Keyboard accessibility
  btn.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
  });

  // first paint
  toggle();
})();


// current year for footer
  document.getElementById("year").textContent = new Date().getFullYear();
>>>>>>> cb6eafd (initial commit)
