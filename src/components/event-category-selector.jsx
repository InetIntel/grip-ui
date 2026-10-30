/*
 * This software is Copyright (c) 2015 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

import PropTypes from 'prop-types';
import React from 'react';
import {ToggleButton, ToggleButtonGroup} from 'react-bootstrap';

function EventCategorySelector({category, onChange}) {
    // onClick hax due to https://github.com/react-bootstrap/react-bootstrap/issues/2734
    const changeCategory = (e) => {
        let target = e.currentTarget.htmlFor;
        if (target === "incidents_sub") {
            target = "incidents";
        }
        if (target !== "") {
            onChange(target);
        }
    };

    const isIncident = ["incidents", "misconfigurations", "suspicious", "unclassified"].includes(category);
    const topValue = isIncident ? 'incidents' : category;

    return(
            <div className="search-bar__component">
                <label className="search-bar__label">
                    Select an event category
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* onClick hax due to https://github.com/react-bootstrap/react-bootstrap/issues/2734 */}
                    <ToggleButtonGroup type="radio" name="categoryTop" value={topValue}>
                        <ToggleButton variant="primary" value='all' id='all'
                                      onClick={changeCategory}>All</ToggleButton>
                        <ToggleButton variant="success" value='legitimate' id='legitimate'
                                      onClick={changeCategory}>Legitimate</ToggleButton>
                        <ToggleButton variant="danger" value='incidents' id='incidents'
                                      onClick={changeCategory}>Incidents</ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup type="radio" name="categoryBottom" value={category}>
                        <ToggleButton variant="danger" value='incidents' id='incidents_sub'
                                      onClick={changeCategory}>All Incidents</ToggleButton>
                        <ToggleButton variant="warning" value='misconfigurations' id='misconfigurations'
                                      onClick={changeCategory}>Misconfigurations</ToggleButton>
                        <ToggleButton variant="danger" value='suspicious' id='suspicious'
                                      onClick={changeCategory}>Suspicious</ToggleButton>
                        <ToggleButton variant="secondary" value='unclassified' id='unclassified'
                                      onClick={changeCategory}>Unclassified</ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
    );
}

EventCategorySelector.propTypes = {
    eventType: PropTypes.string,
    onChange: PropTypes.func
};

EventCategorySelector.defaultProps = {
    eventType: 'suspicious',
    onChange: () => {}
};

export default EventCategorySelector;
