async function loadHistory() {
    const container = document.getElementById("historyContainer");
    container.innerHTML = ""; // Clear loading text

    try {
        const response = await fetch("history.json");
        const history = await response.json();
        
        history.reverse().forEach(entry => {
            const card = document.createElement("div");
            card.className = "card p-4 relative flex flex-col bg-white rounded-xl shadow-md";

            const img = document.createElement("img");
            img.src = entry.image_url;
            img.alt = "Generated Image";
            img.className = "w-full h-auto object-contain rounded-2xl";

            img.onload = () => {
                container.appendChild(card); // Append only after image loads
            };

            card.appendChild(img);

            const detailsDiv = document.createElement("div");
            detailsDiv.className = "mt-2";
            detailsDiv.innerHTML = `
                <p class="text-sm text-gray-500">${entry.date}</p>
                <p class="text-sm text-gray-500">${entry.model}</p>
                <p class="text-sm text-gray-500">${entry.aspect_ratio}</p>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    ${entry.prompt.replace(/\n/g, '<br>')}
                </p>
            `;
            card.appendChild(detailsDiv);
        });

    } catch (error) {
        container.innerHTML = "<p class='text-red-500 text-center'>❌ Failed to load history.</p>";
        console.error(error);
    }
}


function createPromptElement(promptText) {
    const promptContainer = document.createElement("div");
    promptContainer.className = "prompt-container custom-font text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2";
    promptContainer.style.maxHeight = "80px"; // Initial max height
    promptContainer.style.overflow = "hidden";
    promptContainer.style.position = "relative";
    promptContainer.innerHTML = promptText.replace(/\n/g, '<br>');

    if (promptText.length > 200) { // If the prompt is long
        const showMore = document.createElement("div");
        showMore.className = "show-more";
        showMore.innerText = "Show More";
        showMore.style.position = "absolute";
        showMore.style.bottom = "0";
        showMore.style.left = "0";
        showMore.style.width = "100%";
        showMore.style.textAlign = "center";
        showMore.style.background = "linear-gradient(to bottom, rgba(255,255,255,0), white)";
        showMore.style.cursor = "pointer";
        showMore.style.fontSize = "12px";
        showMore.style.padding = "5px";
        showMore.style.color = "#007bff";

        showMore.onclick = () => {
            if (promptContainer.style.maxHeight === "80px") {
                promptContainer.style.maxHeight = "none"; // Expand
                promptContainer.style.overflow = "visible";
                showMore.innerText = "Show Less";
            } else {
                promptContainer.style.maxHeight = "80px"; // Collapse
                promptContainer.style.overflow = "hidden";
                showMore.innerText = "Show More";
            }
        };

        promptContainer.appendChild(showMore);
    }

    return promptContainer;
}



// Lazy Loading Function
function lazyLoadImages() {
    const images = document.querySelectorAll("img.lazy");
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Load image when visible
                img.classList.remove("lazy");
                obs.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

function copyPrompt(text, button) {
    navigator.clipboard.writeText(text.replace(/\\n/g, '\n')).then(() => { 
        button.style.backgroundColor = "#38a169"; // Green when clicked
        button.style.color = "white"; // White icon
        button.innerHTML = "<i class='fa-duotone fa-check'></i>"; // Check icon

        setTimeout(() => {
            button.style.backgroundColor = "white"; // Reset to white
            button.style.color = "#6B7280"; // Reset icon to gray
            button.innerHTML = "<i class='fa-duotone fa-copy'></i>"; // Copy icon again
        }, 2000);
    }).catch(err => console.error("Copy failed:", err));
}


loadHistory();
