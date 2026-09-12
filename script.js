document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("opening");
  const sealButton = document.getElementById("sealButton");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");

  function updateMusicButton(){
    if(!bgMusic || !musicToggle) return;
    const playing = !bgMusic.paused;
    musicToggle.classList.toggle("playing", playing);
    if(musicIcon) musicIcon.textContent = playing ? "♫" : "♪";
    if(musicLabel) musicLabel.textContent = playing ? "संगीत सुरू" : "संगीत बंद";
  }

  function startMusic(){
    if(!bgMusic) return;
    bgMusic.volume = 0.5;
    const p = bgMusic.play();
    if(p && typeof p.then === "function"){
      p.then(updateMusicButton).catch(updateMusicButton);
    }
  }

  function openInvitation(){
    if(!opening || opening.classList.contains("opened")) return;

    window.scrollTo({top:0,left:0,behavior:"auto"});
    opening.classList.add("opened");
    document.body.classList.add("invitation-open");

    // Seal tap is a user gesture, so this is the best time to start audio.
    startMusic();

    setTimeout(() => {
      document.body.classList.remove("locked");
      window.scrollTo({top:0,left:0,behavior:"auto"});
    }, 450);
  }

  sealButton?.addEventListener("click", openInvitation);

  musicToggle?.addEventListener("click", () => {
    if(!bgMusic) return;
    if(bgMusic.paused){
      startMusic();
    }else{
      bgMusic.pause();
      updateMusicButton();
    }
  });

  bgMusic?.addEventListener("play", updateMusicButton);
  bgMusic?.addEventListener("pause", updateMusicButton);

  document.querySelectorAll(".scroll-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelector(button.dataset.target)?.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, {threshold:.18});

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  updateMusicButton();
});
