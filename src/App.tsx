import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import TechStrip from "./components/TechStrip"

function App() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <Navbar />
      <main>
        <Hero />
        <TechStrip />
      </main>
    </div>
  )
}

export default App
