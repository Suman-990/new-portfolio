import Hero from "./components/Hero"
import Skills from "./components/Skills"
import MacBook from "./components/MacBook"
import { TimelineDemo } from "./components/TimelineDemo"

function App() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-4 pb-16 sm:pt-6">
      <main>
        <Hero />
        <Skills />
        <MacBook />
        <TimelineDemo />
      </main>
    </div>
  )
}

export default App
