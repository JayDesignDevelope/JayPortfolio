var s1 = function (sketch) {

  let engine;
  let words = [];
  let ground, wallLeft, wallRight;
  let wordsToDisplay = [
    { text: "Java" },
    { text: "CSS"},
    { text: "JavaScript" },
    { text: "Python" },
    { text: "Plotly" },
    { text: "SQL"},
    { text: "GSAP" },
    { text: "Angular" },
    { text: "React" },
    { text: "Figma"},
    { text: "MongoDB" },
    { text: "Tableau"},
    { text: "GraphQL" },
    { text: "SpringBoot" },
      // Added new elements
    { text: "Node.js" },
    { text: "Android" },
    { text: "Gen AI" },
    { text: "Security" },
    { text: "Flask" },
    { text: "Django" },
    { text: "Jenkins" },
    { text: "Docker" },
    { text: "Kubernetes" },
    { text: "LLM" },
    { text: "Seaborn" },
    { text: "Linux" },
    { text: "OAuth" },
    { text: "Streamlit" },
    { text: "PyTorch" },
    { text: "System Design" },
    { text: "Design System" },
    { text: "Git" },
    { text: "UI UX Design" },
    { text: "AWS" },
    { text: "Azure" },
    { text: "Google Cloud" },
    { text: "TypeScript" },
    { text: "Machine Learning" },
    { text: "Nest JS" },
    { text: "TensorFlow" }, // Corrected spelling
    { text: "Pandas" },
    { text: "Scikit-learn" }, // Corrected hyphen
  ];

  class Word {
      constructor(x, y, word, url) {
          this.body = Matter.Bodies.rectangle(x, y, word.length * 20, 40);
          this.word = word;
          this.url = url;
          Matter.World.add(engine.world, this.body);
      }

      show() {
        const { x, y } = this.body.position;
        const { angle } = this.body;

        sketch.push();
        sketch.translate(x, y);
        sketch.rotate(angle);
        sketch.rectMode(CENTER);
          sketch.fill(255);
          sketch.stroke("#0f0f0f");
          sketch.strokeWeight(2);
          sketch.rect(0, 0, this.word.length * 10 + 30, 40, 30);
          sketch.noStroke();
          sketch.fill("#0f0f0f");
          sketch.textSize(12);
          sketch.textAlign(CENTER, CENTER);
          sketch.text(this.word, 0, 0);
          sketch.pop();
      }

      contains(x, y) {
          const bounds = this.body.bounds;
          return (x > bounds.min.x && x < bounds.max.x && y > bounds.min.y && y < bounds.max.y);
      }
  }

  let canvasWidth;
  if (window.innerWidth <= 768) {
      // For mobile screens
      canvasWidth = 566;
      canvasHeight= 498;
  } else {
      // For larger screens like laptops and desktops
      canvasWidth = 740;
      canvasHeight = 430;
  }

  sketch.setup = function () {
      let canvas1 = sketch.createCanvas(canvasWidth, canvasHeight);
      canvas1.parent("canvas_container");
      canvas1.elt.style.borderRadius = '6px';

      engine = Matter.Engine.create();
      ground = Matter.Bodies.rectangle(sketch.width / 2, sketch.height - 3, sketch.width, 10, {
          isStatic: true,
      });
      wallLeft = Matter.Bodies.rectangle(0, sketch.height / 2, 10, sketch.height, {
          isStatic: true,
      });
      wallRight = Matter.Bodies.rectangle(sketch.width, sketch.height / 2, 10, sketch.height, {
          isStatic: true,
      });

      Matter.World.add(engine.world, [ground, wallLeft, wallRight]);

      for (let i = 0; i < wordsToDisplay.length; i++) {
          words.push(new Word(sketch.random(sketch.width), -200, wordsToDisplay[i].text, wordsToDisplay[i].url));
      }
  };

  sketch.draw = function () {
      sketch.background("#606060");
      Matter.Engine.update(engine);
      for (let word of words) {
          word.show();
      }
  };

  sketch.mouseMoved = function () {
      for (let word of words) {
          if (sketch.dist(sketch.mouseX, sketch.mouseY, word.body.position.x, word.body.position.y) < 50) {
              Matter.Body.applyForce(
                  word.body,
                  { x: word.body.position.x, y: word.body.position.y },
                  { x: sketch.random(-0.2, 0.2), y: sketch.random(-0.2, 0.2) }
              );
          }
      }
  };

  sketch.mousePressed = function () {
      for (let word of words) {
          if (word.contains(sketch.mouseX, sketch.mouseY)) {
              if (word.url) {
                  window.open(word.url, '_blank');
              }
          }
      }
  };
};











var s2 = function(sketch) {
    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Body = Matter.Body;
  
    let engine;
    let items = [];
    let lastMouseX = -1;
    let lastMouseY = -1;

  
    let straightenMode = false;
    let gridColumns = 4;
    let gridRows = 3;

    let expandedItem = null;
    let straightenButton;

    class Item {
      constructor(x, y, imagePath) {
        let options = {
          frictionAir: 0.0075,
          restitution: 0.025,
          density: 0.02,
          angle: Math.random() * Math.PI * 2,
        };
        this.body = Bodies.rectangle(x, y, 100, 100, options);
        World.add(engine.world, this.body);
        this.div = document.createElement("div");
        this.div.className = "certitem";
        this.div.style.left = `${this.body.position.x - 50}px`;
        this.div.style.top = `${this.body.position.y - 100}px`;
        const img = document.createElement("img");
        img.src = imagePath;
        this.div.appendChild(img);
        const container2 = document.getElementById('certcanvas_container');
        if (container2) {
            container2.appendChild(this.div);
        } else {
            console.error(`Container element with id '${containerId}' not found.`);
        }
      
        this.div.style.transition = 'all 0.5s ease-in-out';

        this.isExpanded = false;
        this.originalWidth = 100;
        this.originalHeight = 100;
        this.expandedWidth = 380;
        this.expandedHeight = 300;

        this.div.addEventListener('click', () => this.toggleExpand());

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'close-btn';
        this.closeButton.innerHTML = '&times;'; // Unicode for times symbol (×)
        this.closeButton.style.display = 'none';
        this.closeButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleExpand();
        });
        this.div.appendChild(this.closeButton);
      }

    
      toggleExpand() {
        if (expandedItem && expandedItem !== this) {
          expandedItem.toggleExpand();
        }

        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
          expandedItem = this;
          this.div.style.zIndex = '1000';
          this.div.style.width = `${this.expandedWidth}px`;
          this.div.style.height = `${this.expandedHeight}px`;
          this.closeButton.style.display = 'block';
          Matter.Body.setStatic(this.body, true);
        } else {
          expandedItem = null;
          this.div.style.zIndex = '1';
          this.div.style.width = `${this.originalWidth}px`;
          this.div.style.height = `${this.originalHeight}px`;
          this.closeButton.style.display = 'none';
          Matter.Body.setStatic(this.body, false);
        }
      }

      update() {
        if (straightenMode) {
          this.div.style.left = `${this.body.position.x - this.originalWidth/2}px`;
          this.div.style.top = `${this.body.position.y - this.originalHeight/2}px`;
          this.div.style.transform = 'rotate(0deg)';
        } else if (!this.isExpanded) {
          this.div.style.left = `${this.body.position.x - this.originalWidth/2}px`;
          this.div.style.top = `${this.body.position.y - this.originalHeight/2}px`;
          this.div.style.transform = `rotate(${this.body.angle}rad)`;
        }
      }
    }

    function arrangeGrid() {
      let itemWidth = sketch.width / gridColumns;
      let itemHeight = sketch.height / gridRows;

      items.forEach((item, index) => {
        let col = index % gridColumns;
        let row = Math.floor(index / gridColumns);
        
        let targetX = col * itemWidth + itemWidth / 2;
        let targetY = row * itemHeight + itemHeight / 2;

        Matter.Body.setPosition(item.body, { x: targetX, y: targetY });
        Matter.Body.setAngle(item.body, 0);
        Matter.Body.setVelocity(item.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(item.body, 0);
      });
    }

    function addBoundariescert() {
        const thickness = 1000;
        World.add(engine.world, [
          Bodies.rectangle(sketch.width / 2, -thickness / 2, sketch.width, thickness, {
            isStatic: true,
          }),
          Bodies.rectangle(sketch.width / 2,-thickness / 2, sketch.width, thickness, {
            isStatic: true,
          }),
          Bodies.rectangle(sketch.width / 2,-thickness / 2, sketch.width, thickness, {
            isStatic: true,
          }),
          Bodies.rectangle(sketch.width / 2,-thickness / 2, sketch.width, thickness,{
            isStatic: true,
          }),
        ]);
      };

    sketch.setup = function() {
      const certContainerCanvas = document.querySelector('.certcontainercanvas');
      
      // Get the bounding rectangle
      const rect = certContainerCanvas.getBoundingClientRect();
      
      // Get the width and height
      const width = rect.width;
      const height = rect.height;
      let canvas2=sketch.createCanvas(width,height);

      canvas2.parent("certcanvas_container")
      engine = Engine.create();
      engine.world.gravity.y = 0;
      addBoundariescert();

      for (let i = 1; i <=11; i++) {
        let x = sketch.random(100, sketch.width - 100);
        let y = sketch.random(100, sketch.height - 100);
        items.push(new Item(x, y, `./assets/scrible/jpgs/img${i}.jpg`));
        items.push(new Item(x, y, `./assets/scrible/png/img${i}.png`));

      }

      straightenButton = document.getElementById('straightenAllBtn');
      
      straightenButton.addEventListener('click', toggleStraighten);
    };

    function toggleStraighten() {
      straightenMode = !straightenMode;
      if (straightenMode) {
        arrangeGrid();
        straightenButton.textContent = "Release Certificates";
      } else {
        releaseItems();
        straightenButton.textContent = "Straighten All Certificates";
      }
    }

    function releaseItems() {
      items.forEach((item) => {
        Matter.Body.setStatic(item.body, false);
        let force = Matter.Vector.create(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05
        );
        Matter.Body.applyForce(item.body, item.body.position, force);
      });
    }

    draw = function () {
      //for canvas 2
      sketch.background(0);
      Engine.update(engine);
      items.forEach((item)=>item.update());

      if (straightenMode) {
        items.forEach((item) => {
          Matter.Body.setVelocity(item.body, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(item.body, 0);
        });
      } else {
        // Prevent overlapping
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            let bodyA = items[i].body;
            let bodyB = items[j].body;
            let distance = Matter.Vector.magnitude(Matter.Vector.sub(bodyA.position, bodyB.position));
            if (distance < 100) {
              let force = Matter.Vector.sub(bodyA.position, bodyB.position);
              Matter.Body.applyForce(bodyA, bodyA.position, Matter.Vector.mult(force, 0.0001));
              Matter.Body.applyForce(bodyB, bodyB.position, Matter.Vector.mult(force, -0.0001));
            }
          }
        }
      }
    };

    sketch.mouseMoved = function() {
      if (!straightenMode) {
        if (sketch.dist(sketch.mouseX, sketch.mouseY, lastMouseX, lastMouseY) > 10) {
          lastMouseX = sketch.mouseX;
          lastMouseY = sketch.mouseY;

          items.forEach((item) => {
            if (sketch.dist(sketch.mouseX, sketch.mouseY, item.body.position.x, item.body.position.y) < 150) {
              let forceMagnitude = 3;
              Body.applyForce(
                item.body,
                {
                  x: item.body.position.x,
                  y: item.body.position.y,
                },
                {
                  x: sketch.random(-forceMagnitude, forceMagnitude),
                  y: sketch.random(-forceMagnitude, forceMagnitude),
                }
              );
            }
          });
        }
      }
    }
};
  // Create a new p5 instance using s5
new p5(s2);
  







// var s2 = function (sketch) {
// sketch.setup = function () {
//     let canvas2 = sketch.createCanvas(500, 600);
//     canvas2.parent("certificates");
// };
// draw = function () {
//     //for canvas 2
//     sketch.background(129);
// };
// };

new p5(s1);

// new p5(s2);

