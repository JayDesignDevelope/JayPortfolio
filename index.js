
// Reserch
import { data } from "./data.js";

const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector("#close-btn");

const tre = gsap.timeline({ paused: true, overwrite: "auto" });
tre.to(overlay, {
  duration: 0.5,
  bottom: "6px",
  rotation: 0,
  transformOrigin: "bottom center",
  ease: "power2.out",
});
const items = document.querySelectorAll(".item");
items.forEach((item, index) => {
  item.addEventListener("click", () => {
    tre.play();
    updateOverlay(data[index]);
  });
});

closeBtn.addEventListener("click", () => {
  tre.reverse();
});

function updateOverlay(dataItem) {
  const itemName =
    document.querySelector("#item-category").previousElementSibling;
  const itemCategory = document.querySelector("#item-category");
  const itemLink = document.querySelector("#item-link");
  const itemCopy = document.querySelector("#item-copy");
  const itemImg = document.querySelector("#item-img");

  itemName.textContent = dataItem.itemName;
  itemCategory.textContent = dataItem.itemCategory;
  itemLink.href = dataItem.itemLink;
  itemCopy.textContent = dataItem.itemCopy;
  itemImg.src = dataItem.itemImg;
}

document.addEventListener("click", (e) => {
  if (!overlay.contains(e.target) && !isItem(e.target)) {
    tre.reverse();
  }
});

function isItem(target) {
  return target.closest(".item");
}



//Projects--------------------------------------------------------------------
CustomEase.create("cubic", "0.83, 0, 0.17, 1");
let isAnimating = false;

function splitTextIntoSpans(selector) {
  let elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    let text = element.innerText;
    let splitText = text
      .split("")
      .map(function (char) {
        return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
      })
      .join("");
    element.innerHTML = splitText;
  });
}

function initializeCards() {
  let cards = Array.from(document.querySelectorAll(".card"));
  gsap.to(cards, {
    y: (i) => -15 + 15 * i + "%",
    z: (i) => 15 * i,
    opacity: 1,
    duration: 1,
    ease: "cubic",
    stagger: -0.1,
  });
}




document.addEventListener("DOMContentLoaded", function () {
  splitTextIntoSpans(".copy h1");
  initializeCards();
  gsap.set("h1 span", { y: -200 });
  gsap.set(".slider .card:last-child h1 span", { y: 0 });
});





//•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
let cardIndex =0

document.addEventListener("scroll", function () {
    if (isAnimating) return;
    isAnimating = true;
  
    let slider = document.querySelector(".slider");
    let cards = Array.from(slider.querySelectorAll(".card"));
    let lastCard = cards.pop();
    let nextCard = cards[cards.length - 1];
  
    gsap.to(lastCard.querySelectorAll("h1 span"), {
      y: 200,
      duration: 0.75,
      ease: "cubic",
    });
  
    gsap.to(lastCard, {
      y: "+=150%",
      duration: 0.75,
      ease: "cubic",
      onComplete: () => {
        slider.prepend(lastCard);
        initializeCards();
        gsap.set(lastCard.querySelectorAll("h1 span"), { y: -200 });
  
        setTimeout(() => {
          isAnimating = false;
        }, 1000);
      },
    });
  
    gsap.to(nextCard.querySelectorAll("h1 span"), {
      y: 0,
      duration: 1,
      ease: "cubic",
      stagger: 0.05,
    });
  
    // Define an array of colors to cycle through
    let colors = ["","#B33B08", "#979662", "#B5BFBB"];
    
    // Set background color based on the index of the card
    let procontainer = document.getElementById("procontainer"); // Replace "procontainer" with the ID of your div
    cardIndex =cardIndex+1
    procontainer.style.backgroundColor = colors[cardIndex];
  });
  
  


  /* Sidebar in Hero for nav */
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".wrapper");
    const sidebar = document.querySelector(".herosidebar");
    const cards = gsap.utils.toArray(".herocard");
    const overlayToggle = document.querySelector(".overlay-toggle");

    function animateCardsIn() {
      gsap.to(overlayToggle, {
        right: "-500px",
        duration: 1,
        ease: "power4.out",
      });

      gsap.to(
        cards,
        {
          right: "0%",
          stagger: 0.075,
          duration: 1,
          ease: "power4.out",
        },
        "<"
      );

      gsap.to(
        container,
        {
          filter: "blur(15px)",
          duration: 1,
          immediateRender: false,
        },
        "<"
      );
    }

    function animateCardsOut() {
      gsap.to(overlayToggle, {
        right: "0px",
        duration: 1,
        ease: "power4.out",
      });

      gsap.to(cards, {
        right: "-110%",
        stagger: 0.075,
        duration: 1,
        ease: "power4.out",
      });

      gsap.to(
        container,
        {
          filter: "blur(0px)",
          duration: 1,
          immediateRender: false,
        },
        "<"
      );
    }

    overlayToggle.addEventListener("click", () => {
      sidebar.style.pointerEvents = "all";
      animateCardsIn();
    });

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        sidebar.style.pointerEvents = "none";
        animateCardsOut();
      });
    });
});



// Hero txt


const tlhero = gsap.timeline();

tlhero.from('.left-side div',{
  y:150,
  opacity:0,
  stagger:{
    amount:.4
  },
  delay:.5
})



ScrollTrigger.create({
  animation:tlhero,
  trigger:'.wrapper',
  start:"top top",
  end:"+=600",
  scrub:1,
  pin:true,
  ease:"ease"
})




// Scribble
 // Load external HTML file into the preview container
 window.onload = function() {
    fetch('./about.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('preview-container').innerHTML = data;
      })
      .catch(error => console.error('Error:', error));
  };




// Certificates

gsap.registerPlugin("ScrollTrigger");
gsap.to(".wheel", {
    rotate: () => -360,
    ease: "none",
    duration: images.length,
    scrollTrigger: {
      trigger: ".certificates", // Set the trigger to the div with class "certificates"
      start: "top top", // Adjust start position if needed
      end: "bottom bottom", // Adjust end position if needed
      scrub: 1,
      snap: 1 / images.length,
      invalidateOnRefresh: true,
    },
  });
  
  function setupcert() {
    let certificates = document.querySelector(".certificates");
    let wheel = certificates.querySelector(".wheel");
    let images = gsap.utils.toArray(".wheel__card", {container: certificates}); // Limit image search to the certificates container
    let radius = wheel.offsetWidth / 2;
    let center = wheel.offsetWidth / 2;
    let total = images.length;
    let slice = (2 * Math.PI) / total;
  
    images.forEach((item, i) => {
      let angle = i * slice;
  
      let x = center + radius * Math.sin(angle);
      let y = center - radius * Math.cos(angle);
  
      gsap.set(item, {
        rotation: angle + "_rad",
        xPercent: -50,
        yPercent: -50,
        x: x,
        y: y,
      });
    });
  }
  
  setupcert();
  



  // rediecting to projects
  function redirectToAbout() {
    // Redirect to the about.html page
    window.location.href = "about.html";
  }


  document.querySelector('.card').onclick=function(){
    window.location.href = "/about.html";

  }