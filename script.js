// script.js

async function loadHistory() {
    const container = document.getElementById("historyContainer");
    try {
        const response = await fetch("history.json");
        const history = await response.json();
        
        container.innerHTML = ""; // Clear loading text
        
        history.reverse().forEach(entry => {
            const card = document.createElement("div");
            card.className = "card p-4 relative";  // 'relative' so the copy button can be absolutely positioned

            // Add the image to the card
            const img = document.createElement("img");
            img.src = entry.image_url;
            img.alt = "Generated Image";
            img.className = "w-full h-auto object-contain rounded-2xl";
        
            card.appendChild(img);
        
            // Create a container for prompt and copy button (Flex container)
            const promptContainer = document.createElement("div");
            promptContainer.className = "prompt-container flex flex-col gap-2";  // Flexbox with gap

            // Add the other details (date, model, aspect ratio, prompt)
            const detailsDiv = document.createElement("div");
            detailsDiv.innerHTML = `
                <p class="text-sm text-gray-500 flex items-center mt-2">
                    <i class="fa-duotone fa-calendar-days mr-2"></i> ${entry.date}
                </p>
                <p class="text-sm text-gray-500 flex items-center">
                    <i class="fa-duotone fa-microchip-ai mr-2"></i> <span class="font-medium">${entry.model}</span>
                </p>
                <p class="text-sm text-gray-500 flex items-center">
                    <i class="fa-duotone fa-up-right-and-down-left-from-center mr-2"></i> <span class="font-medium">${entry.aspect_ratio}</span>
                </p>
            `;
            promptContainer.appendChild(detailsDiv);

            // Add the prompt text
            const promptText = document.createElement("p");
            promptText.className = "custom-font text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2";
            promptText.innerHTML = entry.prompt.replace(/\n/g, '<br>'); // Handle line breaks
            promptContainer.appendChild(promptText);

            // Define the escapedPrompt variable here before using it in the copyPrompt
            const escapedPrompt = JSON.stringify(entry.prompt); // Escape newlines properly

            // Copy Button Positioned at Bottom-Right
            const copyBtn = document.createElement("button");
            copyBtn.className = "copy-button bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600 transition";
            copyBtn.innerHTML = `<i class="fa-duotone fa-copy"></i>`;
            copyBtn.onclick = () => copyPrompt(escapedPrompt, copyBtn);
        
            // Append the copy button to the container
            promptContainer.appendChild(copyBtn);

            // Append the prompt container to the card
            card.appendChild(promptContainer);

            // Append the card to the container
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = "<p class='text-red-500 text-center col-span-full'>❌ Failed to load history.</p>";
        console.error(error);
    }
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
