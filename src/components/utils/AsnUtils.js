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
	const countryCodeUpperCase = countryCode.toUpperCase();

	if (typeof countryCode !== 'string'
		&& !/^[A-Z]{2}$/.test(countryCodeUpperCase)) {
		return "";
	}

	return String.fromCodePoint(...[...countryCodeUpperCase].map(
		c => c.codePointAt() + EMOJI_OFFSET)
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

	const prefix = string.substring(0, prefixLetterCount);
	const suffix = string.substring(
		string.length - (totalLetterCount - prefixLetterCount)
	);

	return prefix + separator + suffix;
}

export default {
	isPrivateASN,
	countryCodeToFlagEmoji,
	abbrieviateStringToLength
};