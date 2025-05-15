import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row g-4 justify-content-between">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <h4 className="mb-4 text-white fw-bold">KosApp</h4>
            <p className="text-light mb-4">
              Platform pencarian kos terpercaya dengan ribuan pilihan kos di
              seluruh Indonesia. Temukan kos impian Anda dengan mudah dan aman.
            </p>
            <div className="d-flex gap-3 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-lg-2 col-md-6">
            <h5 className="mb-4 text-white fw-semibold">Tautan Cepat</h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/" className="footer-link">
                  Beranda
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/search" className="footer-link">
                  Cari Kos
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="footer-link">
                  Tentang Kami
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="footer-link">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="col-lg-4 col-md-6">
            <h5 className="mb-4 text-white fw-semibold">Hubungi Kami</h5>
            <ul className="list-unstyled contact-info text-light">
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-3 text-primary" size={20} />
                <span>Jl. Example No. 123, Jakarta</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-3 text-primary" size={20} />
                <span>(021) 1234-5678</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-3 text-primary" size={20} />
                <span>info@kosapp.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-light" />

        {/* Footer Bottom */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-light">
              © {new Date().getFullYear()} KosApp. Made with{""}
              in Indonesia
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/privacy" className="footer-link-light me-3">
              Privacy Policy
            </Link>
            <Link to="/terms" className="footer-link-light">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
