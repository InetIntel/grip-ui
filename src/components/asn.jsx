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

import * as React from "react";
import PropTypes from 'prop-types';

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { 
    isPrivateASN, 
    countryCodeToFlagEmoji, 
    abbrieviateStringToLength 
} from "./utils/AsnUtils";

function AsNumber({ asn, data }) {
    //! TODO: shift this to a config file
    const ASRANK_URL = "https://asrank.caida.org/asns?asn=";

    function tooltip(asn, asinfo, is_private, on_blacklist, on_asndrop) {
        let res = [];
        let count = 0;
        if (is_private) {
            res.push(<p key={`tooltip-${count++}`}>Private AS Number</p>);
        }
        if (on_blacklist) {
            res.push(<p key={`tooltip-${count++}`}>AS is on a blacklist</p>)
        }
        if (on_asndrop) {
            res.push(<p key={`tooltip-${count++}`}>AS is on Spamhaus ASN DROP list</p>)
        }
        if (asinfo[asn]?.asrank?.organization?.country) {
            let asorg = asinfo[asn].asrank;
            let country_name = asorg.organization.country.name;
            let org_name = asorg.organization.orgName;
            let rank = asorg.rank;
            if (org_name) {
                org_name = org_name.replaceAll('"', "");
                res.push(
                    <p key={`tooltip-${count++}`}> ASN: {asn} </p>,
                    <p key={`tooltip-${count++}`}> Name: {org_name} </p>,
                    <p key={`tooltip-${count++}`}> Country: {country_name} </p>,
                    <p key={`tooltip-${count++}`}> Rank: {rank} </p>
                );
            }
        }
        if ("hegemony" in asinfo && asn in asinfo.asrank) {
            res.push(<p key={`tooltip-${count++}`}> Hegemony: {asinfo.hegemony[asn]} </p>);
        }
        if (res.length === 0) {
            res.push(<p key={`tooltip-${count++}`}>AS Info Unavailable</p>);
        }
        return (<>{res}</>);
    }

    console.log(data);

    const asNumber = Number.parseInt(asn, 10);
    
    const isPrivateAsNumber = isPrivateASN(asNumber);
    const onBlacklist = data.blacklist?.includes(asNumber);
    const onAsndrop = data.asndrop?.includes(asNumber);

    // construct tooltip
    const tooltip_str = tooltip(asn, data, isPrivateAsNumber, onBlacklist, onAsndrop);
    console.log(tooltip_str);

    // TODO: consider loading data from asrank api if props.data is not available
    let asorg = null;
    if (data[asn]?.asrank) {
        asorg = data[asn].asrank;
    }

    let countryCode = asorg?.organization?.country.iso;
    let countryFlag = countryCodeToFlagEmoji(countryCode);

    let asFullName = asorg?.organization?.orgName || "";
    let asShortName = abbrieviateStringToLength(asFullName, 22);
    let ASLabel = `AS${asNumber} ${asShortName}`;

    const spanLabel =
        (isPrivateAsNumber && 'private') ||
        (onBlacklist && 'blacklist') ||
        (onAsndrop && 'asndrop') ||
        "";

    return (
        <OverlayTrigger
            key={asNumber}
            placement={"top"}
            overlay={
                <Tooltip id={`tooltip-${asNumber}`}>
                    {tooltip_str}
                </Tooltip>
            }
        >
            <a href={ASRANK_URL + asn} target="_blank" rel="noopener noreferrer">
                <span className="asn__country">{countryFlag}</span> {ASLabel}
                {spanLabel.length > 0 && 
                    <span className="badge badge-info"> {spanLabel} </span>
                }
            </a>
        </OverlayTrigger>
    )
}

AsNumber.propTypes = {
    asn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    data: PropTypes.object
};

export default AsNumber;