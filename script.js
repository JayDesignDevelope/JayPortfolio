document.addEventListener("DOMContentLoaded", function() {
  const magneticButton = document.querySelectorAll(".magnetic-button");

  magneticButton.addEventListener("mousemove", function(e) {
      const { clientX, clientY } = e;
      const { height, width, left, top } = magneticButton.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      magneticButton.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  });

  magneticButton.addEventListener("mouseleave", function() {
      magneticButton.style.transform = "translate(0, 0)";
  });
});










function pageTransition() {
  var tl = gsap.timeline();

  tl.to(".transition", {
    duration: 1,
    scaleY: 1,
    transformOrigin: "bottom",
    ease: "power4.inOut",
  });

  tl.to(".transition", {
    duration: 1,
    scaleY: 0,
    transformOrigin: "top",
    ease: "power4.inOut",
    delay: 0.2,
  });
}

function contentAnimation() {
  var tl = gsap.timeline();
  tl.to("h1", {
    top: 0,
    duration: 1,
    ease: "power3.inOut",
    delay: 0.75,
  });
}

function delay(n) {
  n = n || 0;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

barba.init({
  sync: true,
  transitions: [
    {
      async leave(data) {
        const done = this.async();

        pageTransition();
        await delay(1000);
        done();
      },

      async enter(data) {
        contentAnimation();
      },

      async once(data) {
        contentAnimation();
      },
    },
  ],
});



document.addEventListener("DOMContentLoaded", function() {
  const circle = document.querySelector('.circle');
  let timeline = gsap.timeline({ paused: true });
  timeline
    .to(circle, { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" }, "enter")
    .to(circle, { top: "-150%", width: "125%", duration: 0.25 }, "exit");

  function manageMouseEnter() {
    timeline.tweenFromTo('enter', 'exit');
  }

  function manageMouseLeave() {
    setTimeout(() => {
      timeline.play();
    }, 300);
  }
});





