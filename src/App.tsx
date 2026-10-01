import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Skills from "./components/Skills"
import TechStrip from "./components/TechStrip"
import MacBook from "./components/MacBook"

function App() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <Navbar />
      <main>
        <Hero />
        <TechStrip />
        <Skills />
        <MacBook />
      </main>
    </div>
  )
}

export default App
