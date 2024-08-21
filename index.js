//lenis scroll trigger for text reveal effect

gsap.registerPlugin(ScrollTrigger)

const splitTypes = document.querySelectorAll('.reveal-type')

splitTypes.forEach((char,i) => {

    const bg = char.dataset.bgColor
    const fg = char.dataset.fgColor

    const text = new SplitType(char, { types: 'chars'})

    gsap.from(text.chars, {
            scrollTrigger:{
                trigger:char,
                start:'top 90%',
                end:'end 10%',
                scrub:true,
                markers:false
            },
            opacity:0.2,
            stagger:0.1
        })
})


const lenis = new Lenis()

lenis.on('scroll', (e) => {
console.log(e)
})

function raf(time) {
lenis.raf(time)
requestAnimationFrame(raf)
}

requestAnimationFrame(raf)







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
document.addEventListener("DOMContentLoaded", function () {

  //redirecting links for cards
  // Get the card element by its ID
  const Mlcard = document.getElementById('mlcard');

  // Add a click event listener to the card
  Mlcard.addEventListener('click', function() {
      // Open google.com in a new tab
      window.open('https://machinelearning-model-explorer.netlify.app/', '_blank');
  });
  const algocard = document.getElementById('algocard');
  algocard.addEventListener('click', function() {
      window.open('https://jays-algorithms-visualiser-pyqt.netlify.app/', '_blank');
  });


  const turtlecard = document.getElementById('turtlecard');
  turtlecard.addEventListener('click', function() {
      window.open('https://jayvinayportfolio.netlify.app/html/pages/geometry%20turtle.html', '_blank');
  });
  const inventarycard = document.getElementById('inventarycard');
  inventarycard.addEventListener('click', function() {
      window.open('https://jays-inventory-management-system.netlify.app/', '_blank');
  });

  const linkedin = document.getElementById('linkedin');
  linkedin.addEventListener('click', function() {
      window.open('https://jaygpt.streamlit.app/', '_blank');
  });
  







  splitTextIntoSpans(".copy h1");
  initializeCards();
  gsap.set("h1 span", { y: -200 });
  gsap.set(".slider .card:last-child h1 span", { y: 0 });
});




CustomEase.create("cubic", "0.83, 0, 0.17, 1");
let isAnimating = false;
const colors = ["#dfe1c8", "#476E9E", "#0B9195", "#345A50", "#636C7A","#9D252A"]; // List of 5 colors
let currentIndex = 0;

function splitTextIntoSpans(selector) {
  let elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    let text = element.innerText;
    let splitText = text
      .split("")
      .map((char) => `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`)
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


function changeContainerColor() {
  const container = document.querySelector(".projects");
  container.style.backgroundColor = colors[currentIndex];
}

function goToNextCard() {
  if (isAnimating) return;
  isAnimating = true;

  let slider = document.querySelector(".slider");
  let cards = Array.from(slider.querySelectorAll(".card"));
  let lastCard = cards.pop();
  let nextCard = cards[cards.length - 1];

  currentIndex = (currentIndex + 1) % colors.length;
  changeContainerColor();

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

}

function goToPrevCard() {
  if (isAnimating) return;
  isAnimating = true;

  let slider = document.querySelector(".slider");
  let cards = Array.from(slider.querySelectorAll(".card"));
  let firstCard = cards.shift();
  let prevCard = cards[0];

  currentIndex = (currentIndex + 1) % colors.length;
  changeContainerColor();

  gsap.to(prevCard.querySelectorAll("h1 span"), {
    y: -200,
    duration: 0.75,
    ease: "cubic",
  });

  gsap.to(firstCard, {
    y: "-=150%",
    duration: 0.75,
    ease: "cubic",
    onComplete: () => {
      slider.append(firstCard);
      initializeCards();
      gsap.set(firstCard.querySelectorAll("h1 span"), { y: 200 });

      setTimeout(() => {
        isAnimating = false;
      }, 1000);
    },
  });

  gsap.to(firstCard.querySelectorAll("h1 span"), {
    y: 0,
    duration: 1,
    ease: "cubic",
    stagger: 0.05,
  });
}

// function addCardClickHandler() {
//   document.querySelectorAll(".card").forEach((card) => {
//     card.addEventListener("click", function () {
//       // if (card.querySelector("h1").innerText === "Ethereal Noir") {
//         animateAndRedirect(card);
//       //}
//     });
//   });
// }

// function animateAndRedirect(card) {
//   gsap.to(card, {
//     scale: 1.2,
//     zIndex: 10,
//     y: "-50%",
//     duration: 0.75,
//     ease: "cubic",
//     onComplete: () => {
//       gsap.to(card, {
//         scale: 5,
//         width: "100vw",
//         height: "100vh",
//         duration: 0.75,
//         ease: "cubic",
//         onComplete: () => {
//           window.location.href = "netflix.html";
//         }
//       });
//     }
//   });
// }

document.addEventListener("DOMContentLoaded", function () {
//barcode






//seting logo on top left banner 
function setResponsiveImage() {
  var heroImage = document.getElementById('heroImage');
  if (window.innerWidth <= 768) { // If screen width is less than or equal to 768px
      heroImage.src = 'assets/hero/name_white_phone.png';
  } else { // If screen width is greater than 768px
      heroImage.src = 'assets/hero/name_white.png';
    
  }
}





// Set the image when the page loads
window.onload = setResponsiveImage;

// Update the image when the window is resized
window.onresize = setResponsiveImage;





  splitTextIntoSpans(".copy h1");
  initializeCards();
  gsap.set("h1 span", { y: -200 });
  gsap.set(".slider .card:last-child h1 span", { y: 0 });

  document.querySelector(".link--arrowedright").addEventListener("click", goToNextCard);
  document.querySelector(".link--arrowedleft").addEventListener("click", goToPrevCard);

  addCardClickHandler();

});

// function navigateCards(direction) {
//   isAnimating = true;

//   const slider = document.querySelector(".slider");
//   const cards = Array.from(slider.querySelectorAll(".card"));
//   const lastCard = cards.pop();
//   const nextCard = cards[direction === "next" ? 0 : cards.length - 1];

//   gsap.to(lastCard.querySelectorAll("h1 span"), { y: 200, duration: 0.75, ease: "cubic" });
//   gsap.to(lastCard, {
//     y: direction === "next" ? "+=150%" : "-=150%",
//     duration: 0.75,
//     ease: "cubic",
//     onComplete: () => {
//       if (direction === "next") {
//         slider.prepend(lastCard);
//       } else {
//         slider.appendChild(lastCard);
//       }
//       initializeCards();
//       gsap.set(lastCard.querySelectorAll("h1 span"), { y: -200 });

//       setTimeout(() => isAnimating = false, 1000);
//     },
//   });
//   gsap.to(nextCard.querySelectorAll("h1 span"), { y: 0, duration: 1, ease: "cubic", stagger: 0.05 });

//   const colors = ["", "#B33B08", "#979662", "#B5BFBB"];
//   document.getElementById("procontainer").style.backgroundColor = colors[direction === "next" ? ++cardIndex % colors.length : --cardIndex % colors.length];
// }












function redirectToIndex() {
  // Add smooth transition effect
  document.querySelector('.procontainer').style.transition = 'opacity 0.5s';
  document.querySelector('.procontainer').style.opacity = '0';

  // Redirect after the transition
  setTimeout(function() {
    window.location.href = './index.html';
  }, 500); // 500 milliseconds (0.5s) transition time
}



  /* Sidebar in Hero for nav----------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {

    //loader responsive 
    loadVideo(); // Load the appropriate video source as soon as DOM is ready






    const container = document.querySelector(".wrapper");
    const sidebar = document.querySelector(".herosidebar");
    const cards = gsap.utils.toArray(".herocard");
    const overlayToggle = document.querySelector(".overlay-toggle");


  //button download resume 
  const abutton = document.querySelector(".abutton");
    abutton.addEventListener("click", () =>{
      abutton.classList.add("active");
      setTimeout(()=>{
        abutton.classList.remove("active");
        abutton.querySelector("i").classList.replace("bx-cloud-download", "bx-check-circle")
        abutton.querySelector("span").innerText = "Completed";

        // Create a link element
        const link = document.createElement('a');
        link.href = 'https://drive.google.com/file/d/1IgotWSUlnKzTS6ynXUdubIAvvDbEznRJ/view?usp=sharing'; // Update with the correct path to your PDF
        
        link.target = '_blank'; // Open in a new tab

        link.rel="noopener noreferrer";
link.dispatchEvent(new MouseEvent('click'));
      },2000);
    });


    //typrwriter effect 
    const dynamicText = document.querySelector("h1 span");
    const words = [" Designer", " Engineer", " Developer", " Reseacher"];
    // Variables to track the position and deletion status of the word
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeEffect = () => {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        dynamicText.textContent = currentChar;
        dynamicText.classList.add("<br>")
        dynamicText.classList.add("stop-blinking");
        if (!isDeleting && charIndex < currentWord.length) {
            // If condition is true, type the next character
            charIndex++;
            setTimeout(typeEffect, 200);
        } else if (isDeleting && charIndex > 0) {
            // If condition is true, remove the previous character
            charIndex--;
            setTimeout(typeEffect, 100);
        } else {
            // If word is deleted then switch to the next word
            isDeleting = !isDeleting;
            dynamicText.classList.remove("stop-blinking");
            wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
            setTimeout(typeEffect, 1200);
        }
    }
    typeEffect();










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

});


window.addEventListener('resize', loadVideo); // Optional: Adjust the video on window resize

function loadVideo() {
    const videoElement = document.getElementById('responsive-video');
    // URLs for your videos
    const horizontalVideo = 'assets/hero/horizantal.m4v';
    const verticalVideo = 'assets/hero/vertical.m4v';

    // Set the video source based on screen width
    if (window.innerWidth >= 1024) {
        videoElement.src = horizontalVideo;
    } else {
        videoElement.src = verticalVideo;
    }

    videoElement.play(); // Start playing the video immediately
}


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
  










