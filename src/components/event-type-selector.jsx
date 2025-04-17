import PropTypes from 'prop-types';
import React from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

function EventTypeSelector({ eventType, onChange }) {
    // onClick hax due to https://github.com/react-bootstrap/react-bootstrap/issues/2734
    const changeEventType = (e) => {
        const target = e.currentTarget.htmlFor;
        if (target !== "") {
            onChange(target);
        }
    };

    return (
        <div className="search-bar__component">
            <label className="search-bar__label">
                Select an event type
            </label>
            <ToggleButtonGroup type="radio" name="eventType" value={eventType}>
                <ToggleButton value="all" id="all" onClick={changeEventType}>
                    All
                </ToggleButton>
                <ToggleButton value="moas" id="moas" onClick={changeEventType}>
                    MOAS
                </ToggleButton>
                <ToggleButton value="submoas" id="submoas" onClick={changeEventType}>
                    Sub-MOAS
                </ToggleButton>
                <ToggleButton value="edges" id="edges" onClick={changeEventType}>
                    New Edge
                </ToggleButton>
                <ToggleButton value="defcon" id="defcon" onClick={changeEventType}>
                    Defcon
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}

EventTypeSelector.propTypes = {
    eventType: PropTypes.string,
    onChange: PropTypes.func
};

EventTypeSelector.defaultProps = {
    eventType: 'moas',
    onChange: () => {}
};

export default EventTypeSelector;
