import SignatureAnimation from "./ui/SignatureAnimation";
import "./Footer.css";

export default function Footer() {
  return (
    <footer id="footer" className="juxta-footer">
      <div className="juxta-footer-inner">
        {/* Column 1: Identity, Animated Vector Signature, Socials, Copyright */}
        <div className="col col1">
          <h3>Suman Mahanty</h3>
          <p className="tagline">Full Stack &amp; Backend Software Engineer</p>

          {/* Authentic Handwriting Signature Vector Animation */}
          <div className="signature-wrap">
            <SignatureAnimation
              variant="suman"
              strokeColor="#38bdf8"
              strokeWidth={3.8}
              speedMultiplier={1.5}
              className="w-full h-auto !items-start"
            />
          </div>

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

          <p className="copyright">2026 © Suman Mahanty • All Rights Reserved</p>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="col col2">
          <p className="col-title">// Navigation</p>
          <p><a href="#home">Home</a></p>
          <p><a href="#skills">Skills &amp; Stack</a></p>
          <p><a href="#projects">Workbench OS</a></p>
          <p><a href="#timeline">Milestones &amp; Work</a></p>
          <p><a href="#contact">Contact Radar</a></p>
        </div>

        {/* Column 3: Direct Connect & Links */}
        <div className="col col3">
          <p className="col-title">// Direct Connect</p>
          <p>
            <a
              href="/Suman_Mahanty_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#38bdf8" }}
            >
              View Resume (PDF) ↗
            </a>
          </p>
          <p>
            <a href="mailto:sumanmahanty.99@gmail.com">
              sumanmahanty.99@gmail.com
            </a>
          </p>
          <p>
            <a
              href="https://wa.me/919064961649"
              target="_blank"
              rel="noopener noreferrer"
            >
              +91 9064961649
            </a>
          </p>
          <p style={{ color: "#818181", fontSize: "0.85em" }}>
            Jamshedpur / Kolkata, India
          </p>
        </div>
      </div>
    </footer>
  );
}
