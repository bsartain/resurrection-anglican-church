export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Column */}
        <div className="footer-info">
          <div className="footer-gathering">
            <span className="footer-label">Sunday Gathering</span>
            <span className="footer-time">4:00pm</span>
          </div>

          <div className="footer-divider" />

          <div className="footer-info-block">
            <span className="footer-label">Address</span>
            <p>
              1822 Eden Terrace
              <br />
              Rock Hill, SC 29730
            </p>
          </div>

          <div className="footer-info-block">
            <span className="footer-label">Childcare</span>
            <p>
              We offer nursery and children&apos;s church where there are age-appropriate lessons and activities for preschool&mdash;5th grade. This
              takes place during the scripture reading and sermon.
            </p>
          </div>

          <div className="footer-info-block">
            <span className="footer-label">Phone</span>
            <p>
              <a href="tel:8035555555">(803) 555-5555</a>
            </p>
          </div>
        </div>

        {/* Right Column - Google Map */}
        <div className="footer-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3259.123456789!2d-81.03!3d34.93!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s1822+Eden+Terrace%2C+Rock+Hill%2C+SC+29730!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Church Location"
          />
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Resurrection Anglican Church. All rights reserved.</p>
      </div>
    </footer>
  );
}
