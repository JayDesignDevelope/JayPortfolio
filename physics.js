document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("physics-container");
    if (!container) return; // Exit if not on the right page

    // Module aliases
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Events = Matter.Events,
          Body = Matter.Body,
          Vector = Matter.Vector;

    // Create an engine
    const engine = Engine.create();
    
    // Disable gravity for a floaty feel, or keep a very light gravity.
    // Let's use zero gravity to start, simulating space where they float and bounce.
    engine.world.gravity.y = 0.2; // Slight gravity

    let width = container.clientWidth;
    let height = container.clientHeight;

    const wordsToDisplay = [
        "Java", "CSS", "JavaScript", "Python", "Plotly", "SQL", "GSAP", 
        "Angular", "React", "Figma", "MongoDB", "Tableau", "GraphQL", 
        "SpringBoot", "Node.js", "Android", "Gen AI", "Security", "Flask", 
        "Django", "Jenkins", "Docker", "Kubernetes", "LLM", "Seaborn", 
        "Linux", "OAuth", "Streamlit", "PyTorch", "System Design", 
        "Design System", "Git", "UI UX Design", "AWS", "Azure", 
        "Google Cloud", "TypeScript", "Machine Learning", "Nest JS", 
        "TensorFlow", "Pandas", "Scikit-learn"
    ];

    let items = [];
    let boundaries = [];

    function createBoundaries() {
        // Remove old boundaries
        if (boundaries.length > 0) {
            Composite.remove(engine.world, boundaries);
        }
        
        const thickness = 60;
        // top, bottom, right, left
        boundaries = [
            Bodies.rectangle(width / 2, -thickness / 2, width * 2, thickness, { isStatic: true }),
            Bodies.rectangle(width / 2, height + thickness / 2, width * 2, thickness, { isStatic: true }),
            Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, { isStatic: true }),
            Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, { isStatic: true })
        ];
        Composite.add(engine.world, boundaries);
    }

    createBoundaries();

    // Create the DOM elements and the physics bodies
    wordsToDisplay.forEach((word) => {
        // 1. Create DOM element
        const el = document.createElement("div");
        el.className = "skill-pill";
        el.innerText = word;
        container.appendChild(el);

        // 2. Measure DOM element
        // We render it quickly to get dimensions
        const rect = el.getBoundingClientRect();
        const elWidth = rect.width;
        const elHeight = rect.height || 40; // fallback

        // 3. Create physics body
        const x = Math.random() * (width - 100) + 50;
        const y = Math.random() * (height - 100) + 50;
        
        // Chamfer allows rounded corners in physics (optional, but nice for rolling)
        const body = Bodies.rectangle(x, y, elWidth, elHeight, {
            chamfer: { radius: elHeight / 2 },
            restitution: 0.9, // highly bouncy
            frictionAir: 0.05,
            density: 0.04
        });

        Composite.add(engine.world, body);

        // Attach DOM element and dimensions to body for the sync loop
        items.push({
            body: body,
            el: el,
            width: elWidth,
            height: elHeight
        });
    });

    // Run the engine
    Runner.run(Runner.create(), engine);

    // Sync loop: Update DOM positions based on Physics Engine
    Events.on(engine, "afterUpdate", () => {
        items.forEach(item => {
            const pos = item.body.position;
            const angle = item.body.angle;
            
            // CSS Translate is relative to top-left. We subtract half width/height to center it on the physics body coordinates.
            const x = pos.x - item.width / 2;
            const y = pos.y - item.height / 2;
            
            item.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad)`;
        });
    });

    // --- Interactive Mouse Physics (The "Fly Away" effect) ---
    let lastMousePosition = { x: null, y: null };

    container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        // Apply force to items close to the cursor
        items.forEach(item => {
            const bodyPos = item.body.position;
            const dx = bodyPos.x - cursorX;
            const dy = bodyPos.y - cursorY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // If mouse is within 100px of the pill
            if (dist < 100) {
                // Determine direction vector
                const forceMagnitude = 0.05 * item.body.mass; // Scale force by mass
                const fx = (dx / dist) * forceMagnitude; 
                const fy = (dy / dist) * forceMagnitude;

                Body.applyForce(item.body, bodyPos, { x: fx, y: fy });
            }
        });
    });

    // Fallback: Optional click to push away strongly
    container.addEventListener("click", (e) => {
        const rect = container.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        items.forEach(item => {
            const bodyPos = item.body.position;
            const dx = bodyPos.x - cursorX;
            const dy = bodyPos.y - cursorY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const forceMagnitude = 0.2 * item.body.mass;
                const fx = (dx / dist) * forceMagnitude; 
                const fy = (dy / dist) * forceMagnitude;
                Body.applyForce(item.body, bodyPos, { x: fx, y: fy });
            }
        });
    });

    // Make it mobile responsive (resize event)
    window.addEventListener("resize", () => {
        width = container.clientWidth;
        height = container.clientHeight;
        createBoundaries();
    });

    // Add drag and drop functionality (Mouse Constraint)
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with scrolling
    Events.on(mouseConstraint, "mousemove", () => {
        // Required for DOM tracking offsets when scrolling
        mouse.offset = { x: 0, y: 0 }; 
    });
});
