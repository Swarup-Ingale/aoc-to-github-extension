const puzzleTitleElement = document.querySelector('article.day-desc h2');
const puzzleTitle = puzzleTitleElement ? puzzleTitleElement.innerText.replace('--- ', '').replace(' ---', '') : 'Unknown Puzzle';

// 1. Inject Custom CSS for Professional UI
const style = document.createElement('style');
style.textContent = `
  .aoc-ext-container { margin-top: 40px; padding: 25px; border: 1px solid #333; background: #0f0f23; color: #cccccc; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-family: 'Source Code Pro', monospace; }
  .aoc-ext-header { border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: baseline; }
  .aoc-ext-title { color: #00cc00; margin: 0; font-size: 1.3em; text-shadow: 0 0 4px rgba(0, 204, 0, 0.4); }
  
  /* Toggle Buttons */
  .aoc-toggle-group { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .aoc-toggle-label { position: relative; cursor: pointer; }
  .aoc-toggle-label input { position: absolute; opacity: 0; cursor: pointer; }
  .aoc-toggle-text { display: inline-block; padding: 6px 16px; background: #1e1e3f; border: 1px solid #333; border-radius: 20px; font-size: 0.9em; transition: all 0.2s; color: #888; }
  .aoc-toggle-label input:checked ~ .aoc-toggle-text { background: #009000; border-color: #00cc00; color: #fff; box-shadow: 0 0 8px rgba(0, 204, 0, 0.3); }
  .aoc-toggle-label:hover .aoc-toggle-text { border-color: #666; }
  
  /* Textareas */
  .aoc-textarea { width: 100%; height: 140px; margin-bottom: 15px; background: #10101a; color: #00cc00; border: 1px solid #333; border-radius: 4px; padding: 12px; font-family: monospace; resize: vertical; box-sizing: border-box; outline: none; transition: border 0.2s; }
  .aoc-textarea:focus { border-color: #009000; }
  
  /* Footer */
  .aoc-ext-footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #333; display: flex; justify-content: space-between; align-items: center; font-size: 0.85em; color: #666; }
  .aoc-ext-footer a { color: #009000; text-decoration: none; margin-left: 10px; transition: color 0.2s; }
  .aoc-ext-footer a:hover { color: #00cc00; text-decoration: underline; }
  
  #aoc-push-btn { padding: 10px 24px; background: #009000; color: white; border: none; cursor: pointer; font-weight: bold; border-radius: 4px; font-size: 1em; transition: 0.2s; }
  #aoc-push-btn:hover { background: #00cc00; box-shadow: 0 0 10px rgba(0, 204, 0, 0.4); }
`;
document.head.appendChild(style);

const languages = ['Python', 'JavaScript', 'C', 'C++', 'Bash', 'Java', 'Rust', 'Go'];

const container = document.createElement('div');
container.className = 'aoc-ext-container';

container.innerHTML = `
  <div class="aoc-ext-header">
    <h3 class="aoc-ext-title">🚀 Push to GitHub</h3>
    <span style="color: #888; font-size: 0.9em;">${puzzleTitle}</span>
  </div>
  
  <div style="margin-bottom: 10px; color: #aaa; font-size: 0.9em;">Select Part:</div>
  <div class="aoc-toggle-group" id="part-selectors">
    <label class="aoc-toggle-label"><input type="radio" name="aoc-part" value="1" checked><span class="aoc-toggle-text">Part 01</span></label>
    <label class="aoc-toggle-label"><input type="radio" name="aoc-part" value="2"><span class="aoc-toggle-text">Part 02</span></label>
  </div>

  <div style="margin-bottom: 10px; color: #aaa; font-size: 0.9em;">Select Languages:</div>
  <div class="aoc-toggle-group" id="language-selectors">
    ${languages.map(lang => `
      <label class="aoc-toggle-label">
        <input type="checkbox" name="aoc-lang" value="${lang}" ${lang === 'Python' ? 'checked' : ''}>
        <span class="aoc-toggle-text">${lang}</span>
      </label>
    `).join('')}
  </div>

  <div id="textareas-container"></div>
  
  <div style="display: flex; align-items: center; margin-top: 15px;">
    <button id="aoc-push-btn">Push Solution</button>
    <span id="aoc-status" style="margin-left: 20px; font-weight: bold;"></span>
  </div>

  <div class="aoc-ext-footer">
    <div>Created by <strong>Swarup Ingale</strong></div>
    <div>
      <a href="https://github.com/Swarup-Ingale" target="_blank">GitHub Profile</a> | 
      <a href="https://github.com/Swarup-Ingale/aoc-to-github-extension/issues" target="_blank">Report an Issue</a>
    </div>
  </div>
`;

const mainElement = document.querySelector('main');
if (mainElement) mainElement.appendChild(container);

const textareasContainer = document.getElementById('textareas-container');
const checkboxes = document.querySelectorAll('input[name="aoc-lang"]');

function updateTextareas() {
    textareasContainer.innerHTML = '';
    let selectedCount = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedCount++;
            textareasContainer.innerHTML += `
        <textarea id="aoc-code-${cb.value}" class="aoc-textarea" placeholder="Paste your ${cb.value} solution here..."></textarea>
      `;
        }
    });

    if (selectedCount === 0) {
        document.querySelector('input[value="Python"]').checked = true;
        updateTextareas();
    }
}

checkboxes.forEach(cb => cb.addEventListener('change', updateTextareas));
updateTextareas();

document.getElementById('aoc-push-btn').addEventListener('click', () => {
    const part = document.querySelector('input[name="aoc-part"]:checked').value;
    const statusEl = document.getElementById('aoc-status');
    const urlParts = window.location.href.split('/');
    const isDay25Pt2 = urlParts[5] === "25" && part === "2";

    const solutions = {};
    let hasEmptyCode = false;

    if (!isDay25Pt2) {
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const code = document.getElementById(`aoc-code-${cb.value}`).value.trim();
                if (!code) hasEmptyCode = true;
                solutions[cb.value] = code;
            }
        });

        if (hasEmptyCode) {
            statusEl.innerText = "⚠️ Please paste code for all selected languages!";
            statusEl.style.color = "#ffcc00";
            return;
        }
    }

    const descElements = document.querySelectorAll('article.day-desc');
    let descriptionText = "Description not found.";
    if (part === "1" && descElements.length > 0) descriptionText = descElements[0].innerText;
    if (part === "2" && descElements.length > 1) descriptionText = descElements[1].innerText;

    statusEl.innerText = "Pushing to repository... ⏳";
    statusEl.style.color = "#00cc00";

    chrome.runtime.sendMessage({
        action: "pushToGitHub",
        payload: {
            part: part,
            solutions: solutions,
            description: descriptionText,
            url: part === "2" ? window.location.href + "#part2" : window.location.href
        }
    }, (response) => {
        if (response.success) {
            statusEl.innerText = "✅ Successfully pushed to GitHub!";
            statusEl.style.color = "#00ff00";
        } else {
            statusEl.innerText = "❌ Error: " + response.error;
            statusEl.style.color = "#ff3333";
        }
    });
});