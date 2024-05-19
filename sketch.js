var s1=function(sketch){

    let engine;
    let words = [];
    let ground, wallLeft, wallRight;
    let wordsToDisplay = [
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "Tensorflow",
      "NodeJs",
      "Java",
      "Email",
      "AWS",
      "Plotly",
      "SQL",
      "GSAP",
      "Angular",
      "React",
      "Figma",
      "MongoDB",
      "Tableau",
      "Machine Learning",
      "GraphQL",
  
    ];


    class Word {
        constructor(x, y, word) {
          this.body = Matter.Bodies.rectangle(x, y, word.length * 20, 40);
          this.word = word;
          Matter.World.add(engine.world, this.body);
        }
      
        show() {
          let pos = this.body.position;
          let angle = this.body.angle;
      
          sketch.push();
          sketch.translate(pos.x, pos.y);
          sketch.rotate(angle);
          sketch.rectMode(CENTER);
          sketch.fill(255);
          sketch.stroke("#0f0f0f");
          sketch.strokeWeight(3);
          sketch.rect(0, 0, this.word.length * 20 + 60, 80, 50);
          sketch.noStroke();
          sketch.fill("#0f0f0f");
          sketch.textSize(15);
          sketch.textAlign(CENTER, CENTER);
          sketch.text(this.word, 0, 0);
          sketch.pop();
        }
}

    sketch.setup=function(){
        let canvas1=sketch.createCanvas(600,700);
        canvas1.parent("canvas_container")

        engine=Matter.Engine.create();
        ground = Matter.Bodies.rectangle(sketch.width / 2, sketch.height - 20, sketch.width, 10, {
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
            words.push(new Word(sketch.random(width), -200, wordsToDisplay[i]));
        }
    };
    
    sketch.draw = function () {
        //for canvas 1
        sketch.background("#606060");
        Matter.Engine.update(engine);
        for(let word of words){
            word.show();
        }
    };

sketch.mouseMoved=function() {
    for (let word of words) {
        if (
        sketch.dist(sketch.mouseX, sketch.mouseY, word.body.position.x, word.body.position.y) <
        50
        ) {
        Matter.Body.applyForce(
            word.body,
            { x: word.body.position.x, y: word.body.position.y },
            { x: sketch.random(-0.2, 0.2), y: sketch.random(-0.2, 0.2) }
        );
        }
    }
    }



    
}














var s2 = function(sketch) {
    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Body = Matter.Body;
  
    let engine;
    let items = [];
    let lastMouseX = -1;
    let lastMouseY = -1;

  
    sketch.setup = function() {
    //   setupbgcert();

    // const myDiv = getElementById('certcanvas_container');
            // const myCanvas = $('.grid-canvas');
            // myCanvas.width = myDiv.offsetWidth;
            // myCanvas.height = myDiv.offsetHeight;


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

    for (let i = 0; i < 10; i++) {
      let x = sketch.random(100, sketch.width - 100);
      let y = sketch.random(100, sketch.height - 100);
      items.push(new Item(x, y, `./assets/scrible/jpgs/img${i + 1}.jpg`));
      items.push(new Item(x, y, `./assets/scrible/png/img${i + 1}.png`));

    }
    };

    function addBoundariescert() {
        const thickness = 50;
        World.add(engine.world, [
          Bodies.rectangle(sketch.width / 2, -thickness / 2, sketch.width, thickness, {
            isStatic: true,
          }),
          Bodies.rectangle(sketch.width / 2, sketch.height + thickness / 2, sketch.width, thickness, {
            isStatic: true,
          }),
          Bodies.rectangle(-thickness / 2, sketch.height / 2, thickness, sketch.height, {
            isStatic: true,
          }),
          Bodies.rectangle(sketch.width + thickness / 2, sketch.height / 2, thickness, sketch.height, {
            isStatic: true,
          }),
        ]);
      };




  
  draw = function () {
    //for canvas 2
    sketch.background(129);
    Engine.update(engine);
    items.forEach((item)=>item.update());
  };

  class Item {
    constructor(x, y, imagePath) {
      let options = {
        frictionAir: 0.075,
        restitution: 0.25,
        density: 0.002,
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
    
    }

  
    update() {
      this.div.style.left = `${this.body.position.x - 50}px`;
      this.div.style.top = `${this.body.position.y - 100}px`;
      this.div.style.transform = `rotate(${this.body.angle}rad)`;
    }
  };
  

  sketch.mouseMoved = function() {
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
