import Hero from "./components/Hero"
import Skills from "./components/Skills"
import MacBook from "./components/MacBook"
import { TimelineDemo } from "./components/TimelineDemo"
import RecentActivity from "./components/RecentActivity"
import Contact from "./components/Contact"
import UnifiedSections from "./components/UnifiedSections"
import Footer from "./components/Footer"
import SmoothScroll from "./components/SmoothScroll"

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen w-full bg-[#07080c] text-neutral-100 overflow-x-hidden">
        <main className="w-full">
          <Hero />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <UnifiedSections>
              <Skills />
              <MacBook />
              <TimelineDemo />
              <RecentActivity />
            </UnifiedSections>
          </div>
          <Contact />
          <Footer />
        </main>
      </div>
    </SmoothScroll>
  )
}

export default App
