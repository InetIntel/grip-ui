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

import PropTypes from "prop-types";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {convertTagName} from "../../utils/tags";

import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'


function InferenceTag(props) {
    let labels = props.labels || [];
    let type;
    if (labels.includes("legitimate")) {
        type = ["success", "thumbs-up"];
    } else if (labels.includes("suspicious")) {
        type = ["danger", "thumbs-down"];
    } else if (labels.includes("misconfig")) {
        type = ["warning", "exclamation-triangle"];
    } else {
        type = ["secondary", "question-circle"];
    }

    let name = convertTagName(props.name);
    let textColor = type[0] === "warning" ? "dark" : "light";
    let badgeStyle = {
        display: 'inline-block',
        width: '16em',
        padding: '8px 12px',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    };

    return (
        <div>
            <OverlayTrigger
                key={name}
                placement={"top"}
                overlay={
                    <Tooltip id={`tooltip-${name}`}>
                        {props.explanation}
                    </Tooltip>
                }
            >
            <Badge bg={type[0]} text={textColor} style={badgeStyle}>
                <FontAwesomeIcon icon={faLightbulb} />
                {" "}
                {name}
                {props.render_level && props.labels.length > 0 && ` (${props.labels.join(', ')})` }
            </Badge>
            </OverlayTrigger>
            {props.render_explanation &&
                <p><i>{props.explanation}</i></p>
            }
        </div>
    );
}

InferenceTag.propTypes = {
    name: PropTypes.string,
    suspicion_level: PropTypes.number,
    explanation: PropTypes.string,
    render_level: PropTypes.bool,
    render_explanation: PropTypes.bool,
};

InferenceTag.defaultProps = {
    render_level: true,
    render_explanation: false,
    labels: [],
};


/**
 * Render a list of tags from a event or a prefix event.
 *
 * This component is responsible for both loading tags information from remote, and render tag combinations
 * based on their nature.
 */
function InferenceTagsList(props) {
    return (
        <div className="inferences-list">
            {props.inferences.map(inference => (
                <InferenceTag key={`inference-${inference.inference_id}`}
                               name={inference.inference_id}
                               suspicion_level={inference.suspicion_level}
                               explanation={inference.explanation}
                               render_level={props.render_level}
                               render_explanation={props.render_explanation}
                               labels={inference.labels}
                />
            ))}
        </div>
    );
}

InferenceTagsList.propTypes = {
    render_level: PropTypes.bool,
    render_explanation: PropTypes.bool,
};

InferenceTagsList.defaultProps = {
    render_level: true,
    render_explanation: false,
};

export {InferenceTag, InferenceTagsList};