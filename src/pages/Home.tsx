import useInteractivity from '../hooks/useInteractivity'
import QuickNavigation from '../components/QuickNavigation'
import LearningSection from '../components/LearningSection'
import InteractiveSection from '../components/InteractiveSection'
import ResourcesSection from '../components/ResourcesSection'
import ContactSection from '../components/ContactSection'

const Home: React.FC = () => {
  const { backgroundColor } = useInteractivity()

  return (
    <div id="top" style={{ backgroundColor }}>
      <header>
        <h1>Welcome to My First Web Application!</h1>
        <p>This is a simple two-page website to learn web development basics.</p>
      </header>

      <QuickNavigation />

      <main>
        <LearningSection />
        <InteractiveSection />
        <ResourcesSection />
        <ContactSection />
      </main>
    </div>
  )
}

export default Home