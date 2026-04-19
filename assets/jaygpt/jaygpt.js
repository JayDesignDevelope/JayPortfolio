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
"This is something personal and you can directly contact Jai at contact@jayvinay.in or +1-234-567-890."
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
        // Initial tiny pulse on open
        if (aiVideo) { aiVideo.play(); setTimeout(() => aiVideo.pause(), 500); }
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotModal.classList.remove('active');
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

    if (!GEMINI_API_KEY) {
        appendMessage("Error: API Key is missing. Please set it in the config file.", 'system');
        return;
    }

    // 2. Add Typing Indicator & Play video to simulate thinking
    const typingId = showTypingIndicator();
    if (aiVideo) {
        aiVideo.play();
    }

    // 3. Update Conversation History Format for Gemini API
    conversationHistory.push({"role": "user", "parts": [{"text": text}]});

    // 4. Fetch Response from API
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
            appendMessage("JayGPT is currently taking a rest due to high traffic! Please try again later or reach out to Jay directly at contact@jayvinay.in.", 'system');
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
