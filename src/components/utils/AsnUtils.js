import * as React from "react";

function isInRange(value, min, max) {
	return value >= min && value <= max;
}

export function isPrivateASN(asn) {
	return isInRange(asn, 64512, 65534) || isInRange(asn, 4200000000, 4294967294);
}

export function countryCodeToFlagEmoji(countryCode) {
	// Convert country code to corresponding emoji flag
	//
	// Input: 
	//   countryCode: string, 2-letter country code
	// Output:
	//   string: emoji flag or empty string if invalid input

	const EMOJI_OFFSET = 127397;

	if (typeof countryCode !== 'string') {
		return "";
	}

	const countryCodeUpperCase = countryCode.toUpperCase();

	if (!/^[A-Z]{2}$/.test(countryCodeUpperCase)) {
		return "";
	}

	return String.fromCodePoint(
		...[...countryCodeUpperCase].map(
			c => c.codePointAt() + EMOJI_OFFSET
		)
	);
}

export function abbrieviateStringToLength(string, abbrieviationLength) {
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

export function tooltipGenerator(asn, asinfo, is_private, on_blacklist, on_asndrop) {
	let res = [];

	if (is_private) res.push("Private AS Number");
	if (on_blacklist) res.push("AS is on a blacklist");
	if (on_asndrop) res.push("AS is on Spamhaus ASN DROP list");

	const asrank = asinfo[asn]?.asrank;
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

	if ("hegemony" in asinfo && asn in asinfo.asrank) {
		res.push(`Hegemony: ${asinfo.hegemony[asn]}`);
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
	abbrieviateStringToLength,
	tooltipGenerator
};