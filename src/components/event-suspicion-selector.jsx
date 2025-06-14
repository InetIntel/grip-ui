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

function EventSuspicionSelector({eventSuspicionLevel, onChange}) {
    // onClick hax due to https://github.com/react-bootstrap/react-bootstrap/issues/2734
    const changeEventSuspicionLevel = (e) => {
        const target = e.currentTarget.htmlFor;
        if (target !== "") {
            onChange(target);
        }
    };

    return(
            <div className="search-bar__component">
                <label className="search-bar__label">
                    Select an event suspicion level
                </label>
                {/* onClick hax due to https://github.com/react-bootstrap/react-bootstrap/issues/2734 */}
                <ToggleButtonGroup type="radio" name="eventSuspicionLevel"
                                   value={eventSuspicionLevel}
                >
                    <ToggleButton value='all' id='all'
                                  onClick={changeEventSuspicionLevel}>All</ToggleButton>
                    <ToggleButton value='suspicious' id='suspicious'
                                  onClick={changeEventSuspicionLevel}>Suspicious</ToggleButton>
                    <ToggleButton value='grey' id='grey'
                                  onClick={changeEventSuspicionLevel}>Grey</ToggleButton>
                    <ToggleButton value='benign' id='benign'
                                  onClick={changeEventSuspicionLevel}>Benign</ToggleButton>
                </ToggleButtonGroup>
            </div>
    );
}

EventSuspicionSelector.propTypes = {
    eventType: PropTypes.string,
    onChange: PropTypes.func
};

EventSuspicionSelector.defaultProps = {
    eventType: 'suspicious',
    onChange: () => {}
};

export default EventSuspicionSelector;
