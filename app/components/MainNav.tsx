"use client";
import { Container } from "react-bootstrap";
import { Navbar, Offcanvas } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ScrollToTopButton from "./ScrollToTopButton";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Service Times / Contact", href: "/contact" },
  { label: "Plan Your Visit!", href: "/plan-your-visit" },
  { label: "Children's Ministry", href: "/kids" },
  { label: "Leadership", href: "/leadership" },
  { label: "Beliefs", href: "/catechism" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Give", href: "/give" },
  { label: "The Anglican Way", href: "/anglican" },
  { label: "What is the Gospel And How Is It For Me?", href: "/gospel" },
];

const MainNav = () => {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show at the top of the page
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down — hide
        setVisible(false);
      } else {
        // Scrolling up — show
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar
        className="main-nav-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1030,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <Container>
          <Navbar.Brand href="/">
            <div className="d-flex align-items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-black.png" alt="Resurrection Anglican Church" className="logo" />
              <div>
                <h4 className="logo-title">Resurrection Anglican Church</h4>
              </div>
            </div>
          </Navbar.Brand>
          <button className="hamburger" onClick={() => setShow(true)} aria-label="Toggle menu">
            <span className="bar" />
            <span className="bar" />
          </button>
        </Container>
      </Navbar>
      {pathname === "/catechism" || pathname === "/resources" || pathname === "/sermons" ? <ScrollToTopButton /> : null}

      <Offcanvas show={show} onHide={() => setShow(false)} placement="end" className="drawer-container">
        <Offcanvas.Header closeButton>
          <div className="drawer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-black.png" alt="Resurrection Anglican Church" className="drawer-brand-logo" />
            <hr className="drawer-brand-rule" />
            <div className="drawer-brand-name">
              Resurrection Anglican
              <br />
              Church
            </div>
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {menuItems.map((item, i) => (
            <div key={item.href}>
              {item.href === "/plan-your-visit"}
              <Link
                href={item.href}
                className="drawer-nav-link"
                onClick={() => setShow(false)}
                style={item.href === "/plan-your-visit" ? { background: "#a0856a", color: "#ffffff" } : {}}
              >
                {item.label}
                <span className="drawer-nav-arrow">›</span>
              </Link>
              {i < menuItems.length - 1 && <hr className="drawer-divider" />}
            </div>
          ))}
        </Offcanvas.Body>

        <div className="drawer-footer">
          <p className="drawer-footer-text">Rock Hill, South Carolina</p>
        </div>
      </Offcanvas>
    </>
  );
};

export default MainNav;
