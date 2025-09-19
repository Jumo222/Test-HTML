const LearningSection: React.FC = () => {
  return (
    <section id="learn" className="intro">
      <h2>What You'll Learn Here</h2>
      <div className="features">
        <div className="feature">
          <h3>HTML Structure</h3>
          <p>How web pages are built with HTML elements and tags.</p>
        </div>
        <div className="feature">
          <h3>CSS Styling</h3>
          <p>How to make websites look beautiful with colors, fonts, and layouts.</p>
        </div>
        <div className="feature">
          <h3>JavaScript Interactivity</h3>
          <p>How to add dynamic behavior and user interactions.</p>
        </div>
      </div>
    </section>
  )
}

export default LearningSection