import { useState } from "react";

const Calculation: React.FC = () => {
  // Addition state (client-side calculation)
  const [addNum1, setAddNum1] = useState<string>("");
  const [addNum2, setAddNum2] = useState<string>("");
  const [addResult, setAddResult] = useState<string>("");
  const [addResultStyle, setAddResultStyle] = useState({
    backgroundColor: "",
    color: "",
  });

  // Subtraction state (webhook-based calculation)
  const [subNum1, setSubNum1] = useState<string>("");
  const [subNum2, setSubNum2] = useState<string>("");
  const [subResult, setSubResult] = useState<string>("");
  const [subResultStyle, setSubResultStyle] = useState({
    backgroundColor: "",
    color: "",
  });
  const [subLoading, setSubLoading] = useState<boolean>(false);

  // Client-side addition calculation
  const calculateSum = () => {
    const num1 = parseFloat(addNum1);
    const num2 = parseFloat(addNum2);

    if (isNaN(num1) || isNaN(num2)) {
      setAddResult("Please enter valid numbers in both fields!");
      setAddResultStyle({ backgroundColor: "#ffe8e8", color: "#e74c3c" });
    } else {
      const sum = num1 + num2;
      setAddResult(`Result: ${num1} + ${num2} = ${sum}`);
      setAddResultStyle({ backgroundColor: "#e8f6f3", color: "#27ae60" });
    }
  };

  // Webhook-based subtraction calculation
  const calculateDifference = async () => {
    const num1 = parseFloat(subNum1);
    const num2 = parseFloat(subNum2);

    if (isNaN(num1) || isNaN(num2)) {
      setSubResult("Please enter valid numbers in both fields!");
      setSubResultStyle({ backgroundColor: "#ffe8e8", color: "#e74c3c" });
      return;
    }

    setSubLoading(true);
    try {
      const response = await fetch("/api/subtract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ num1, num2 }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubResult(`Result: ${num1} - ${num2} = ${data.result}`);
        setSubResultStyle({ backgroundColor: "#e8f6f3", color: "#27ae60" });
      } else {
        setSubResult(`Error: ${data.error || "Failed to calculate"}`);
        setSubResultStyle({ backgroundColor: "#ffe8e8", color: "#e74c3c" });
      }
    } catch (error) {
      setSubResult(`Error: Unable to connect to server`);
      setSubResultStyle({ backgroundColor: "#ffe8e8", color: "#e74c3c" });
    } finally {
      setSubLoading(false);
    }
  };

  const handleAddKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      calculateSum();
    }
  };

  const handleSubKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      calculateDifference();
    }
  };

  return (
    <>
      <header>
        <h1>Calculation Page</h1>
        <p>Compare different approaches: client-side vs. server-side calculations.</p>
      </header>

      <main>
        {/* Addition Section - Client-side calculation */}
        <section className="calculator">
          <div className="calculator-container">
            <h2>Add Two Numbers (Client-Side)</h2>
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
              Calculation performed in your browser using JavaScript
            </p>

            <div className="input-group">
              <label htmlFor="add-number1">First Number:</label>
              <input
                type="number"
                id="add-number1"
                value={addNum1}
                onChange={(e) => setAddNum1(e.target.value)}
                onKeyDown={handleAddKeyPress}
                placeholder="Enter first number"
              />
            </div>

            <div className="input-group">
              <label htmlFor="add-number2">Second Number:</label>
              <input
                type="number"
                id="add-number2"
                value={addNum2}
                onChange={(e) => setAddNum2(e.target.value)}
                onKeyDown={handleAddKeyPress}
                placeholder="Enter second number"
              />
            </div>

            <button onClick={calculateSum}>Calculate Sum</button>

            {addResult && (
              <div
                className="result"
                style={{
                  ...addResultStyle,
                  display: "block",
                  marginTop: "1.5rem",
                  padding: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                {addResult}
              </div>
            )}
          </div>
        </section>

        {/* Subtraction Section - Webhook-based calculation */}
        <section className="calculator">
          <div className="calculator-container">
            <h2>Subtract Two Numbers (Server-Side)</h2>
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
              Calculation performed on server via webhook API
            </p>

            <div className="input-group">
              <label htmlFor="sub-number1">First Number:</label>
              <input
                type="number"
                id="sub-number1"
                value={subNum1}
                onChange={(e) => setSubNum1(e.target.value)}
                onKeyDown={handleSubKeyPress}
                placeholder="Enter first number"
                disabled={subLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="sub-number2">Second Number:</label>
              <input
                type="number"
                id="sub-number2"
                value={subNum2}
                onChange={(e) => setSubNum2(e.target.value)}
                onKeyDown={handleSubKeyPress}
                placeholder="Enter second number"
                disabled={subLoading}
              />
            </div>

            <button onClick={calculateDifference} disabled={subLoading}>
              {subLoading ? "Calculating..." : "Calculate Difference"}
            </button>

            {subResult && (
              <div
                className="result"
                style={{
                  ...subResultStyle,
                  display: "block",
                  marginTop: "1.5rem",
                  padding: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                {subResult}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Calculation;
