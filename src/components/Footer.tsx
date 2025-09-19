const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer>
      <p>&copy; 2025 My First Web App. Built for learning!</p>
      <button onClick={scrollToTop} className="back-to-top">
        ↑ Back to Top
      </button>
    </footer>
  )
}

export default Footer