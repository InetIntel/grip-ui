
/*
 * Portions of this source code are Copyright (c) 2021 Georgia Tech Research
 * Corporation. All Rights Reserved. Permission to copy, modify, and distribute
 * this software and its documentation for academic research and education
 * purposes, without fee, and without a written agreement is hereby granted,
 * provided that the above copyright notice, this paragraph and the following
 * three paragraphs appear in all copies. Permission to make use of this
 * software for other than academic research and education purposes may be
 * obtained by contacting:
 *
 *  Office of Technology Licensing
 *  Georgia Institute of Technology
 *  926 Dalney Street, NW
 *  Atlanta, GA 30318
 *  404.385.8066
 *  techlicensing@gtrc.gatech.edu
 *
 * This software program and documentation are copyrighted by Georgia Tech
 * Research Corporation (GTRC). The software program and documentation are
 * supplied "as is", without any accompanying services from GTRC. GTRC does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for
 * research purposes and is advised not to rely exclusively on the program for
 * any reason.
 *
 * IN NO EVENT SHALL GEORGIA TECH RESEARCH CORPORATION BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING
 * LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION,
 * EVEN IF GEORGIA TECH RESEARCH CORPORATION HAS BEEN ADVISED OF THE POSSIBILITY
 * OF SUCH DAMAGE. GEORGIA TECH RESEARCH CORPORATION SPECIFICALLY DISCLAIMS ANY
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED
 * HEREUNDER IS ON AN "AS IS" BASIS, AND  GEORGIA TECH RESEARCH CORPORATION HAS
 * NO OBLIGATIONS TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import T from "i18n-react";
// import gripLogo from "images/logos/grip-logo.svg";

import { Select, Tooltip, Switch, Button, Drawer } from "antd";
import {
  getSavedLanguagePreference,
  saveLanguagePreference,
} from "../utils/storage";
import { changeLanguage } from "../utils/strings";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

const languageOptions = [
  { value: "en", label: "English" },
];

const Header = () => {
  const [language, setLanguage] = useState(getSavedLanguagePreference());
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawerMenu = () => {
    setShowDrawer(!showDrawer);
  };

  const handleLanguageChange = (language) => {
    setLanguage(language);
    saveLanguagePreference(language);
    changeLanguage(language);
    window.location.reload();
  };

  const events = T.translate("header.events");
  const acknowledgements = T.translate("header.acknowledgements");
  const about = T.translate("header.about");
  const contacts = T.translate("header.contacts");

  return (
    <div className="header">
      <div className="header__container p-6 max-cont row items-center">
        <div className="header__drawer-icon">
          <Button icon={<MenuOutlined />} onClick={toggleDrawerMenu} />
        </div>
        {/* <div className="header__logo mr-auto">
          <Link to="/">
            <img src={gripLogo} alt={gripLogoAltText} width="97" />
          </Link>
        </div> */}
        <div className="header__item">
          <Link to="/" className="a-header">
            {events}
          </Link>
        </div>
        <div className="header__item">
          <Link to="/ack" className="a-header">
            {acknowledgements}
          </Link>
        </div>
        <div className="header__item">
          <Link to="/about" className="a-header">
            {about}
          </Link>
        </div>

        <div className="header__item">
          <a href="/contacts" className="a-header">
            {contacts}
          </a>
        </div>

        <div className="header__item">
          <Select
            value={language}
            style={{ width: 100 }}
            className="ml-md"
            onChange={handleLanguageChange}
            options={languageOptions}
            popupClassName="header__language-select"
          />
        </div>


      </div>

      {/* DRAWER MENU */}
      <Drawer
        placement="left"
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        className="header__drawer-body"
        closeIcon={
          <CloseOutlined style={{ fontSize: "16px", color: "#fff" }} />
        }
        // extra={
        //   <Link to="/" onClick={() => setShowDrawer(false)}>
        //     <img src={gripLogo} alt={gripLogoAltText} width="97" height="35" />
        //   </Link>
        // }
        width={320}
      >
        <div className="header__drawer-item">
          <Link
            to="/dashboard"
            className="a-header"
            onClick={() => setShowDrawer(false)}
          >
            {events}
          </Link>
        </div>

        <div
          className="header__drawer-item mt-6 pt-6"
          style={{ borderTop: "1px solid gray" }}
        >
          <Select
            value={language}
            style={{ width: 100 }}
            className="ml-md"
            onChange={handleLanguageChange}
            options={languageOptions}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
