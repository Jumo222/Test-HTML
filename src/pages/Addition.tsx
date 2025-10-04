import { useState } from "react";

const Addition: React.FC = () => {
  const [number1, setNumber1] = useState<string>("");
  const [number2, setNumber2] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [resultStyle, setResultStyle] = useState({
    backgroundColor: "",
    color: "",
  });

  const calculateSum = () => {
    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);

    if (isNaN(num1) || isNaN(num2)) {
      setResult("Please enter valid numbers in both fields!");
      setResultStyle({ backgroundColor: "#ffe8e8", color: "#e74c3c" });
    } else {
      const sum = num1 + num2;
      setResult(`Result: ${num1} + ${num2} = ${sum}`);
      setResultStyle({ backgroundColor: "#e8f6f3", color: "#27ae60" });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      calculateSum();
    }
  };

  return (
    <>
      <header>
        <h1>Addition Calculator</h1>
        <p>A simple calculator to add two numbers together.</p>
      </header>

      <main>
        <section className="calculator">
          <div className="calculator-container">
            <h2>Add Two Numbers</h2>

            <div className="input-group">
              <label htmlFor="number1">First Number:</label>
              <input
                type="number"
                id="number1"
                value={number1}
                onChange={(e) => setNumber1(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter first number"
              />
            </div>

            <div className="input-group">
              <label htmlFor="number2">Second Number:</label>
              <input
                type="number"
                id="number2"
                value={number2}
                onChange={(e) => setNumber2(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter second number"
              />
            </div>

            <button onClick={calculateSum}>Calculate Sum</button>

            {result && (
              <div
                className="result"
                style={{
                  ...resultStyle,
                  display: "block",
                  marginTop: "1.5rem",
                  padding: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                {result}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Addition;
