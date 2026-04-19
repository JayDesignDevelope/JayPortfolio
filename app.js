// --- API KEY CONFIGURATION ---
// In a full production env without exposing keys to public, you'd route this via an edge function.
// But as per the free $0 strategy, even if exposed on a static site, rate limits protect from charges.
let GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;

// System Prompt for Anti-Hallucination
const SYSTEM_INSTRUCTION = `You are JayGPT, the personalized AI assistant for Jaya Vinay Namgiri. 
Your ONLY purpose is to answer questions based on the following resume and portfolio context. 
DO NOT hallucinate. Do not make up any information outside of this document.

[JAYA VINAY NAMGIRI - CONTEXT START]
Tools: Docker, GIT, PostgreSQL, MySQL, Kubernetes, SQLite
Platforms: AWS, Azure, GCP, IBM Cloud, Linux, Web, Windows, Raspberry, Android
Soft Skills: Leadership, Event Management, Writing, Public Speaking, Time Management

Education:
- Bachelors Degree in Computer Science Engineering at SRM University. Specialization in Machine Learning and Artificial Intelligence (CGPA: 9.1).
- Intermediate at Sarada Junior College (Physics, Chemistry, Mathematics subjects) (GPA: 9.3).

Experience:
1. ServiceNow Software Development (Hyderabad, India) - Software Engineer (Aug 2025 - Present)
- Digital Employee Experience (DEX) & Remediation: Architected automated remedial actions for Windows/macOS.
- Cross-Platform Scripting: Developed check definitions using Ruby.
- Bulk Remote Management: Engineered scalable workflows using Agent Client Collector (ACC).
- ITSM Ecosystem: Developed custom plugins extending platform functionality.

2. Samsung Research and Development (Bengaluru, India) - Senior Software Developer (Sept 2023 - Aug 2025)
- Android UI Design: Designed UIs ensuring seamless experiences.
- Machine Learning Research: Researched ML to improve smartphone security.
- Explored app background anomalies and Generative AI chat services.

3. Samsung R&D - Software Engineer (Aug 2022 - Sept 2023)
- Prepared analytical dashboards on Apache Superset using SQL.
- Developed ML customer churn prediction models using statistical analysis.

Projects:
- Machine Learning Algorithms Visualization Tool Platform (React, Plotly, JS).
- Inventory Management System (PyQt GUI tool).
- Algorithms Visualization Tool (PyQt).
- Smart Mirror (Raspberry Pi, Spotify Sync).
- Sudoku Solver Application (Python, Tkinter).
- Netflix Clone Full Stack Application (React, Node.js, MongoDB).
- Food Delivery Multi-App System (Android, Retrofit, Jetpack Compose).
- LangChain PDF Query System.

Publications/Research:
- Chapter: Introduction to Unsupervised Learning in Bio Informatics (Wiley Publications)
- Paper: Reconstructing Noised Images of Fashion-MNIST Dataset Using Autoencoders (IEEE)
- Paper: Mudras and Yoga Positions Detection and Recognition utilizing YOLOv7 and Faster R-CNN (IEEE 2023)

Certifications:
- Samsung Excellence Award (May 2024)
- Google Cloud Facilitator and Architecting
- Stanford University - Online Machine Learning
- Deep Learning.AI Specialization
- Microsoft Azure AI-900
[CONTEXT END]

CRITICAL RULES:
1. If the user asks for extremely personal information (like exact physical address, exact phone number, salary, private email, or anything not listed above), you MUST reply exactly with this and nothing else:
"This is something personal and you can directly contact Jay at namgirijayvinay@gmail.com or +919492132662."
2. Keep answers concise, polite, and enthusiastically professional, as if you are representing Jay.
3. If an answer cannot be deduced from the context, say "I don't have that information. Please contact Jay directly!"`;

// --- UI Elements ---
const chatbotTrigger = document.getElementById('chatbot-trigger');
const chatbotModal = document.getElementById('chatbot-modal');
const chatbotClose = document.getElementById('chatbot-close');
const chatBody = document.getElementById('chat-body');
const messagesContainer = document.getElementById('messages-container');
const welcomeScreen = document.getElementById('welcome-screen');
const aiVideo = document.getElementById('ai-video');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');

// Configuration is now loaded directly from config.js

// Conversation History to retain context within a single chat session
let conversationHistory = [];

// --- Event Listeners ---
if (chatbotTrigger) {
    chatbotTrigger.addEventListener('click', () => {
        chatbotModal.classList.add('active');
        chatbotTrigger.classList.add('trigger-hidden-by-modal'); // Hide the trigger beautifully
        // Initial tiny pulse on open
        if (aiVideo) { aiVideo.play(); setTimeout(() => aiVideo.pause(), 500); }
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotModal.classList.remove('active');
        chatbotTrigger.classList.remove('trigger-hidden-by-modal'); // Bring the trigger back
    });
}

// --- Scroll Transition Logic (Inline <-> Fixed) ---
const inlineContainer = document.getElementById('inline-chat-container');

if (inlineContainer && chatbotModal && chatbotTrigger) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // We are at the top, show widget inline!
                chatbotTrigger.classList.add('hidden-trigger');
                
                // Move DOM element into the inline container
                inlineContainer.appendChild(chatbotModal);
                
                // Update classes
                chatbotModal.classList.add('inline-mode');
                chatbotModal.classList.remove('fixed-mode');
                chatbotModal.classList.remove('active'); // don't need active when inline
            } else {
                // Scrolled past the widget, show float button!
                chatbotTrigger.classList.remove('hidden-trigger');
                
                // Move DOM element to body for fixed floating
                document.body.appendChild(chatbotModal);
                
                // Update classes (Wait until trigger is clicked to add .active)
                chatbotModal.classList.add('fixed-mode');
                chatbotModal.classList.remove('inline-mode');
                chatbotModal.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the inline visual is visible
    });

    observer.observe(inlineContainer);
}

chatInput.addEventListener('input', () => {
    chatSubmit.disabled = chatInput.value.trim() === '';
});

// ============================================================
// ZERO-COST SEMANTIC CACHING ENGINE
// ============================================================
const localCacheEngine = {
    isShortQuery(query) {
        return query.split(' ').length <= 4;
    },
    rules: [
        {
            topic: 'greeting',
            matches: /^(hi|hello|hey|greetings|morning|afternoon|evening|wassup|yo)$/i,
            answer: (isShort) => isShort ? "Hello! How can I help you?" : "Hello there! I'm JayGPT. How can I assist you in learning more about Jay's background?"
        },
        {
            topic: 'skills_short',
            matches: /^(skills|tech stack|technologies|tools)$/i,
            answer: () => "Core Stack: Docker, Kubernetes, AWS, PostgreSQL, React, Node.js, Ruby, Python. AI/ML specialization."
        },
        {
            topic: 'skills_broad',
            matches: /(skill|technology|stack|language|framework|tools|docker|react|python|machine learning|java|c\+\+)/i,
            answer: (isShort) => isShort 
                ? "He specializes in Docker, Kubernetes, AWS, PostgreSQL, React, Ruby, and AI/ML systems." 
                : "Jay has a robust technical stack. On the infrastructure side, he excels with Docker, Kubernetes, and AWS. For development, he is highly proficient in React, Node.js, Python, and Ruby—with specialized expertise in Machine Learning algorithms."
        },
        {
            topic: 'experience_samsung',
            matches: /(samsung)/i,
            answer: (isShort) => isShort
                ? "Senior Software Developer at Samsung (2022-2025). Built Android UIs & researched ML security."
                : "Jay spent three impactful years at Samsung R&D (2022-2025) starting as a Software Engineer and being promoted to Senior Software Developer. He architected seamless Android UIs, implemented statistical ML models for churn calculation, and researched Machine Learning to augment smartphone security."
        },
        {
            topic: 'experience_servicenow',
            matches: /(servicenow|service now)/i,
            answer: (isShort) => isShort
                ? "Current Software Engineer at ServiceNow building Digital Employee Experience workflows."
                : "Currently, Jay is a Software Engineer at ServiceNow. He architectures automated remedial actions for macOS/Windows, writes cross-platform definitions in Ruby, and builds scalable bulk-remote workflows into the ITSM ecosystem."
        },
        {
            topic: 'experience_broad',
            matches: /(work|experience|job|employment|career|worked|history)/i,
            answer: (isShort) => isShort
                ? "Currently at ServiceNow. Previously Senior Dev at Samsung R&D. Highly experienced in Full Stack & ML."
                : "Jay has an exceptional career trajectory. He is currently scaling Digital Employee Experience workflows as a Software Engineer at ServiceNow. Prior to this, he spent three years at Samsung R&D as a Senior Software Developer, where he designed Android UIs and spearheaded ML smartphone security research."
        },
        {
            topic: 'education_srm',
            matches: /(education|study|degree|university|college|srm|graduated|cgpa|bachelors|b.tech)/i,
            answer: (isShort) => isShort
                ? "B.Tech in CS (Machine Learning & AI) from SRM University. Stellar 9.1 CGPA."
                : "Jay holds a Bachelor's Degree in Computer Science Engineering from SRM University. He specialized rigorously in Machine Learning and Artificial Intelligence, graduating with an outstanding 9.1 CGPA."
        },
        {
            topic: 'contact',
            matches: /(contact|email|phone|reach|number|hire|resume|cv)/i,
            answer: () => "You can reach Jay directly at namgirijayvinay@gmail.com or call him at +91 9492132662. Feel free to connect on LinkedIn too!"
        },
        {
            topic: 'projects',
            matches: /(project|portfolio|built|made|netflix|sudoku|smart mirror)/i,
            answer: (isShort) => isShort
                ? "Key projects include an ML Visualization platform, Netflix clone, Smart Mirror, and Sudoku Solver."
                : "Jay has built an impressive portfolio of projects ranging from a full-stack Netflix clone and a mobile multi-app food delivery system, to complex PyQt Algorithms Visualization tools and hardware integrations like a Spotify-synced Smart Mirror."
        },
        {
            topic: 'research',
            matches: /(publication|research|paper|wiley|ieee|published)/i,
            answer: (isShort) => isShort
                ? "Published research in IEEE (Autoencoders, YOLOv7) and a chapter in Wiley Publications (Unsupervised Learning)."
                : "Jay is an active researcher. He has published a chapter on Unsupervised Learning in Bioinformatics with Wiley, and presented impactful IEEE papers covering Autoencoders for Fashion-MNIST and YOLOv7 models for Mudra gesture detection."
        },
        {
            topic: 'certifications',
            matches: /(certificate|certification|certified|award)/i,
            answer: (isShort) => isShort
                ? "Holds a Samsung Excellence Award, Google Cloud certifications, and AI specs from Stanford and DeepLearning.AI."
                : "He is highly certified, holding a Samsung Excellence Award (2024), a Google Cloud Facilitator status, along with rigorous Machine Learning specializations from Stanford University, DeepLearning.AI, and Microsoft Azure."
        }
    ],
    process(query) {
        const cleanQuery = query.trim();
        if (!cleanQuery) return null;
        const isShort = this.isShortQuery(cleanQuery);
        for (let rule of this.rules) {
            if (rule.matches.test(cleanQuery)) {
                return rule.answer(isShort);
            }
        }
        return null; // Fallback to Gemini API
    }
};

// --- Chat Logic ---
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;
    await submitMessage(userText);
});

// Global function to trigger a chat submission (used by prompt cards)
window.submitMessage = async function(text) {
    if (!text) return;

    // 1. Render User Message
    appendMessage(text, 'user');
    chatInput.value = '';
    chatSubmit.disabled = true;

    // Trigger an initial smooth scroll to get past the welcome dashboard
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: 'smooth'});

    // 2. Add Typing Indicator & Play video to simulate thinking
    const typingId = showTypingIndicator();
    if (aiVideo) {
        aiVideo.play();
    }

    // 3. Update Conversation History Format for Telemetry & API
    conversationHistory.push({"role": "user", "parts": [{"text": text}]});

    // 4. INTERCEPT VIA ZERO-COST LOCAL CACHE
    const cachedResponse = localCacheEngine.process(text);
    if (cachedResponse) {
        // We found a semantic cache hit! Simulate network latency (300-800ms)
        setTimeout(() => {
            document.getElementById(typingId).remove();
            conversationHistory.push({"role": "model", "parts": [{"text": cachedResponse}]});
            appendMessage(cachedResponse, 'bot', true);
        }, Math.random() * 500 + 300);
        return; // EXACTLY ZERO TOKENS BURNED!
    }

    if (!GEMINI_API_KEY) {
        document.getElementById(typingId).remove();
        if (aiVideo) aiVideo.pause();
        appendMessage("Error: API Key is missing. Please set it in the config file.", 'system');
        // Pop the user message so history isn't borked
        conversationHistory.pop();
        return;
    }

    // 5. Fetch Response from API (Cache Missed)
    try {
        const responseText = await fetchGeminiResponse(conversationHistory);
        
        // Remove typing indicator
        document.getElementById(typingId).remove();
        
        // Add Assistant's reply
        conversationHistory.push({"role": "model", "parts": [{"text": responseText}]});
        
        // Render smoothly
        appendMessage(responseText, 'bot', true);

    } catch (error) {
        document.getElementById(typingId).remove();
        if (aiVideo) {
            aiVideo.pause();
        }
        
        if (error.message.includes("429")) {
            appendMessage("JayGPT is currently taking a rest due to high traffic! Please try again later or reach out to Jay directly at namgirijayvinay@gmail.com", 'system');
        } else {
            console.error(error);
            appendMessage(`Connection Error: ${error.message} (Check Console for details)`, 'system');
        }
        // pop the user message so history isn't borked
        conversationHistory.pop();
    }
}

// --- API Calls ---
async function fetchGeminiResponse(history) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // We inject the system instruction natively using the system_instruction field
    const payload = {
        system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: history,
        generationConfig: {
            temperature: 0.1, // Strict, no hallucination
            maxOutputTokens: 500,
        }
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.status === 429) {
        throw new Error("429 Too Many Requests");
    }

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Unknown API Error");
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("No response returned from model.");
    }
}

// --- Dynamic Rendering Effects ---
function appendMessage(text, sender, smoothType = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    msgDiv.appendChild(contentDiv);
    messagesContainer.appendChild(msgDiv);

    if (sender === 'user' || sender === 'system' || !smoothType) {
        // Instant render
        contentDiv.innerHTML = sender === 'user' ? escapeHtml(text) : marked.parse(text);
        scrollToBottom();
    } else {
        // Smooth Typing Effect for Bot
        typeTextSmoothly(contentDiv, text);
    }
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.id = id;
    msgDiv.classList.add('message', 'bot-message');
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        indicator.appendChild(dot);
    }
    
    contentDiv.appendChild(indicator);
    msgDiv.appendChild(contentDiv);
    
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    
    return id;
}

// Custom function to type out text extremely smoothly ensuring Markdown renders correctly
// We first parse markdown, then reveal text nodes progressively.
function typeTextSmoothly(container, markdownText) {
    // We will parse the HTML, inject it hidden, and reveal text nodes one by one
    const htmlString = marked.parse(markdownText);
    container.innerHTML = htmlString;
    container.style.display = 'none'; // hide briefly to setup
    
    // Grab all text nodes
    const textNodes = getTextNodes(container);
    const originalTexts = textNodes.map(node => node.nodeValue);
    
    // Clear them
    textNodes.forEach(node => node.nodeValue = '');
    container.style.display = 'block';

    let nodeIndex = 0;
    let charIndex = 0;

    // We use RequestAnimationFrame for visually amazing smoothness
    function typeNextChar() {
        if (nodeIndex >= textNodes.length) {
            // Highlight code blocks when done
            document.querySelectorAll('pre code').forEach((block) => {
                if(window.hljs) hljs.highlightElement(block);
            });
            
            // PAUSE VIDEO ONLY WHEN DONE TYPING
            if (aiVideo) {
                aiVideo.pause();
            }
            return;
        }

        const node = textNodes[nodeIndex];
        const targetText = originalTexts[nodeIndex];

        if (charIndex < targetText.length) {
            node.nodeValue += targetText.charAt(charIndex);
            charIndex++;
            scrollToBottom();
            
            // Randomize typing speed slightly for realism (10-30ms)
            setTimeout(() => requestAnimationFrame(typeNextChar), Math.random() * 20 + 10);
        } else {
            nodeIndex++;
            charIndex = 0;
            requestAnimationFrame(typeNextChar);
        }
    }
    
    requestAnimationFrame(typeNextChar);
}

// Helper to get all text nodes in an element
function getTextNodes(node) {
    let all = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === 3) all.push(node);
        else all = all.concat(getTextNodes(node));
    }
    return all;
}

function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// --- Dynamic Sample Prompt Carousel ---
const promptPillText = document.getElementById('prompt-pill-text');
const dynamicPromptPill = document.getElementById('dynamic-prompt-pill');

if (promptPillText && dynamicPromptPill && window.gsap) {
    const defaultPrompts = [
        "What are his core technical skills?",
        "Tell me about his experience at Samsung",
        "Where did he study?",
        "What are his soft skills?",
        "Describe his machine learning projects"
    ];
    let promptIndex = 0;

    function cyclePrompts() {
        gsap.to(promptPillText, {
            opacity: 0,
            y: -5,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                promptIndex = (promptIndex + 1) % defaultPrompts.length;
                promptPillText.textContent = defaultPrompts[promptIndex];
                
                // Update onclick handler dynamically
                dynamicPromptPill.onclick = () => submitMessage(defaultPrompts[promptIndex]);
                
                // Prepare for fade-in
                gsap.set(promptPillText, { y: 5 });
                
                gsap.to(promptPillText, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.1
                });
            }
        });
    }

    // Cycle every 4 seconds
    setInterval(cyclePrompts, 4000);
}

// --- Dynamic Dynamic Greeting ---
const greetingText = document.getElementById('greeting-text');
if (greetingText) {
    const hour = new Date().getHours();
    let timeGreeting = "Good evening.";
    
    if (hour >= 5 && hour < 12) {
        timeGreeting = "Good morning.";
    } else if (hour >= 12 && hour < 17) {
        timeGreeting = "Good afternoon.";
    }
    
    greetingText.textContent = timeGreeting;
}

// ============================================================
// ADVANCED VISITOR TELEMETRY & REPORTING SYSTEM
// ============================================================
const visitorTelemetry = {
    startTime: Date.now(),
    clicks: 0,
    touches: 0,
    actionLog: [],
    location: "Fetching...",
    reportSent: false
};

// 1. Invisible IP Location Fetching
fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
        if(data.city && data.country_name) {
            visitorTelemetry.location = `${data.city}, ${data.region}, ${data.country_name} (ISP: ${data.org})`;
        } else {
            visitorTelemetry.location = "Location Data Unavailable";
        }
    })
    .catch(() => visitorTelemetry.location = "Fetch Blocked/Failed");

// 2. Track interactions universally across the app
window.addEventListener('click', (e) => {
    visitorTelemetry.clicks++;
    
    // Check if they clicked a button, link, or project card
    const interactiveEl = e.target.closest('button, a, .bento-card');
    if (interactiveEl) {
        let label = interactiveEl.innerText ? interactiveEl.innerText.substring(0, 30).trim() : interactiveEl.id;
        if (!label) label = "Icon/Unknown Element";
        
        label = label.replace(/\n/g, ' '); // Clean newlines
        
        const secondsIn = Math.floor((Date.now() - visitorTelemetry.startTime) / 1000);
        visitorTelemetry.actionLog.push(`[${secondsIn}s] Clicked: "${label}"`);
    }
});

window.addEventListener('touchstart', () => visitorTelemetry.touches++);

// 3. Dispatch logic triggering once per true session
function dispatchTelemetryReport() {
    if (visitorTelemetry.reportSent) return;

    const timeSpentSecs = Math.floor((Date.now() - visitorTelemetry.startTime) / 1000);
    
    // Determine if visitor is meaningful (spent time, clicked around, or specifically used chat)
    const isMeaningful = timeSpentSecs > 10 || visitorTelemetry.clicks > 2 || conversationHistory.length > 0;
    if (!isMeaningful) return;

    visitorTelemetry.reportSent = true;

    // Build plain text Chat Log
    let chatLogText = "No chat messages were sent during this session.";
    if (conversationHistory && conversationHistory.length > 0) {
        chatLogText = conversationHistory.map(msg => {
            const sender = msg.role === 'model' ? 'JayGPT' : 'User';
            const text = msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0 ? msg.parts[0].text : '';
            return `${sender}: "${text}"`;
        }).join("\n\n");
    }

    // Build timeline log
    let timelineText = "No specific buttons clicked.";
    if (visitorTelemetry.actionLog.length > 0) {
        timelineText = visitorTelemetry.actionLog.join("\n- ");
        timelineText = "- " + timelineText;
    }

    // Build the payload natively as URLSearchParams to BYPASS strict CORS preflight on localhosts
    const formData = new URLSearchParams();
    formData.append('_subject', `New Visitor (${timeSpentSecs}s) | ${conversationHistory.length > 0 ? '💬 Chatted' : '👀 Browsed'}`);
    formData.append('_replyto', 'no-reply@jayvinay.com');
    formData.append('_template', 'box');
    formData.append('Visitor_Location', visitorTelemetry.location);
    formData.append('Engagement_Metrics', `${timeSpentSecs} seconds | ${visitorTelemetry.clicks} Clicks | ${visitorTelemetry.touches} Touches`);
    formData.append('Interaction_Timeline', timelineText);
    formData.append('Chat_Transcript', chatLogText);

    // Fire network beacon payload to FormSubmit securely
    // By passing URLSearchParams we trigger a Simple Request, skipping the CORS OPTIONS block
    fetch("https://formsubmit.co/ajax/jayvinay.ml@gmail.com", {
        method: "POST",
        headers: { 
            'Accept': 'application/json'
        },
        keepalive: true, // Guarantees dispatch even as tab strictly closes
        body: formData
    }).then(res => res.json()).then(data => console.log("Telemetry dispatched strictly:", data))
      .catch(e => console.error("Telemetry engine offline.", e));

    // ==========================================
    // OPTION B: CUSTOM NODE.JS SERVER TRIGGER
    // Sends structured JSON directly to the backend to trigger FCM Push Notification
    // ==========================================
    fetch("http://localhost:3000/api/notify", { // Will be updated to production URL when deployed
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        keepalive: true,
        body: JSON.stringify({
            location: visitorTelemetry.location,
            timeSpent: timeSpentSecs,
            clicks: visitorTelemetry.clicks,
            touches: visitorTelemetry.touches,
            timeline: visitorTelemetry.actionLog,
            chatTranscript: conversationHistory.map(msg => ({
                sender: msg.role === 'model' ? 'JayGPT' : 'User',
                text: msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0 ? msg.parts[0].text : ''
            }))
        })
    }).catch(e => console.log("Node server pending deployment."));
}

// Trigger automatically and reliably when user switches tabs or closes the app
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        dispatchTelemetryReport();
    }
});

// Fallback for reload/classic browser exits
window.addEventListener('beforeunload', () => {
    dispatchTelemetryReport();
});

// DEBUG HELPER: Run window.forceTestEmail() in your browser console to test instantly!
window.forceTestEmail = function() {
    console.log("Forcing Telemetry Dispatch. Bypassing timer checks...");
    visitorTelemetry.reportSent = false; // Reset block
    visitorTelemetry.clicks = Math.max(visitorTelemetry.clicks, 5); // Fake meaningful
    visitorTelemetry.startTime = Date.now() - 20000; // Fake 20 seconds passed
    dispatchTelemetryReport();
    console.log("Dispatch fired! Check your Network tab to see the FormSubmit POST status.");
};
