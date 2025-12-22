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
	abbreviateStringToLength,
	tooltipGenerator
} from "./utils/AsnUtils";
import UnknownFlag from "../images/UnknownFlag.png";

function AsnLabel({ asn, data }) {
	//! TODO: shift this to a config file
	const ASRANK_URL = "https://asrank.caida.org/asns?asn=";

	const asNumber = Number.parseInt(asn, 10);

	const isPrivateAsNumber = isPrivateASN(asNumber);
	const onBlacklist = data.blacklist?.includes(asNumber);
	const onAsndrop = data.asndrop?.includes(asNumber);

	const asStatus = {
		isPrivateAsNumber,
		onBlacklist,
		onAsndrop
	}

	const tooltipTextList = tooltipGenerator(asNumber, data, asStatus);

	// TODO: consider loading data from asrank api if props.data is not available

	const asOrg = data[asNumber]?.asrank || '';
	const countryCode = asOrg?.organization?.country?.iso;
	const countryFlag = countryCodeToFlagEmoji(countryCode);

	const fullName = asOrg?.organization?.orgName || "";
	const shortName = abbreviateStringToLength(fullName, 22);
	const asLabel = `AS${asNumber} ${shortName}`.trim();

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
					{tooltipTextList}
				</Tooltip>
			}
		>
			<span className="asn-label">
				<span className="asn__country">
					{countryFlag || (
						<img src={UnknownFlag} alt="<?>" className="asn__flag" />
					)}
					<a href={ASRANK_URL + asNumber} target="_blank" rel="noopener noreferrer">
						{asLabel}
						{spanLabel.length > 0 && <b> ({spanLabel}) </b>}
					</a>
				</span>
			</span>
		</OverlayTrigger>
	)
}

AsnLabel.propTypes = {
	asn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	data: PropTypes.object
};

export default AsnLabel;