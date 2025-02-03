// script.js

async function loadHistory() {
    const container = document.getElementById("historyContainer");
    try {
        const response = await fetch("history.json");
        const history = await response.json();
        
        container.innerHTML = ""; // Clear loading text
        
        history.reverse().forEach(entry => {
            const card = document.createElement("div");
            card.className = "card p-4 relative flex flex-col";  // Flex container for card

            // Add the image to the card
            const img = document.createElement("img");
            img.src = entry.image_url;
            img.alt = "Generated Image";
            img.className = "w-full h-auto object-contain rounded-2xl";
            card.appendChild(img);
        
            // Create a container for prompt text and details (Flex container for spacing)
            const detailsDiv = document.createElement("div");
            detailsDiv.className = "flex-1";  // Allow this section to take remaining space
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
                <p class="custom-font text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                    ${entry.prompt.replace(/\n/g, '<br>')}
                </p>
            `;
            card.appendChild(detailsDiv);

            // Define the escapedPrompt variable here before using it in the copyPrompt
            const escapedPrompt = JSON.stringify(entry.prompt); // Escape newlines properly

            // Copy Button Positioned at Bottom-Right
            const copyBtn = document.createElement("button");
            copyBtn.className = "copy-button absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600 transition";
            copyBtn.innerHTML = `<i class="fa-duotone fa-copy"></i>`;
            copyBtn.onclick = () => copyPrompt(escapedPrompt, copyBtn);
        
            // Append the copy button to the card (absolute positioned)
            card.appendChild(copyBtn);

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
