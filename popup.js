document.addEventListener('DOMContentLoaded', () => {
    const body = document.documentElement;
    const themeBtns = document.querySelectorAll('.theme-btn');
    const statusEl = document.getElementById('status');
    const saveBtn = document.getElementById('saveBtn');

    // Load saved settings & theme
    chrome.storage.local.get(['ghToken', 'ghRepo', 'theme'], (data) => {
        if (data.ghToken) document.getElementById('ghToken').value = data.ghToken;
        if (data.ghRepo) document.getElementById('ghRepo').value = data.ghRepo;

        const currentTheme = data.theme || 'dark';
        body.setAttribute('data-theme', currentTheme);
        themeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.set === currentTheme);
        });
    });

    // Theme switcher logic
    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedTheme = e.target.dataset.set;
            body.setAttribute('data-theme', selectedTheme);
            themeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            chrome.storage.local.set({ theme: selectedTheme });
        });
    });

    // Animated Save Action
    saveBtn.addEventListener('click', () => {
        const ghToken = document.getElementById('ghToken').value.trim();
        const ghRepo = document.getElementById('ghRepo').value.trim();

        saveBtn.innerText = "Saving... ⏳";
        saveBtn.style.transform = "scale(0.98)";

        chrome.storage.local.set({ ghToken, ghRepo }, () => {
            setTimeout(() => {
                saveBtn.innerText = "Save Settings";
                saveBtn.style.transform = "translateY(0)";

                statusEl.innerText = "✅ Settings Saved!";
                statusEl.style.color = "var(--primary-hover)";
                statusEl.classList.add('show');

                setTimeout(() => {
                    statusEl.classList.remove('show');
                }, 2000);
            }, 400); // Artificial delay for smooth interaction feel
        });
    });
});