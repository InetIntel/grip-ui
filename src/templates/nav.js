import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import lab_logo from '../images/logos/iil_logo.png';

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div className="header">
      <div className="header__container">
        <div
          className="header__burger"
          onClick={toggleMobileMenu}
        >
          &#9776;
        </div>
        <nav
          className={`header__nav ${
            mobileOpen ? 'header__nav--mobile-open' : ''
          }`}
        >
          <ul className="header__list">
            <li className="header__item">
              <Link
                to="/"
                className={`header__link ${
                  location.pathname === '/' ? 'header__link--active' : ''
                }`}
                onClick={closeMobileMenu}
              >
                Events
              </Link>
            </li>
            <li className="header__item">
              <Link
                to="/ack"
                className={`header__link ${
                  location.pathname === '/ack' ? 'header__link--active' : ''
                }`}
                onClick={closeMobileMenu}
              >
                Acknowledgements
              </Link>
            </li>
            <li className="header__item">
              <Link
                to="/about"
                className={`header__link ${
                  location.pathname === '/about' ? 'header__link--active' : ''
                }`}
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
            <li className="header__item">
              <Link
                to="/contacts"
                className={`header__link ${
                  location.pathname === '/contacts' ? 'header__link--active' : ''
                }`}
                onClick={closeMobileMenu}
              >
                Contacts
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Nav;
