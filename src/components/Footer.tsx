import SignatureAnimation from "./ui/SignatureAnimation";
import FooterWaves from "./ui/FooterWaves";
import { ArrowUpRight } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer id="footer" className="juxta-footer">
      {/* Liquid Wave Header Animation */}
      <FooterWaves />

      <div className="juxta-footer-body">
        <div className="juxta-footer-inner">
        {/* Column 1: Identity, Animated Vector Signature, Socials, Copyright */}
        <div className="col col1">
          {/* Authentic Handwriting Signature Vector Animation in Neon Blue */}
          <div className="signature-wrap">
            <SignatureAnimation
              variant="suman"
              strokeColor="#38bdf8"
              strokeWidth={3.8}
              speedMultiplier={1.5}
              className="w-full h-auto !items-start"
            />
          </div>

          <p className="tagline">Full-Stack &amp; Systems Developer</p>

          {/* Social Profile Links */}
          <div className="social">
            <a
              href="https://github.com/Suman-990"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
              title="GitHub"
            >
              <img src="/github.svg" alt="GitHub" />
            </a>
            <a
              href="https://www.linkedin.com/in/suman990"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
              title="LinkedIn"
            >
              <img src="/LinkedIn_icon.svg.webp" alt="LinkedIn" />
            </a>
            <a
              href="https://leetcode.com/u/Suman_990/"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
              title="LeetCode"
            >
              <img src="/leetcode.webp" alt="LeetCode" />
            </a>
            <a
              href="https://wa.me/919064961649"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
              title="WhatsApp"
            >
              <img src="/whatsapp.svg" alt="WhatsApp" />
            </a>
            <a
              href="mailto:sumanmahanty.99@gmail.com"
              className="link"
              title="Email"
            >
              <img src="/email.svg" alt="Email" />
            </a>
          </div>

          <p className="copyright">2026 © Suman Mahanty • Built with React, Three.js, GSAP &amp; Tailwind</p>
        </div>

        {/* Column 2: Navigation Links (Cardless & Crisp) */}
        <div className="col col2">
          <p className="col-title">
            <span>//</span>
            <span>Navigation</span>
          </p>

          <nav className="link-list">
            <a href="#home" className="link-item">
              <span className="link-arrow">→</span>
              <span>Home</span>
            </a>
            <a href="#skills" className="link-item">
              <span className="link-arrow">→</span>
              <span>Skills &amp; Architecture</span>
            </a>
            <a href="#projects" className="link-item">
              <span className="link-arrow">→</span>
              <span>Workbench OS</span>
            </a>
            <a href="#timeline" className="link-item">
              <span className="link-arrow">→</span>
              <span>Milestones &amp; Experience</span>
            </a>
            <a href="#contact" className="link-item">
              <span className="link-arrow">→</span>
              <span>Contact Radar</span>
            </a>
          </nav>
        </div>

        {/* Column 3: Direct Connect & Links (Cardless & Clean) */}
        <div className="col col3">
          <p className="col-title">
            <span>//</span>
            <span>Direct Connect</span>
          </p>

          <div className="status-pill">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.9)]" />
            </span>
            <span>Open for new opportunities</span>
          </div>

          <div className="connect-list">
            <div className="connect-item">
              <span className="connect-label">Resume / CV</span>
              <a
                href="/Suman_Mahanty_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="resume-link"
              >
                <span>View Full Resume (PDF)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="connect-item">
              <span className="connect-label">Email</span>
              <a href="mailto:sumanmahanty.99@gmail.com" className="connect-value">
                sumanmahanty.99@gmail.com
              </a>
            </div>

            <div className="connect-item">
              <span className="connect-label">WhatsApp</span>
              <a
                href="https://wa.me/919064961649"
                target="_blank"
                rel="noopener noreferrer"
                className="connect-value"
              >
                +91 9064961649
              </a>
            </div>

            <div className="connect-item">
              <span className="connect-label">Location</span>
              <span className="text-neutral-400 text-xs font-mono">
                Jamshedpur &amp; Kolkata, India • UTC+5:30
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
