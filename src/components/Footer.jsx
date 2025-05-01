import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-dark py-5 mt-auto shadow-sm">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="mb-4 text-dark">KosApp</h5>
            <p className="text-secondary">
              Platform pencarian kos terpercaya dengan ribuan pilihan kos di
              seluruh Indonesia.
            </p>
            <div className="d-flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary fs-5 social-link"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary fs-5 social-link"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary fs-5 social-link"
              >
                <FaFacebook />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary fs-5 social-link"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="mb-4 text-dark">Tautan Cepat</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-secondary text-decoration-none">
                  Beranda
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/search"
                  className="text-secondary text-decoration-none"
                >
                  Cari Kos
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/about"
                  className="text-secondary text-decoration-none"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="mb-4 text-dark">Hubungi Kami</h6>
            <ul className="list-unstyled text-secondary">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                Jl. Example No. 123, Jakarta
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                (021) 1234-5678
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                info@kosapp.com
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="mb-4 text-dark">Newsletter</h6>
            <p className="text-secondary">Dapatkan info terbaru dari kami</p>
            <form className="mb-3">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  aria-label="Email address"
                />
                <button className="btn btn-primary" type="submit">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-md-0 text-secondary">
              © {new Date().getFullYear()} KosApp. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link
              to="/privacy"
              className="text-secondary text-decoration-none me-3"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-secondary text-decoration-none">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
