import Hero from "./components/Hero"
import Skills from "./components/Skills"
import MacBook from "./components/MacBook"
import { TimelineDemo } from "./components/TimelineDemo"
import RecentActivity from "./components/RecentActivity"
import Contact from "./components/Contact"

function App() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-4 pb-16 sm:pt-6">
      <main>
        <Hero />
        <Skills />
        <MacBook />
        <TimelineDemo />
        <RecentActivity />
        <Contact />
      </main>
    </div>
  )
}

export default App
