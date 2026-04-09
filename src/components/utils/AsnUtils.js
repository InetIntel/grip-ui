/*
# This source code is Copyright (c) 2026 Georgia Tech Research Corporation. All
# Rights Reserved. Permission to copy, modify, and distribute this software and
# its documentation for academic research and education purposes, without fee,
# and without a written agreement is hereby granted, provided that the above
# copyright notice, this paragraph and the following three paragraphs appear in
# all copies. Permission to make use of this software for other than academic
# research and education purposes may be obtained by contacting:
#
#  Office of Technology Licensing
#  Georgia Institute of Technology
#  926 Dalney Street, NW
#  Atlanta, GA 30318
#  404.385.8066
#  techlicensing@gtrc.gatech.edu
#
# This software program and documentation are copyrighted by Georgia Tech
# Research Corporation (GTRC). The software program and documentation are 
# supplied "as is", without any accompanying services from GTRC. GTRC does
# not warrant that the operation of the program will be uninterrupted or
# error-free. The end-user understands that the program was developed for
# research purposes and is advised not to rely exclusively on the program for
# any reason.
#
# IN NO EVENT SHALL GEORGIA TECH RESEARCH CORPORATION BE LIABLE TO ANY PARTY FOR
# DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING
# LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION,
# EVEN IF GEORGIA TECH RESEARCH CORPORATION HAS BEEN ADVISED OF THE POSSIBILITY
# OF SUCH DAMAGE. GEORGIA TECH RESEARCH CORPORATION SPECIFICALLY DISCLAIMS ANY
# WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
# MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED
# HEREUNDER IS ON AN "AS IS" BASIS, AND  GEORGIA TECH RESEARCH CORPORATION HAS
# NO OBLIGATIONS TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
# MODIFICATIONS.
#
# This source code is part of the GRIP software. The original GRIP software is
# Copyright (c) 2015 The Regents of the University of California. All rights
# reserved. Permission to copy, modify, and distribute this software for
# academic research and education purposes is subject to the conditions and
# copyright notices in the source code files and in the included LICENSE file.
*/

function isInRange(value, min, max) {
	return value >= min && value <= max;
}

export function isPrivateASN(asn) {
	return isInRange(asn, 64512, 65534) || isInRange(asn, 4200000000, 4294967294);
}

export function countryCodeToFlagEmoji(countryCode) {
	// Convert country code to corresponding emoji flag
	// Outputs the corresponding emoji flag, or empty string if invalid input

	const EMOJI_OFFSET = 127397;
	
	if (typeof countryCode !== 'string') {
		return '';
	}

	const countryCodeUpperCase = countryCode.toUpperCase();

	if (!/^[A-Z]{2}$/.test(countryCodeUpperCase)) {
		return '';
	}

	return String.fromCodePoint(
		...[...countryCodeUpperCase].map(
			c => c.codePointAt() + EMOJI_OFFSET
		)
	);
}

export function abbreviateStringToLength(string, abbrieviationLength) {
	let prefixStringLengthPercentage = 0.7;
	let separator = '...';

	if (string.length <= abbrieviationLength ||
		abbrieviationLength <= separator.length) {
		return string;
	}

	const totalLetterCount = abbrieviationLength - separator.length;
	const prefixLetterCount = Math.floor(
		totalLetterCount * prefixStringLengthPercentage
	);
	const suffixLetterCount = totalLetterCount - prefixLetterCount;

	const prefix = string.substring(0, prefixLetterCount);
	const suffix = string.substring(
		string.length - suffixLetterCount, string.length
	);

	return prefix + separator + suffix;
}

export function tooltipGenerator(asn, asInfo, asStatus) {
	let res = [];

	const { isPrivateAsNumber, onBlacklist, onAsndrop } = asStatus;

	if (isPrivateAsNumber) res.push("Private AS Number");
	if (onBlacklist) res.push("AS is on a blacklist");
	if (onAsndrop) res.push("AS is on Spamhaus ASN DROP list");

	const asrank = asInfo[asn]?.asrank;
	if (asrank?.organization?.country?.name) {
		const org_name = asrank.asnName?.replaceAll('"', "");
		if (org_name) {
			res.push(
				`ASN: ${asn}`,
				`Name: ${org_name}`,
				`Country: ${asrank.organization.country.name}`,
				`Rank: ${asrank.rank}`
			);
		}
	}

	if ("hegemony" in asInfo && asn in asInfo.asrank) {
		res.push(`Hegemony: ${asInfo.hegemony[asn]}`);
	}
	if (res.length === 0) {
		res.push("AS Info Unavailable");
	}

	// Tying key to the item since items are unique, and to avoid key 
	// warnings in sonarqube

	return (
		<>
			{res.map((item) => (<p key={item}>{item}</p>))}
		</>
	);
}

export default {
	isPrivateASN,
	countryCodeToFlagEmoji,
	abbreviateStringToLength,
	tooltipGenerator
};
