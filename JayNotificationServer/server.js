require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');

const app = express();
// Default to Render's dynamic port, or use 3000 locally
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// ----------------------------------------------------
// FIREBASE ADMIN INITIALIZATION (RENDER COMPATIBLE)
// ----------------------------------------------------
try {
    // 1. Production Strategy: Read from Render Environment Variables like a normal API key
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        
        // Render sometimes escapes line breaks, we must strictly parse the Private Key
        const formattedPrivateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: formattedPrivateKey
            })
        });
        console.log("🔥 Firebase Admin SDK initialized via Render Environment Variables.");

    // 2. Localhost Strategy: Fallback to the ignored JSON file
    } else {
        const serviceAccountPath = './serviceAccountKey.json';
        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = require(serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("🔥 Firebase Admin SDK initialized via local JSON file fallback.");
        } else {
            console.error("⚠️ WARNING: Firebase Admin failed to initialize. Missing Environment Variables AND missing local JSON!");
        }
    }
} catch (e) {
    console.error("🔥 CRITICAL FIREBASE INIT ERROR: ", e);
}

// ----------------------------------------------------
// ROOT STATUS ENDPOINT
// ----------------------------------------------------
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>JayPortfolio Notification Server</title>
                <style>
                    body { font-family: sans-serif; background: #0A0A0A; color: #FFFFFF; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .card { background: #1A1A1C; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                    h1 { margin-bottom: 10px; color: #4CAF50; }
                    p { color: #aaaaaa; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🚀 Server Online</h1>
                    <p>This is the backend Notification engine for JayPortfolio.</p>
                    <p style="font-size: 12px; margin-top:20px;">Routing telemetry to Firebase Android App securely.</p>
                </div>
            </body>
        </html>
    `);
});

// ----------------------------------------------------
// TELEMETRY PUSH ENDPOINT
// ----------------------------------------------------
app.post('/api/notify', async (req, res) => {
    const { location, timeSpent, clicks, touches, timeline, chatTranscript } = req.body;
    console.log(`\nNew web visitor logged from: ${location || 'Unknown'}`);
    
    const message = {
        topic: 'admin_dashboard',
        notification: {
            title: `New Visitor Alert! 🚀`,
            body: `Location: ${location}. \nTime: ${timeSpent}s | Clicks: ${clicks}`
        },
        data: {
            timeSpent: String(timeSpent),
            clicks: String(clicks),
            touches: String(touches),
            location: String(location),
            timelineText: JSON.stringify(timeline),
            chatLog: JSON.stringify(chatTranscript)
        }
    };

    try {
        if (admin.apps.length > 0) {
            const response = await admin.messaging().send(message);
            console.log('✅ FCM Push Notification successfully sent:', response);
            res.status(200).json({ success: true, ref: response });
        } else {
            console.log('❌ Skipping Push Notification... Firebase Admin not initialized.');
            res.status(503).json({ error: 'FCM Offline.' });
        }
    } catch (error) {
        console.error('❌ Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Boot the API
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 JayPortfolio Notification Server Live`);
    console.log(`🌐 POST Endpoint: http://localhost:${PORT}/api/notify`);
    console.log(`========================================\n`);
});
