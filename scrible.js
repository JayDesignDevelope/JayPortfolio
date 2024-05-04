
function setupbg2() {
    var canvas = createCanvas(1000, 1000);
  
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('scrible_container');
  
  }

const Engine2 = Matter.Engine;
const World2= Matter.World;
const Bodies2 = Matter.Bodies;
const Body2 = Matter.Body;

let engine;
let items = [];
let lastMouseX = -1;
let lastMouseY = -1;

function setup2() {
  setupbg2();
  engine2 = Engine2.create();
  engine2.world.gravity.y = 0;

  addBoundaries2();

  for (let i = 0; i < 12; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    items.push(new Item(x, y, `./assets/img${i + 1}.jpg`));
  }
}

function addBoundaries2() {
  const thickness = 50;
  World2.add(engine.world, [
    Bodies2.rectangle(width / 2, -thickness / 2, width, thickness, {
      isStatic: true,
    }),
    Bodies2.rectangle(
      width / 2,
      height + thickness / 2,
      width,
      thickness,
      {
        isStatic: true,
      }
    ),
    Bodies2.rectangle(-thickness / 2, height / 2, thickness, height, {
      isStatic: true,
    }),
    Bodies2.rectangle(
      width + thickness / 2,
      height / 2,
      thickness,
      height,
      {
        isStatic: true,
      }
    ),
  ]);
}

function draw2() {
  background("white");
  Engine.update(engine);
  items.forEach((item) => item.update());
}

class Item2 {
  constructor(x, y, imagePath) {
    let options = {
      frictionAir: 0.075,
      restitution: 0.25,
      density: 0.002,
      angle: Math.random() * Math.PI * 2,
    };

    this.body = Bodies2.rectangle(x, y, 100, 200, options);
    World2.add(engine.world, this.body);

    this.div = document.createElement("div");
    this.div.className = "item";
    this.div.style.left = `${this.body.position.x - 50}px`;
    this.div.style.top = `${this.body.position.y - 100}px`;
    const img = document.createElement("img");
    img.src = imagePath;
    this.div.appendChild(img);
    document.body.appendChild(this.div);
  }

  update2() {
    this.div.style.left = `${this.body.position.x - 50}px`;
    this.div.style.top = `${this.body.position.y - 100}px`;
    this.div.style.transform = `rotate(${this.body.angle}rad)`;
  }
}

function mouseMoved2() {
  if (dist(mouseX, mouseY, lastMouseX, lastMouseY) > 10) {
    lastMouseX = mouseX;
    lastMouseY - mouseY;

    items.forEach((item) => {
      if (
        dist(mouseX, mouseY, item.body.position.x, item.body.position.y) <
        150
      ) {
        let forceMagnitude = 3;
        Body2.applyForce(
          item.body,
          {
            x: item.body.position.x,
            y: item.body.position.y,
          },
          {
            x: random(-forceMagnitude, forceMagnitude),
            y: random(-forceMagnitude, forceMagnitude),
          }
        );
      }
    });
  }
}