# 🎄 AoC to GitHub Extension

A professional, seamless Chrome extension designed to push your Advent of Code solutions directly to your GitHub repository with custom markdown writeups, multi-language support, and automated folder structuring.

## ✨ Features

- **Automated Directory Structuring:** Automatically pushes solutions into `advent_of_code/YYYY/dayXX_ptYY.md`.
- **Multi-Language Support:** Write solutions in Python, JavaScript, C, C++, Bash, Java, Rust, or Go simultaneously.
- **Dynamic Markdown Templates:** Automatically formats problem descriptions, URLs, and code blocks adhering to custom write-up styles.
- **Modern Popup UI:** Features a sleek dark theme, light mode, and a hacker theme toggle with smooth CSS animations.
- **Secure Authentication:** Stores your GitHub Personal Access Token (PAT) securely using Chrome's local storage API.

## 🚀 Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select the extension folder.

## ⚙️ Configuration

1. Click the extension icon in your Chrome toolbar.
2. Enter your GitHub **Personal Access Token (PAT)** with `repo` scope permissions.
3. Enter your target repository name (e.g., `Swarup-Ingale/your-repo-name`).
4. Click **Save Settings**.

## 🛠️ Usage

1. Navigate to any [Advent of Code](https://adventofcode.com/) puzzle page.
2. Use the injected panel at the bottom of the page to choose your target **Part** and preferred **Programming Languages**.
3. Paste your solutions into the text areas and click **Push Solution**.

## 👤 Author

Developed by **Swarup Ingale**  
- GitHub: [@Swarup-Ingale](https://github.com/Swarup-Ingale)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).