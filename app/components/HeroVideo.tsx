import Link from "next/link";

export default function HeroVideo() {
  return (
    <div className="hero-video-container">
      <div className="hero">
        <video autoPlay muted loop playsInline className="video">
          <source src="/videos/splash-video.mp4" type="video/mp4" />
        </video>
        <div className="overlay" />
        <div className="content">
          <span className="reveal">Welcome to</span>
          <div className="d-flex justify-content-center w-100">
            <hr className="mt-5 mb-1" style={{ width: "50px" }} />
          </div>
          <h1 className="hero-title reveal">Resurrection Anglican Church</h1>
          <div className="d-flex justify-content-center w-100">
            <hr className="mt-3 mb-5" style={{ width: "50px" }} />
          </div>
          <p className="reveal">Experience the Trinity, Embody Community, Engage the City</p>
          <Link href="/plan-your-visit" className="btn btn-lg btn-primary mt-2 rounded reveal" style={{ background: "#ffffff", color: "#2b2b2b" }}>
            <span className="mt-1">Plan Your Visit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
