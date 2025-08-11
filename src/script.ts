// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function (): void {
  // Color changing functionality for the home page
  const colorBtn: HTMLButtonElement | null = document.getElementById(
    "colorBtn"
  ) as HTMLButtonElement | null;
  if (colorBtn) {
    const colors: string[] = [
      "#f4f4f4",
      "#e8f5e8",
      "#fff2e8",
      "#f0e8ff",
      "#e8f4fd",
    ];
    let colorIndex: number = 0;

    colorBtn.addEventListener("click", function (): void {
      colorIndex = (colorIndex + 1) % colors.length;
      document.body.style.backgroundColor = colors[colorIndex];
      document.body.classList.add("color-transition");

      // Add bounce animation to button
      colorBtn.classList.add("bounce");
      setTimeout((): void => {
        colorBtn.classList.remove("bounce");
      }, 500);
    });
  }

  // Click counter functionality
  const counterBtn: HTMLButtonElement | null = document.getElementById(
    "counterBtn"
  ) as HTMLButtonElement | null;
  const counterSpan: HTMLSpanElement | null = document.getElementById(
    "counter"
  ) as HTMLSpanElement | null;
  if (counterBtn && counterSpan) {
    let count: number = 0;

    counterBtn.addEventListener("click", function (): void {
      count++;
      counterSpan.textContent = count.toString();

      // Add visual feedback
      counterBtn.classList.add("bounce");
      setTimeout((): void => {
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
  const messageInput: HTMLInputElement | null = document.getElementById(
    "messageInput"
  ) as HTMLInputElement | null;
  const showMessageBtn: HTMLButtonElement | null = document.getElementById(
    "showMessage"
  ) as HTMLButtonElement | null;
  const messageDisplay: HTMLDivElement | null = document.getElementById(
    "messageDisplay"
  ) as HTMLDivElement | null;

  if (messageInput && showMessageBtn && messageDisplay) {
    showMessageBtn.addEventListener("click", function (): void {
      const message: string = messageInput.value.trim();

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
      setTimeout((): void => {
        messageDisplay.style.opacity = "1";
        messageDisplay.style.transition = "opacity 0.3s ease";
      }, 100);
    });

    // Allow Enter key to trigger the button
    messageInput.addEventListener(
      "keypress",
      function (event: KeyboardEvent): void {
        if (event.key === "Enter") {
          showMessageBtn.click();
        }
      }
    );
  }

  // Time display functionality for about page
  const demoBtn: HTMLButtonElement | null = document.getElementById(
    "demoBtn"
  ) as HTMLButtonElement | null;
  const timeDisplay: HTMLDivElement | null = document.getElementById(
    "timeDisplay"
  ) as HTMLDivElement | null;

  if (demoBtn && timeDisplay) {
    demoBtn.addEventListener("click", function (): void {
      const now: Date = new Date();
      const timeString: string = now.toLocaleTimeString();
      const dateString: string = now.toLocaleDateString();

      timeDisplay.innerHTML = `
                <div style="margin-top: 1rem; padding: 1rem; background-color:rgb(36, 183, 151); border-radius: 5px;">
                    <strong>Current Date:</strong> ${dateString}<br>
                    <strong>Current Time:</strong> ${timeString}
                </div>
            `;

      // Add animation to the demo button
      demoBtn.classList.add("bounce");
      setTimeout((): void => {
        demoBtn.classList.remove("bounce");
      }, 500);
    });
  }

  // Add some interactive hover effects to feature cards
  const featureCards: NodeListOf<Element> =
    document.querySelectorAll(".feature");
  featureCards.forEach((card: Element): void => {
    const htmlCard = card as HTMLElement;
    htmlCard.addEventListener("mouseenter", function (this: HTMLElement): void {
      this.style.borderColor = "#3498db";
      this.style.transform = "translateY(-5px) scale(1.02)";
    });

    htmlCard.addEventListener("mouseleave", function (this: HTMLElement): void {
      this.style.borderColor = "#ecf0f1";
      this.style.transform = "translateY(-5px) scale(1)";
    });
  });

  // Add a simple page loading animation
  document.body.style.opacity = "0";
  setTimeout((): void => {
    document.body.style.opacity = "1";
    document.body.style.transition = "opacity 0.5s ease-in";
  }, 100);

  // Console message for developers
  console.log("🎉 Test Welcome to your first web application!");
  console.log(
    "💡 Open the browser developer tools to see this message and explore the code."
  );
  console.log(
    "🔧 Try modifying the JavaScript, CSS, or HTML to see how changes affect the website."
  );
});
