document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const themeSelector = document.getElementById('theme-selector');
    const wallpaperInput = document.getElementById('wallpaper-input');
    const saveWallpaperBtn = document.getElementById('save-wallpaper-btn');
    const resetWallpaperBtn = document.getElementById('reset-wallpaper-btn');
    const userPhoto = document.getElementById('user-photo');
    const profileModalPhoto = document.getElementById('profile-modal-photo');
    const profileModalName = document.getElementById('profile-modal-name');
    const profileModalEmail = document.getElementById('profile-modal-email');
    const modeChatBtn = document.getElementById('mode-chat');
    const modeImageGenBtn = document.getElementById('mode-image-gen');
    const modeToolsBtn = document.getElementById('mode-tools');
    const chatInterface = document.getElementById('chat-interface');
    const chatForm = document.getElementById('chat-form');
    const promptInputChat = document.getElementById('prompt-input-chat');
    const imageGenInterface = document.getElementById('image-gen-interface');
    const imageGenForm = document.getElementById('image-gen-form');
    const promptInputImageGen = document.getElementById('prompt-input-image-gen');
    const imageGenResultContainer = document.getElementById('image-gen-result-container');
    const imageGenLoader = document.getElementById('image-gen-loader');
    const toolsInterface = document.getElementById('tools-interface');
    const toolsResultContainer = document.getElementById('tools-result-container');
    const toolsLoader = document.getElementById('tools-loader');
    const toolsGrid = document.getElementById('tools-grid');

    const thirdPartyApiKey = "XYCoolcraftNihBoss";
    const tools = [
        { name: "Jadikan GTA", api: "jadigta", type: "url", placeholder: "URL Gambar..." },
        { name: "Jadikan Anime", api: "jadianime", type: "url", placeholder: "URL Gambar..." },
        { name: "Jadikan SDM Tinggi", api: "jadisdmtinggi", type: "url", placeholder: "URL Gambar..." },
        { name: "Jadikan Kartun", api: "jadicartoon", type: "url", placeholder: "URL Gambar..." },
        { name: "Jadikan Cyberpunk", api: "jadicyberpunk", type: "url", placeholder: "URL Gambar..." },
        { name: "Jadikan Hitam", api: "jadihitam", type: "url", placeholder: "URL Gambar..." },
        { name: "Jadikan Putih", api: "jadiputih", type: "url", placeholder: "URL Gambar..." },
        { name: "Jadikan Komik", api: "jadicomicbook", type: "url", placeholder: "URL Gambar..." },
        { name: "Jadikan Pixel Art", api: "jadipixelart", type: "url", placeholder: "URL Gambar..." },
        { name: "Buat Chat WA", api: "iqc", type: "text", placeholder: "Tulis teks disini..." }
    ];

    function renderTools() {
        toolsGrid.innerHTML = '';
        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.innerHTML = `
                <h4>${tool.name}</h4>
                <input type="text" class="input-box tool-input" placeholder="${tool.placeholder}">
                <button class="action-btn process-btn" data-api="${tool.api}" data-type="${tool.type}">Proses</button>
            `;
            toolsGrid.appendChild(card);
        });
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            userPhoto.src = user.photoURL || 'https://via.placeholder.com/40';
            profileModalPhoto.src = user.photoURL || 'https://via.placeholder.com/80';
            profileModalName.textContent = user.displayName || 'Nama Tidak Ditemukan';
            profileModalEmail.textContent = user.email;
        }
    });

    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
    logoutBtn.addEventListener('click', signOutUser);

    const applyTheme = (theme) => {
        if (theme === 'dark') { document.body.classList.add('dark-mode'); } 
        else { document.body.classList.remove('dark-mode'); }
    };
    
    const loadSettings = () => {
        const savedTheme = localStorage.getItem('xayz_theme') || 'system';
        const savedWallpaper = localStorage.getItem('xayz_wallpaper');
        themeSelector.value = savedTheme;
        if (savedTheme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(systemPrefersDark ? 'dark' : 'light');
        } else {
            applyTheme(savedTheme);
        }
        if (savedWallpaper) {
            document.body.style.backgroundImage = `url('${savedWallpaper}')`;
            wallpaperInput.value = savedWallpaper;
        }
    };
    
    themeSelector.addEventListener('change', (e) => {
        localStorage.setItem('xayz_theme', e.target.value);
        loadSettings();
    });
    
    saveWallpaperBtn.addEventListener('click', () => {
        const wallpaperUrl = wallpaperInput.value.trim();
        if (wallpaperUrl) {
            localStorage.setItem('xayz_wallpaper', wallpaperUrl);
            document.body.style.backgroundImage = `url('${wallpaperUrl}')`;
        }
    });
    
    resetWallpaperBtn.addEventListener('click', () => {
        localStorage.removeItem('xayz_wallpaper');
        document.body.style.backgroundImage = 'none';
        wallpaperInput.value = '';
    });
    
    function switchMode(activeMode) {
        const modes = { chat: modeChatBtn, imageGen: modeImageGenBtn, tools: modeToolsBtn };
        const interfaces = { chat: chatInterface, imageGen: imageGenInterface, tools: toolsInterface };
        const forms = { chat: chatForm, imageGen: imageGenForm, tools: null };

        for (const mode in modes) {
            const isActive = mode === activeMode;
            modes[mode].classList.toggle('active', isActive);
            interfaces[mode].classList.toggle('hidden', !isActive);
            if(forms[mode]) forms[mode].classList.toggle('hidden', !isActive);
        }
        const footer = document.querySelector('.chat-footer');
        footer.style.display = activeMode === 'tools' ? 'none' : 'block';
    }

    modeChatBtn.addEventListener('click', () => switchMode('chat'));
    modeImageGenBtn.addEventListener('click', () => switchMode('imageGen'));
    modeToolsBtn.addEventListener('click', () => switchMode('tools'));

    const appendMessage = (text, senderClass) => {
        const placeholder = chatInterface.querySelector('.message-placeholder');
        if (placeholder) placeholder.remove();
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', senderClass);
        messageDiv.textContent = text;
        chatInterface.appendChild(messageDiv);
        chatInterface.scrollTop = chatInterface.scrollHeight;
    };

    const handleChatSubmit = async (e) => {
    e.preventDefault();
    const prompt = promptInputChat.value.trim();
    if (!prompt) return;
    
    appendMessage(prompt, 'user');
    promptInputChat.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error(`Error dari server: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        appendMessage(data.text, 'ai');

    } catch (error) {
        console.error("Error fetching AI response:", error);
        appendMessage(`Maaf, terjadi kesalahan: ${error.message}`, 'ai-error');
    }
};

    const handleImageGenSubmit = async (e) => {
        e.preventDefault();
        const prompt = promptInputImageGen.value.trim();
        if (!prompt) return;
        imageGenLoader.classList.remove('hidden');
        imageGenResultContainer.innerHTML = '';
        const encodedPrompt = encodeURIComponent(prompt);
        const apiUrl = `https://api.botcahx.eu.org/api/search/stablediffusion?text=${encodedPrompt}&apikey=${thirdPartyApiKey}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Gagal mengambil gambar. Status: ${response.status}`);
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = prompt;
            imageGenResultContainer.appendChild(imgElement);
        } catch (error) {
            console.error("Error generating image:", error);
            imageGenResultContainer.innerHTML = `<p style="color: #ef4444;">${error.message}</p>`;
        } finally {
            imageGenLoader.classList.add('hidden');
        }
    };

    toolsGrid.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('process-btn')) return;
        const button = e.target;
        const card = button.closest('.tool-card');
        const input = card.querySelector('.tool-input');
        const inputValue = input.value.trim();
        if (!inputValue) return;

        const api = button.dataset.api;
        const type = button.dataset.type;
        const paramName = type === 'url' ? 'url' : 'text';
        const encodedValue = encodeURIComponent(inputValue);
        const apiUrl = `https://api.botcahx.eu.org/api/maker/${api}?${paramName}=${encodedValue}&apikey=${thirdPartyApiKey}`;

        toolsLoader.classList.remove('hidden');
        toolsResultContainer.innerHTML = '';
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Gagal memproses. Status: ${response.status}`);
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `Hasil dari ${api}`;
            toolsResultContainer.appendChild(imgElement);
            toolsResultContainer.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error("Error processing tool:", error);
            toolsResultContainer.innerHTML = `<p style="color: #ef4444;">${error.message}</p>`;
        } finally {
            toolsLoader.classList.add('hidden');
        }
    });
    
    chatForm.addEventListener('submit', handleChatSubmit);
    imageGenForm.addEventListener('submit', handleImageGenSubmit);
    
    renderTools();
    loadSettings();
});