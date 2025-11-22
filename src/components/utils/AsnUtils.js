function countryCodeToFlagEmoji(countryCode) {
	// Convert country code to corresponding emoji flag
	//
	// Input: 
	//   country_code: string, 2-letter country code
	// Output:
	//   string: emoji flag or empty string if invalid input

	const EMOJI_OFFSET = 127397;
	const countryCodeUpperCase = country_code.toUpperCase();

	if (typeof countryCode !== 'string' 
			&& !/^[A-Z]{2}$/.test(countryCodeUpperCase)) {
		return "";
	}

	return String.fromCodePoint(...[...countryCodeUpperCase].map(
		c => c.codePointAt() + EMOJI_OFFSET)
	);
}

function abbrieviate(string, abbrieviationLength) {
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
	countryCodeToFlagEmoji,
	abbrieviateString
};