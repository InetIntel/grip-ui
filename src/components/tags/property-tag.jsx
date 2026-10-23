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
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { convertTagName } from "../../utils/tags";
import axios from "axios";
import { TAGS_URL } from "../../utils/endpoints";
import Badge from "react-bootstrap/Badge";
import 'bootstrap/dist/css/bootstrap.min.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const TYPE_VARIANTS = {
    suspicious: "warning",
    yes: "warning",
    benign: "success",
    no: "success",
    grey: "secondary",
    na: "secondary",
    unknown: "secondary",
};

const translateType = (type) => TYPE_VARIANTS[type] ?? "default";

const badgeStyle = {
    display: "inline-block",
    width: "10em",
    whiteSpace: "normal",
    wordWrap: "break-word",
};

const PropertyTag = ({ name: rawName, type: rawType = "na", definition }) => {
    const name = convertTagName(rawName);
    const type = translateType(rawType);
    const textColor = type === "warning" ? "dark" : "light";

    const parts = window.location.pathname.split("/");
    const loc = parts.indexOf("events");
    const eventType = loc > 0 ? parts[loc + 1] : "all";

    const search = `?tags=${rawName}&min_susp=0&max_susp=100&event_type=${eventType}`;

    return (
        <Link
            to={{ pathname: "/", search }}
            replace={true}
            target="_blank"
        >
            <OverlayTrigger
                key={name}
                placement="top"
                overlay={<Tooltip id={`tooltip-${name}`}>{definition}</Tooltip>}
            >
                <Badge bg={type} text={textColor} style={badgeStyle}>
                    <FontAwesomeIcon icon={faInfoCircle} /> {name}
                </Badge>
            </OverlayTrigger>
        </Link>
    );
};

PropertyTag.propTypes = {
    name: PropTypes.string,
    /**
     * type of the tag labels:
     * - default: na tag (grey)
     * - success: no tag (green)
     * - danger: yes tag (red)
     */
    type: PropTypes.string,
    definition: PropTypes.string,
};

export default PropertyTag;

const NestedTag = ({
    name,
    type = "na",
    tags = [],
    definition,
    nestedTagDefinitions = {},
    tagDefinitions = {},
    enableClick = true,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const familyDefinition = definition ?? nestedTagDefinitions[name]?.definition ?? nestedTagDefinitions[name] ?? "";
    const badgeType = translateType(type);
    const textColor = badgeType === "warning" ? "dark" : "light";
    const tooltipId = `nested-tag-tooltip-${name.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

    return (
        <div className="nested-tag">
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={tooltipId}>{familyDefinition}</Tooltip>}
            >
                <button
                    type="button"
                    className="btn p-0 border-0 bg-transparent"
                    aria-expanded={isExpanded}
                    disabled={!enableClick}
                    onClick={() => setIsExpanded((expanded) => !expanded)}
                >
                    <Badge bg={badgeType} text={textColor} style={badgeStyle}>
                        <FontAwesomeIcon icon={faInfoCircle} /> {convertTagName(name)}
                        <span className="ms-1" aria-hidden="true">{isExpanded ? "−" : "+"}</span>
                    </Badge>
                </button>
            </OverlayTrigger>
            {isExpanded && (
                <div className="nested-tag-children" role="group" aria-label={`${convertTagName(name)} tags`}>
                    {tags.map((tag) => {
                        const tagName = typeof tag === "string" ? tag : tag.name;
                        if (!tagName) return null;

                        return (
                            <PropertyTag
                                key={tagName}
                                name={tagName}
                                type={tag.type ?? "na"}
                                definition={tagDefinitions[tagName]?.definition ?? tagDefinitions[tagName] ?? ""}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

NestedTag.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            name: PropTypes.string,
            type: PropTypes.string,
        }),
    ])),
    definition: PropTypes.string,
    nestedTagDefinitions: PropTypes.object,
    tagDefinitions: PropTypes.object,
    enableClick: PropTypes.bool,
};

/**
 * Render a list of tags from a event or a prefix event.
 *
 * This component is responsible for both loading tags information from remote, and render tag combinations
 * based on their nature.
 */
const PropertyTagsList = ({ tags = {}, enableClick = true }) => {
    const [tagDefinitions, setTagDefinitions] = useState({});
    const [nestedTagDefinitions, setNestedTagDefinitions] = useState({});

    useEffect(() => {
        const loadTagsData = async () => {
            try {
                const response = await axios.get(TAGS_URL);
                setTagDefinitions(response.data.definitions ?? {});
                setNestedTagDefinitions(response.data.nested_tag_descriptions ?? {});
            } catch (err) {
                // Do nothing, just leave tagDefinitions as empty object
            }
        };

        loadTagsData();
    }, []);

    return (
        <div className="tags-list">
            {Object.entries(tags).map(([familyName, familyTags]) => {
                if (Array.isArray(familyTags) && familyTags.length > 0) {
                    return (
                        <PropertyTag
                            key={familyName}
                            name={familyName}
                            type={familyTags}
                            definition={tagDefinitions[familyName]?.definition ?? ""}
                        />
                    );
                }

                const childTags = Object.entries(familyTags ?? {}).map(([tagName, type]) => ({ name: tagName, type }));

                if (familyName === "other") {
                    return childTags.map((tag) => (
                        <PropertyTag
                            key={tag.name}
                            name={tag.name}
                            type={tag.type}
                            definition={tagDefinitions[tag.name]?.definition ?? ""}
                        />
                    ));
                }

                return (
                    <NestedTag
                        key={`tag-family-${familyName}`}
                        name={familyName}
                        tags={childTags}
                        nestedTagDefinitions={nestedTagDefinitions}
                        tagDefinitions={tagDefinitions}
                        enableClick={enableClick}
                    />
                );
            })}
        </div>
    );
};

PropertyTagsList.propTypes = {
    tags: PropTypes.object,
    enableClick: PropTypes.bool,
};


export { NestedTag, PropertyTag, PropertyTagsList };