import T from "i18n-react";
import { getSavedLanguagePreference } from "./storage";

export const changeLanguage = (language) => {
	let languageString = "en";
	switch (language) {
		case "en":
			languageString = "en";
			break;
		default:
			languageString = "en";
			break;
	}

	// Load selected language strings dynamically
	let strings = Object.assign({}, require(`../locales/${languageString}.json`));

	// Load default english strings
	let defaultStrings = Object.assign({}, require(`../locales/en.json`));

	T.setTexts(strings, {
		notFound: (key) => {
			const defaultStringLocation = key.split(".");
			let defaultString = defaultStrings;
			for (var i = 0; i < defaultStringLocation.length; i++) {
				if (defaultString) {
					defaultString = defaultString[defaultStringLocation[i]];
				}
			}
			return `${defaultString || key}`;
		},
	});
};

changeLanguage(getSavedLanguagePreference());
