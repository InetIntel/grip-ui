import * as React from "react";

function isInRange(value, min, max) {
	return value >= min && value <= max;
}

export function isPrivateASN(asn) {
	return isInRange(asn, 64512, 65534) || isInRange(asn, 4200000000, 4294967294);
}

export function countryCodeToFlagEmoji(countryCode) {
	// Convert country code to corresponding emoji flag
	// Outputs the corresponding emoji flag or white flag if invalid input

	const EMOJI_OFFSET = 127397;
	const WHITE_FLAG = '\u{1F3F3}'; 
	
	if (typeof countryCode !== 'string') {
		return WHITE_FLAG;
	}

	const countryCodeUpperCase = countryCode.toUpperCase();

	if (!/^[A-Z]{2}$/.test(countryCodeUpperCase)) {
		return WHITE_FLAG;
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