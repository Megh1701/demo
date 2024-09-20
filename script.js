gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


gsap.set(".canv", { scale: 0.5 });

gsap.to(".canv", {
  scale: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".page-1", 
    start: "bottom 99%", 
    scrub: 2,
    markers: true, 
  }
});


const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");

const frames = {
  currentIndex: 0,
  maxIndex: 570
};

let imagesLoaded = 0;
const images = [];

function preloadImages() {
  for (let i = 1; i <= frames.maxIndex; i++) {
    const imageUrl = `./frames2/frame_${i.toString().padStart(4, "0")}.jpeg`;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === frames.maxIndex) {
        loadImage(frames.currentIndex);
        startAnimation(); 
      }
    };
    images.push(img);
  }
}

function loadImage(index) {
  if (index >= 0 && index <= frames.maxIndex) {
    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scale = Math.max(scaleX, scaleY);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;

    const offsetX = (canvas.width - newWidth) / 2;
    const offsetY = (canvas.height - newHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    frames.currentIndex = index;
  }
}

function startAnimation() {

  gsap.timeline({
    scrollTrigger: {
      trigger: ".parent", 
      start: "top top", 
      end: "+=100%", 
      scrub: 2, 
      markers: true 
    }
  }).to(frames, {
    currentIndex: frames.maxIndex,
    onUpdate: function () {
      loadImage(Math.floor(frames.currentIndex));
    }
  });
}

preloadImages(); 


function splitText(element) {
  const words = element.textContent.split(""); 
  element.innerHTML = ""; 
  words.forEach(word => {
    const span = document.createElement("span");
    span.textContent = `${word}`; 
    span.style.display = "inline-block";
    element.appendChild(span);
  });
}

const header = document.querySelector(".heading");
const para = document.querySelector(".paragraph");

splitText(header);
splitText(para);

gsap.timeline()
  .from(".heading span", {
    y: 100, 
    opacity: 0,
    ease: "Power3.ease", 
    duration: 0.8,
    stagger: 0.04 
  })
  .from(".paragraph span", {
    y: 100,
    opacity: 0,
    ease: "power4.ease",
    duration: 0.5,
    stagger: 0.025
  }, "-=1");


  const throttleFunction = (func, delay) => {
    let prev = 0;
    return (...args) => {
        let now = new Date().getTime();
        if (now - prev > delay) {
            prev = now;
            return func(...args);
        }
    };
};

let currentImageIndex = 1;
let lastMouseX = 0;
let lastMouseY = 0;

const movementThreshold = 50; 

document.querySelector('.page-1').addEventListener("mousemove", throttleFunction((dets) => {
    const distanceX = dets.clientX - lastMouseX;
    const distanceY = dets.clientY - lastMouseY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance > movementThreshold) {
        const div = document.createElement('div');
        div.classList.add('imagediv');
        div.style.left = `${dets.clientX}px`;
        div.style.top = `${dets.clientY}px`;
        div.style.borderRadius = `25px`;

        const img = document.createElement('img');
        img.setAttribute("src", `media/${currentImageIndex}.webp`);
        img.style.transform = 'scale(0)';
        div.appendChild(img);

        document.body.appendChild(div);

        gsap.to(img, {
            scale: 1,
            duration: 0.4,
            ease: "bounce.ease",
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(div, {
                        scale: 0,
                        duration: 0.4,
                        ease: "bounce.ease",
                        onComplete: () => {
                            div.remove();
                        }
                    });
                }, 1500);
            }
        });

        currentImageIndex = (currentImageIndex % 6) + 1; 

        lastMouseX = dets.clientX;
        lastMouseY = dets.clientY;
    }
}, 200));
