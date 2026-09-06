chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "pushToGitHub") {
        chrome.storage.local.get(['ghToken', 'ghRepo'], async (data) => {
            if (!data.ghToken || !data.ghRepo) {
                sendResponse({ success: false, error: "Token or Repo missing." });
                return;
            }

            try {
                const { part, solutions, description, url } = request.payload;

                const urlParts = url.split('/');
                const year = urlParts[3];
                const day = urlParts[5].split('#')[0];

                const dayFormatted = day.padStart(2, '0');
                const partFormatted = part.padStart(2, '0');

                let markdownContent = `# URL\n${url}\n\n# Description\n${description}\n`;

                if (day === "25" && part === "2") {
                    markdownContent += `\nThis Finally Concludes The Advent of Code ${year}.\n`;
                } else {
                    markdownContent += `\n# Method of Solve\n- The Part ${partFormatted} of this challenge can be solved using the following code:\n`;

                    const mdLang = {
                        "Python": "python", "JavaScript": "javascript", "C": "c",
                        "C++": "cpp", "Bash": "bash", "Java": "java", "Rust": "rust", "Go": "go"
                    };

                    for (const [lang, code] of Object.entries(solutions)) {
                        markdownContent += `- The ${lang} version is as follows:\n\`\`\`${mdLang[lang] || lang.toLowerCase()}\n${code}\n\`\`\`\n`;
                    }

                    const closingStatement = part === "1"
                        ? `- This Solves The Part 01 of this challenge.`
                        : `- This Concludes Day ${dayFormatted} of The Advent of Code.`;

                    markdownContent += `${closingStatement}\n`;
                }

                const filePath = `advent_of_code/${year}/day${dayFormatted}_pt${partFormatted}.md`;

                let sha = null;
                try {
                    const checkRes = await fetch(`https://api.github.com/repos/${data.ghRepo}/contents/${filePath}`, {
                        headers: { 'Authorization': `Bearer ${data.ghToken}` }
                    });
                    if (checkRes.ok) {
                        const fileData = await checkRes.json();
                        sha = fileData.sha;
                    }
                } catch (e) { }

                const base64Content = btoa(unescape(encodeURIComponent(markdownContent)));
                const bodyPayload = {
                    message: `Create/Update day${dayFormatted}_pt${partFormatted}.md`,
                    content: base64Content
                };
                if (sha) bodyPayload.sha = sha;

                const response = await fetch(`https://api.github.com/repos/${data.ghRepo}/contents/${filePath}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${data.ghToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyPayload)
                });

                if (!response.ok) throw new Error("GitHub API rejected the request.");

                sendResponse({ success: true });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        });
        return true;
    }
});