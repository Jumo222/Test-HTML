// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
  // Color changing functionality for the home page
  const colorBtn = document.getElementById("colorBtn");
  if (colorBtn) {
    const colors = ["#f4f4f4", "#e8f5e8", "#fff2e8", "#f0e8ff", "#e8f4fd"];
    let colorIndex = 0;

    colorBtn.addEventListener("click", function () {
      colorIndex = (colorIndex + 1) % colors.length;
      document.body.style.backgroundColor = colors[colorIndex];
      document.body.classList.add("color-transition");

      // Add bounce animation to button
      colorBtn.classList.add("bounce");
      setTimeout(() => {
        colorBtn.classList.remove("bounce");
      }, 500);
    });
  }

  // Click counter functionality
  const counterBtn = document.getElementById("counterBtn");
  const counterSpan = document.getElementById("counter");
  if (counterBtn && counterSpan) {
    let count = 0;

    counterBtn.addEventListener("click", function () {
      count++;
      counterSpan.textContent = count.toString();

      // Add visual feedback
      counterBtn.classList.add("bounce");
      setTimeout(() => {
        counterBtn.classList.remove("bounce");
      }, 500);

      // Change button color based on count
      if (count > 10) {
        counterBtn.style.backgroundColor = "#e74c3c";
      } else if (count > 5) {
        counterBtn.style.backgroundColor = "#f39c12";
      }
    });
  }

  // Message display functionality
  const messageInput = /** @type {HTMLInputElement} */ (
    document.getElementById("messageInput")
  );
  const showMessageBtn = document.getElementById("showMessage");
  const messageDisplay = document.getElementById("messageDisplay");

  if (messageInput && showMessageBtn && messageDisplay) {
    showMessageBtn.addEventListener("click", function () {
      const message = messageInput.value.trim();

      if (message === "") {
        messageDisplay.innerHTML = "<em>Please enter a message first!</em>";
        messageDisplay.style.backgroundColor = "#ffe8e8";
        messageDisplay.style.color = "#e74c3c";
      } else {
        messageDisplay.innerHTML = `<strong>Your message:</strong> "${message}"`;
        messageDisplay.style.backgroundColor = "#e8f6f3";
        messageDisplay.style.color = "#27ae60";

        // Clear the input after showing the message
        messageInput.value = "";
      }

      // Add fade-in effect
      messageDisplay.style.opacity = "0";
      setTimeout(() => {
        messageDisplay.style.opacity = "1";
        messageDisplay.style.transition = "opacity 0.3s ease";
      }, 100);
    });

    // Allow Enter key to trigger the button
    messageInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        showMessageBtn.click();
      }
    });
  }

  // Time display functionality for about page
  const demoBtn = document.getElementById("demoBtn");
  const timeDisplay = document.getElementById("timeDisplay");

  if (demoBtn && timeDisplay) {
    demoBtn.addEventListener("click", function () {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = now.toLocaleDateString();

      timeDisplay.innerHTML = `
                <div style="margin-top: 1rem; padding: 1rem; background-color:rgb(36, 183, 151); border-radius: 5px;">
                    <strong>Current Date:</strong> ${dateString}<br>
                    <strong>Current Time:</strong> ${timeString}
                </div>
            `;

      // Add animation to the demo button
      demoBtn.classList.add("bounce");
      setTimeout(() => {
        demoBtn.classList.remove("bounce");
      }, 500);
    });
  }

  // Add some interactive hover effects to feature cards
  const featureCards = document.querySelectorAll(".feature");
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.borderColor = "#3498db";
      this.style.transform = "translateY(-5px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.borderColor = "#ecf0f1";
      this.style.transform = "translateY(-5px) scale(1)";
    });
  });

  // Add smooth scrolling for any internal links
  /*const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
  */

  // Add a simple page loading animation
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.opacity = "1";
    document.body.style.transition = "opacity 0.5s ease-in";
  }, 100);

  // Console message for developers
  console.log("🎉 Welcome to your first web application!");
  console.log(
    "💡 Open the browser developer tools to see this message and explore the code."
  );
  console.log(
    "🔧 Try modifying the JavaScript, CSS, or HTML to see how changes affect the website."
  );
});
