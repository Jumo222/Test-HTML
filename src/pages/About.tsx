import { useState } from 'react'

const About: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('')

  const showCurrentTime = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString()
    const dateString = now.toLocaleDateString()

    setCurrentTime(`Current Date: ${dateString} | Current Time: ${timeString}`)
  }

  return (
    <>
      <header>
        <h1>About This Web Application</h1>
        <p>Learn how this simple website demonstrates key web development concepts.</p>
      </header>

      <main>
        <section className="about-content">
          <h2>How This Website Works</h2>

          <div className="tech-explanation">
            <div className="tech-item">
              <h3>HTML (HyperText Markup Language)</h3>
              <p>HTML provides the structure and content of web pages. It uses elements like <code>&lt;h1&gt;</code> for headings, <code>&lt;p&gt;</code> for paragraphs, and <code>&lt;div&gt;</code> for containers.</p>
              <ul>
                <li>Semantic elements organize content meaningfully</li>
                <li>Links connect different pages together</li>
                <li>Forms allow user input and interaction</li>
              </ul>
            </div>

            <div className="tech-item">
              <h3>CSS (Cascading Style Sheets)</h3>
              <p>CSS controls how the website looks - colors, fonts, spacing, and layout. It separates presentation from content.</p>
              <ul>
                <li>Selectors target specific HTML elements</li>
                <li>Properties define visual styles</li>
                <li>Responsive design adapts to different screen sizes</li>
              </ul>
            </div>

            <div className="tech-item">
              <h3>JavaScript</h3>
              <p>JavaScript adds interactivity and dynamic behavior. It can respond to user actions, modify content, and communicate with servers.</p>
              <ul>
                <li>Event listeners respond to clicks, typing, etc.</li>
                <li>DOM manipulation changes page content</li>
                <li>Variables store and manage data</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>Interactive Demo</h2>
          <p>Click the button below to see JavaScript in action:</p>
          <button onClick={showCurrentTime}>Show Current Time</button>
          {currentTime && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: 'rgb(36, 183, 151)',
              borderRadius: '5px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {currentTime}
            </div>
          )}

          <div className="code-example">
            <h3>Sample Code Behind This Button:</h3>
            <pre><code>{`const showCurrentTime = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString();

  setCurrentTime(\`Current Date: \${dateString} | Current Time: \${timeString}\`);
};`}</code></pre>
          </div>
        </section>
      </main>
    </>
  )
}

export default About