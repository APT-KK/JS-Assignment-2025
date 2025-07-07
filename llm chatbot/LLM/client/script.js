const container = document.getElementById("messagesContainer");

// using indexedDB for chat-storage
const request = window.indexedDB.open("myDatabase", 3);

request.onerror = (event) => {
    console.error("Database error:", event.target.errorCode);
};

let db;

request.onupgradeneeded = (event) => {
    db = event.target.result;

    if (!db.objectStoreNames.contains("messages")) {
        // creating an object store
        const objectStore = db.createObjectStore("messages",
            { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadMessagesFromDB();
};

// Loading messages from database on refreshing
const loadMessagesFromDB = () => {
    const transaction = db.transaction(["messages"], "readonly");
    const objectStore = transaction.objectStore("messages");
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const messages = event.target.result;
        if (messages.length > 0) {
            const welcomeScreen = container.querySelector(".welcome-screen");
            if (welcomeScreen) {
                welcomeScreen.remove();
            }
            
            messages.forEach(message => {
                addMessageToChat(message);
            });
        }
    };
};

const ApiKeyInput = document.getElementById("apiKey");
const model = document.getElementById("modelSelect");

const saveMessage = (message) => {
    const transaction = db.transaction(["messages"], "readwrite");
    const objectStore = transaction.objectStore("messages");
    const request = objectStore.add(message);
    request.onsuccess = () => {
        console.log("Message saved successfully:", message);
    };
};

const sendMessage = async () => {
    const messageInput = document.getElementById("messageInput");
    const userMessage = messageInput.value.trim();
    const apiKey = ApiKeyInput.value.trim();
    const selectedModel = model.value;


    if (!userMessage || !apiKey || !selectedModel) {
        alert("Please fill in all fields (message, API key, and model).");
        return;
    }

    const userMsgObj = {
        role: "user",
        message: userMessage,
        model: selectedModel,
        timestamp: new Date().toISOString()
    };

    addMessageToChat(userMsgObj);
    messageInput.value = "";

    // saving the message to the database
    saveMessage(userMsgObj);

    // loading animation
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");
    typingIndicator.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    container.appendChild(typingIndicator);
    container.scrollTop = container.scrollHeight;

    //sending it to backend server
    try {
        const response = await fetch('http://localhost:4000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                model: selectedModel,
                apiKey: apiKey
            })
        });

        // Remove typing indicator
        typingIndicator.remove();

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Network response was not ok");
        }

        // now handling the response from the server
        const data = await response.json();

        const BotMsgObj = {
            role: "bot",
            message: data.message,
            model: data.model,
            timestamp: data.timestamp
        };

        addMessageToChat(BotMsgObj);
        saveMessage(BotMsgObj);

    } catch (error) {
        if (typingIndicator.parentNode) {
            typingIndicator.remove();
        }
        
        console.error("Error:", error);
        alert(`An error occurred: ${error.message}`);
        return;
    }
};

const sendbutton = document.getElementById("sendBtn");
sendbutton.addEventListener("click", sendMessage);

// Add Enter key support for message input
const messageInput = document.getElementById("messageInput");
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

const addMessageToChat = (messageObj) => {
    const container = document.getElementById("messagesContainer");
    const welcomeScreen = container.querySelector(".welcome-screen");
    if (welcomeScreen) {
        welcomeScreen.remove();
    }
    
    const messageElement = document.createElement("div");
    messageElement.classList.add('message', (messageObj.role === "user" ? "user-message" : "bot-message"));
    
    //found while debugging the invalid timestamp issue
    let timestampStr = "";
        if (messageObj.timestamp) {
            const date = new Date(messageObj.timestamp);
            timestampStr = isNaN(date.getTime())
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }    

    messageElement.innerHTML = `
        <div class="message-header">
            <span class="message-timestamp">${timestampStr}</span>
        </div>
        <div class="message-content">${messageObj.message}</div>
    `;
    container.appendChild(messageElement);
    container.scrollTop = container.scrollHeight; // Auto-Scroll to the bottom
};

//update the bot name based on the selected model
const BotName = document.getElementById("currentModel");
const modelSelect = document.getElementById("modelSelect");

const updateBotName = () => {
    const selectedModel = modelSelect.value;
    BotName.textContent = selectedModel.split('/')[1].replace(/-/g, ' ').replace(/:free/, '').replace(/:paid/, '').replace(/:beta/, '').replace(/:dev/, '').replace(/:latest/, '');
};

updateBotName();

modelSelect.addEventListener("change", updateBotName);

//delete chat button functionality
const deleteChatBtn = document.getElementById("deleteChatBtn");
deleteChatBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete the chat?")) {
        container.innerHTML = `
            <div class="welcome-screen">
                <h1>Welcome to AI Chat</h1>
                <p>Enter your OpenRouter API key and start chatting with AI models!</p>
                <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 8px; max-width: 400px;">
                    <h3 style="color: #fff; margin-bottom: 8px;">Quick Start:</h3>
                    <ol style="color: #ccc; font-size: 14px; text-align: left;">
                        <li>Get your free API key from <a href="https://openrouter.ai/keys" target="_blank" style="color: #4a9eff;">OpenRouter</a></li>
                        <li>Enter the API key in the sidebar</li>
                        <li>Select a model</li>
                        <li>Start chatting!</li>
                    </ol>
                </div>
            </div>
        `;
        //clearing from the indexedDB
        const transaction = db.transaction(["messages"], "readwrite");
        const objectStore = transaction.objectStore("messages");
        const request = objectStore.clear();
        request.onsuccess = () => {
            console.log("All messages deleted.");
        };
    }
});

// New chat functionality
const startNewChat = () => {
    container.innerHTML = `
        <div class="welcome-screen">
            <h1>Welcome to AI Chat</h1>
            <p>Enter your OpenRouter API key and start chatting with AI models!</p>
            <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 8px; max-width: 400px;">
                <h3 style="color: #fff; margin-bottom: 8px;">Quick Start:</h3>
                <ol style="color: #ccc; font-size: 14px; text-align: left;">
                    <li>Get your free API key from <a href="https://openrouter.ai/keys" target="_blank" style="color: #4a9eff;">OpenRouter</a></li>
                    <li>Enter the API key in the sidebar</li>
                    <li>Select a model</li>
                    <li>Start chatting!</li>
                </ol>
            </div>
        </div>
    `;
    //clearing from the indexedDB
    const transaction = db.transaction(["messages"], "readwrite");
    const objectStore = transaction.objectStore("messages");
    const request = objectStore.clear();
    request.onsuccess = () => {
        console.log("All messages deleted for new chat.");
    };
};

window.startNewChat = startNewChat;