import Nav from './components/Nav'
import Hero from './components/Hero'
import CaseStudies from './components/CaseStudies'
import TechStack from './components/TechStack'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Nav />
      <main>
        <Hero />
        <CaseStudies />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
