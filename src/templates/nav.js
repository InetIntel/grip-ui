import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import lab_logo from '../images/logos/iil_logo.png';

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
        };
    }

    toggleMobileMenu = () => {
        this.setState(
            (prevState) => ({ mobileOpen: !prevState.mobileOpen })
        );
    };
    closeMobileMenu = () => {
        this.setState({ mobileOpen: false });
    };

    render() {
        const { mobileOpen } = this.state;
        const { location } = this.props;

        return (
            <div className="header">
                <div className="header__container">
                    {/* <div className="header__logo"> */}
                    {/*    <Link to="/"> */}
                    {/*        <img src={iodaLogo} alt={iodaLogoAltText} /> */}
                    {/*        Home */}
                    {/*    </Link> */}
                    {/* </div> */}
                    <div className="header__logo">
                        <a target='_blank' href="https://inetintel.notion.site/" className="header__logo-link">
                            <img src={lab_logo} alt="Logo" className="header__logo-image" />
                            <p className="header__logo-text">Internet{'\n'}Intelligence{'\n'}Lab</p>
                        </a>
                    </div>
                    <div
                        className="header__burger"
                        onClick={this.toggleMobileMenu}
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
                                    className={`header__link ${location.pathname === '/' ? 'header__link--active' : ''}`}
                                    onClick={this.closeMobileMenu}
                                >
                                    Events
                                </Link>
                            </li>
                            <li className="header__item">
                                <Link 
                                    to="/ack" 
                                    className={`header__link ${location.pathname === '/ack' ? 'header__link--active' : ''}`}
                                    onClick={this.closeMobileMenu}
                                >
                                    Acknowledgements
                                </Link>
                            </li>
                            <li className="header__item">
                                <Link 
                                    to="/about" 
                                    className={`header__link ${location.pathname === '/about' ? 'header__link--active' : ''}`}
                                    onClick={this.closeMobileMenu}
                                >
                                    About
                                </Link>
                            </li>
                            <li className="header__item">
                                <Link 
                                    to="/contacts" 
                                    className={`header__link ${location.pathname === '/contacts' ? 'header__link--active' : ''}`}
                                    onClick={this.closeMobileMenu}
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
}

export default withRouter(Nav);
