export type BaseCountry = {
	code: string;
	name: string;
	emoji: string;
	dial_country_code: string;
	dial_region_codes?: string[];
};

export type Country = Pick<
	BaseCountry,
	"code" | "name" | "emoji" | "dial_country_code"
> & {
	// the single region code for this entry
	dial_region_code?: string;
	// the dialing code for this entry (country code + region code if any)
	dialing_code: string;
};

/**
 * Helper to get the flag emoji for a given country code
 * @param {string} countryCode
 * @returns {string}
 */
const getFlagEmoji = (countryCode: string) => {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 0x1f1a5 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
};

/**
 * Convert a list of BaseCountries to a list of Countries a unique dialing code
 */
export const mapBaseCountriesToCountries = (baseCountries: BaseCountry[]) => {
	const countriesWithSingleRegionCode = baseCountries.flatMap(
		(baseCountry) => {
			const flatCountry = baseCountry.dial_region_codes
				? baseCountry.dial_region_codes.map((dial_region_code) => ({
						...baseCountry,
						dial_region_codes: [dial_region_code],
				  }))
				: [baseCountry];
			return flatCountry;
		}
	);
	const countries = countriesWithSingleRegionCode.map<Country>(
		(baseCountry) => {
			const { code, name, emoji, dial_country_code, dial_region_codes } =
				baseCountry;
			const dial_region_code = dial_region_codes?.[0];
			return {
				code,
				name,
				emoji,
				dial_country_code,
				dial_region_code,
				dialing_code: `${dial_country_code}${dial_region_code || ""}`,
			};
		}
	);
	return countries;
};

/**
 * Get the dialing code for a given phone number
 * @param phoneNumber
 */
export const getDialingCode = (phoneNumber?: string): string | undefined => {
	if (!phoneNumber) {
		return;
	}
	const maxDialingCodeLength = 5;
	const start = phoneNumber
		?.replace(/^(\+|00)/, "")
		.slice(0, maxDialingCodeLength);
	if (start) {
		const tree = start.split("");
		let testedDialingCode = tree.join("");
		let match = countriesMap.get(testedDialingCode);
		while (!match && tree.length) {
			tree.pop();
			testedDialingCode = tree.join("");
			match = countriesMap.get(testedDialingCode);
		}

		if (match && testedDialingCode) {
			return testedDialingCode;
		}
	}
};

/**
 * Get a country from a given phone number
 */
export const getCountryFromPhoneNumber = (
	phoneNumber?: string
): Country | undefined => {
	const dialingCode = getDialingCode(phoneNumber);
	if (dialingCode) {
		return countriesMap.get(dialingCode);
	}
};

/**
 * ISO 3166-1 countries (sovereign or not)
 */
export const countries: BaseCountry[] = [
	{
		code: "AD",
		name: "Andorra",
		dial_country_code: "376",
	},
	{
		code: "AE",
		name: "United Arab Emirates",
		dial_country_code: "971",
	},
	{
		code: "AF",
		name: "Afghanistan",
		dial_country_code: "93",
	},
	{
		code: "AG",
		name: "Antigua and Barbuda",
		dial_country_code: "1",
		dial_region_codes: ["268"],
	},
	{
		code: "AI",
		name: "Anguilla",
		dial_country_code: "1",
		dial_region_codes: ["264"],
	},
	{
		code: "AL",
		name: "Albania",
		dial_country_code: "355",
	},
	{
		code: "AM",
		name: "Armenia",
		dial_country_code: "374",
	},
	{
		code: "AO",
		name: "Angola",
		dial_country_code: "244",
	},
	{
		code: "AQ",
		name: "Antarctica",
		dial_country_code: "672",
	},
	{
		code: "AR",
		name: "Argentina",
		dial_country_code: "54",
	},
	{
		code: "AS",
		name: "American Samoa",
		dial_country_code: "1",
		dial_region_codes: ["684"],
	},
	{
		code: "AT",
		name: "Austria",
		dial_country_code: "43",
	},
	{
		code: "AU",
		name: "Australia",
		dial_country_code: "61",
	},
	{
		code: "AW",
		name: "Aruba",
		dial_country_code: "297",
	},
	{
		code: "AX",
		name: "Åland Islands",
		dial_country_code: "358",
		dial_region_codes: ["18"],
	},
	{
		code: "AZ",
		name: "Azerbaijan",
		dial_country_code: "994",
	},
	{
		code: "BA",
		name: "Bosnia and Herzegovina",
		dial_country_code: "387",
	},
	{
		code: "BB",
		name: "Barbados",
		dial_country_code: "1",
		dial_region_codes: ["246"],
	},
	{
		code: "BD",
		name: "Bangladesh",
		dial_country_code: "880",
	},
	{
		code: "BE",
		name: "Belgium",
		dial_country_code: "32",
	},
	{
		code: "BF",
		name: "Burkina Faso",
		dial_country_code: "226",
	},
	{
		code: "BG",
		name: "Bulgaria",
		dial_country_code: "359",
	},
	{
		code: "BH",
		name: "Bahrain",
		dial_country_code: "973",
	},
	{
		code: "BI",
		name: "Burundi",
		dial_country_code: "257",
	},
	{
		code: "BJ",
		name: "Benin",
		dial_country_code: "229",
	},
	{
		code: "BL",
		name: "Saint Barthélemy",
		dial_country_code: "590",
	},
	{
		code: "BM",
		name: "Bermuda",
		dial_country_code: "1",
		dial_region_codes: ["441"],
	},
	{
		code: "BN",
		name: "Brunei Darussalam",
		dial_country_code: "673",
	},
	{
		code: "BO",
		name: "Bolivia",
		dial_country_code: "591",
	},
	{
		code: "BQ",
		name: "Bonaire, Sint Eustatius and Saba",
		dial_country_code: "599",
	},
	{
		code: "BR",
		name: "Brazil",
		dial_country_code: "55",
	},
	{
		code: "BS",
		name: "Bahamas",
		dial_country_code: "1",
		dial_region_codes: ["242"],
	},
	{
		code: "BT",
		name: "Bhutan",
		dial_country_code: "975",
	},
	{
		code: "BV",
		name: "Bouvet Island",
		dial_country_code: "47",
	},
	{
		code: "BW",
		name: "Botswana",
		dial_country_code: "267",
	},
	{
		code: "BY",
		name: "Belarus",
		dial_country_code: "375",
	},
	{
		code: "BZ",
		name: "Belize",
		dial_country_code: "501",
	},
	{
		code: "CA",
		name: "Canada",
		dial_country_code: "1",
		dial_region_codes: [
			"587",
			"403",
			"780",
			"819",
			"902",
			"226",
			"519",
			"289",
			"905",
			"438",
			"514",
			"343",
			"613",
			"418",
			"581",
			"306",
			"705",
			"249",
			"600",
			"506",
			"709",
			"450",
			"579",
			"807",
			"647",
			"416",
			"236",
			"778",
			"604",
			"250",
			"204",
			"867",
		],
	},
	{
		code: "CC",
		name: "Cocos (Keeling) Islands",
		dial_country_code: "61",
	},
	{
		code: "CD",
		name: "Congo",
		dial_country_code: "243",
	},
	{
		code: "CF",
		name: "Central African Republic",
		dial_country_code: "236",
	},
	{
		code: "CG",
		name: "Congo",
		dial_country_code: "242",
	},
	{
		code: "CH",
		name: "Switzerland",
		dial_country_code: "41",
	},
	{
		code: "CI",
		name: "Côte D'Ivoire",
		dial_country_code: "225",
	},
	{
		code: "CK",
		name: "Cook Islands",
		dial_country_code: "682",
	},
	{
		code: "CL",
		name: "Chile",
		dial_country_code: "56",
	},
	{
		code: "CM",
		name: "Cameroon",
		dial_country_code: "237",
	},
	{
		code: "CN",
		name: "China",
		dial_country_code: "86",
	},
	{
		code: "CO",
		name: "Colombia",
		dial_country_code: "57",
	},
	{
		code: "CR",
		name: "Costa Rica",
		dial_country_code: "506",
	},
	{
		code: "CU",
		name: "Cuba",
		dial_country_code: "53",
	},
	{
		code: "CV",
		name: "Cape Verde",
		dial_country_code: "238",
	},
	{
		code: "CW",
		name: "Curaçao",
		dial_country_code: "599",
	},
	{
		code: "CX",
		name: "Christmas Island",
		dial_country_code: "61",
		dial_region_codes: ["89164"],
	},
	{
		code: "CY",
		name: "Cyprus",
		dial_country_code: "357",
	},
	{
		code: "CZ",
		name: "Czech Republic",
		dial_country_code: "420",
	},
	{
		code: "DE",
		name: "Germany",
		dial_country_code: "49",
	},
	{
		code: "DJ",
		name: "Djibouti",
		dial_country_code: "253",
	},
	{
		code: "DK",
		name: "Denmark",
		dial_country_code: "45",
	},
	{
		code: "DM",
		name: "Dominica",
		dial_country_code: "1",
		dial_region_codes: ["767"],
	},
	{
		code: "DO",
		name: "Dominican Republic",
		dial_country_code: "1",
		dial_region_codes: ["809", "829", "849"],
	},
	{
		code: "DZ",
		name: "Algeria",
		dial_country_code: "213",
	},
	{
		code: "EC",
		name: "Ecuador",
		dial_country_code: "593",
	},
	{
		code: "EE",
		name: "Estonia",
		dial_country_code: "372",
	},
	{
		code: "EG",
		name: "Egypt",
		dial_country_code: "20",
	},
	{
		code: "EH",
		name: "Western Sahara",
		dial_country_code: "212",
	},
	{
		code: "ER",
		name: "Eritrea",
		dial_country_code: "291",
	},
	{
		code: "ES",
		name: "Spain",
		dial_country_code: "34",
	},
	{
		code: "ET",
		name: "Ethiopia",
		dial_country_code: "251",
	},
	{
		code: "FI",
		name: "Finland",
		dial_country_code: "358",
	},
	{
		code: "FJ",
		name: "Fiji",
		dial_country_code: "679",
	},
	{
		code: "FK",
		name: "Falkland Islands (Malvinas)",
		dial_country_code: "500",
	},
	{
		code: "FM",
		name: "Micronesia",
		dial_country_code: "691",
	},
	{
		code: "FO",
		name: "Faroe Islands",
		dial_country_code: "298",
	},
	{
		code: "FR",
		name: "France",
		dial_country_code: "33",
	},
	{
		code: "GA",
		name: "Gabon",
		dial_country_code: "241",
	},
	{
		code: "GB",
		name: "United Kingdom",
		dial_country_code: "44",
	},
	{
		code: "GD",
		name: "Grenada",
		dial_country_code: "1",
		dial_region_codes: ["473"],
	},
	{
		code: "GE",
		name: "Georgia",
		dial_country_code: "995",
	},
	{
		code: "GF",
		name: "French Guiana",
		dial_country_code: "594",
	},
	{
		code: "GG",
		name: "Guernsey",
		dial_country_code: "44",
		dial_region_codes: ["1481"],
	},
	{
		code: "GH",
		name: "Ghana",
		dial_country_code: "233",
	},
	{
		code: "GI",
		name: "Gibraltar",
		dial_country_code: "350",
	},
	{
		code: "GL",
		name: "Greenland",
		dial_country_code: "299",
	},
	{
		code: "GM",
		name: "Gambia",
		dial_country_code: "220",
	},
	{
		code: "GN",
		name: "Guinea",
		dial_country_code: "224",
	},
	{
		code: "GP",
		name: "Guadeloupe",
		dial_country_code: "590",
	},
	{
		code: "GQ",
		name: "Equatorial Guinea",
		dial_country_code: "240",
	},
	{
		code: "GR",
		name: "Greece",
		dial_country_code: "30",
	},
	{
		code: "GS",
		name: "South Georgia",
		dial_country_code: "500",
	},
	{
		code: "GT",
		name: "Guatemala",
		dial_country_code: "502",
	},
	{
		code: "GU",
		name: "Guam",
		dial_country_code: "1",
		dial_region_codes: ["671"],
	},
	{
		code: "GW",
		name: "Guinea-Bissau",
		dial_country_code: "245",
	},
	{
		code: "GY",
		name: "Guyana",
		dial_country_code: "592",
	},
	{
		code: "HK",
		name: "Hong Kong",
		dial_country_code: "852",
	},
	{
		code: "HM",
		name: "Heard Island and Mcdonald Islands",
		dial_country_code: "672",
	},
	{
		code: "HN",
		name: "Honduras",
		dial_country_code: "504",
	},
	{
		code: "HR",
		name: "Croatia",
		dial_country_code: "385",
	},
	{
		code: "HT",
		name: "Haiti",
		dial_country_code: "509",
	},
	{
		code: "HU",
		name: "Hungary",
		dial_country_code: "36",
	},
	{
		code: "ID",
		name: "Indonesia",
		dial_country_code: "62",
	},
	{
		code: "IE",
		name: "Ireland",
		dial_country_code: "353",
	},
	{
		code: "IL",
		name: "Israel",
		dial_country_code: "972",
	},
	{
		code: "IM",
		name: "Isle of Man",
		dial_country_code: "44",
		dial_region_codes: ["1624"],
	},
	{
		code: "IN",
		name: "India",
		dial_country_code: "91",
	},
	{
		code: "IO",
		name: "British Indian Ocean Territory",
		dial_country_code: "246",
	},
	{
		code: "IQ",
		name: "Iraq",
		dial_country_code: "964",
	},
	{
		code: "IR",
		name: "Iran",
		dial_country_code: "98",
	},
	{
		code: "IS",
		name: "Iceland",
		dial_country_code: "354",
	},
	{
		code: "IT",
		name: "Italy",
		dial_country_code: "39",
	},
	{
		code: "JE",
		name: "Jersey",
		dial_country_code: "44",
		dial_region_codes: ["1534"],
	},
	{
		code: "JM",
		name: "Jamaica",
		dial_country_code: "1",
		dial_region_codes: ["658", "876"],
	},
	{
		code: "JO",
		name: "Jordan",
		dial_country_code: "962",
	},
	{
		code: "JP",
		name: "Japan",
		dial_country_code: "81",
	},
	{
		code: "KE",
		name: "Kenya",
		dial_country_code: "254",
	},
	{
		code: "KG",
		name: "Kyrgyzstan",
		dial_country_code: "996",
	},
	{
		code: "KH",
		name: "Cambodia",
		dial_country_code: "855",
	},
	{
		code: "KI",
		name: "Kiribati",
		dial_country_code: "686",
	},
	{
		code: "KM",
		name: "Comoros",
		dial_country_code: "269",
	},
	{
		code: "KN",
		name: "Saint Kitts and Nevis",
		dial_country_code: "1",
		dial_region_codes: ["869"],
	},
	{
		code: "KP",
		name: "North Korea",
		dial_country_code: "850",
	},
	{
		code: "KR",
		name: "South Korea",
		dial_country_code: "82",
	},
	{
		code: "KW",
		name: "Kuwait",
		dial_country_code: "965",
	},
	{
		code: "KY",
		name: "Cayman Islands",
		dial_country_code: "1",
		dial_region_codes: ["345"],
	},
	{
		code: "KZ",
		name: "Kazakhstan",
		dial_country_code: "7",
		dial_region_codes: ["8"],
	},
	{
		code: "LA",
		name: "Lao People's Democratic Republic",
		dial_country_code: "856",
	},
	{
		code: "LB",
		name: "Lebanon",
		dial_country_code: "961",
	},
	{
		code: "LC",
		name: "Saint Lucia",
		dial_country_code: "1",
		dial_region_codes: ["758"],
	},
	{
		code: "LI",
		name: "Liechtenstein",
		dial_country_code: "423",
	},
	{
		code: "LK",
		name: "Sri Lanka",
		dial_country_code: "94",
	},
	{
		code: "LR",
		name: "Liberia",
		dial_country_code: "231",
	},
	{
		code: "LS",
		name: "Lesotho",
		dial_country_code: "266",
	},
	{
		code: "LT",
		name: "Lithuania",
		dial_country_code: "370",
	},
	{
		code: "LU",
		name: "Luxembourg",
		dial_country_code: "352",
	},
	{
		code: "LV",
		name: "Latvia",
		dial_country_code: "371",
	},
	{
		code: "LY",
		name: "Libya",
		dial_country_code: "218",
	},
	{
		code: "MA",
		name: "Morocco",
		dial_country_code: "212",
	},
	{
		code: "MC",
		name: "Monaco",
		dial_country_code: "377",
	},
	{
		code: "MD",
		name: "Moldova",
		dial_country_code: "373",
	},
	{
		code: "ME",
		name: "Montenegro",
		dial_country_code: "382",
	},
	{
		code: "MF",
		name: "Saint Martin (French Part)",
		dial_country_code: "590",
	},
	{
		code: "MG",
		name: "Madagascar",
		dial_country_code: "261",
	},
	{
		code: "MH",
		name: "Marshall Islands",
		dial_country_code: "692",
	},
	{
		code: "MK",
		name: "Macedonia",
		dial_country_code: "389",
	},
	{
		code: "ML",
		name: "Mali",
		dial_country_code: "223",
	},
	{
		code: "MM",
		name: "Myanmar",
		dial_country_code: "95",
	},
	{
		code: "MN",
		name: "Mongolia",
		dial_country_code: "976",
	},
	{
		code: "MO",
		name: "Macao",
		dial_country_code: "853",
	},
	{
		code: "MP",
		name: "Northern Mariana Islands",
		dial_country_code: "1",
		dial_region_codes: ["670"],
	},
	{
		code: "MQ",
		name: "Martinique",
		dial_country_code: "596",
	},
	{
		code: "MR",
		name: "Mauritania",
		dial_country_code: "222",
	},
	{
		code: "MS",
		name: "Montserrat",
		dial_country_code: "1",
		dial_region_codes: ["664"],
	},
	{
		code: "MT",
		name: "Malta",
		dial_country_code: "356",
	},
	{
		code: "MU",
		name: "Mauritius",
		dial_country_code: "230",
	},
	{
		code: "MV",
		name: "Maldives",
		dial_country_code: "960",
	},
	{
		code: "MW",
		name: "Malawi",
		dial_country_code: "265",
	},
	{
		code: "MX",
		name: "Mexico",
		dial_country_code: "52",
	},
	{
		code: "MY",
		name: "Malaysia",
		dial_country_code: "60",
	},
	{
		code: "MZ",
		name: "Mozambique",
		dial_country_code: "258",
	},
	{
		code: "NA",
		name: "Namibia",
		dial_country_code: "264",
	},
	{
		code: "NC",
		name: "New Caledonia",
		dial_country_code: "687",
	},
	{
		code: "NE",
		name: "Niger",
		dial_country_code: "227",
	},
	{
		code: "NF",
		name: "Norfolk Island",
		dial_country_code: "672",
		dial_region_codes: ["3"],
	},
	{
		code: "NG",
		name: "Nigeria",
		dial_country_code: "234",
	},
	{
		code: "NI",
		name: "Nicaragua",
		dial_country_code: "505",
	},
	{
		code: "NL",
		name: "Netherlands",
		dial_country_code: "31",
	},
	{
		code: "NO",
		name: "Norway",
		dial_country_code: "47",
	},
	{
		code: "NP",
		name: "Nepal",
		dial_country_code: "977",
	},
	{
		code: "NR",
		name: "Nauru",
		dial_country_code: "674",
	},
	{
		code: "NU",
		name: "Niue",
		dial_country_code: "683",
	},
	{
		code: "NZ",
		name: "New Zealand",
		dial_country_code: "64",
	},
	{
		code: "OM",
		name: "Oman",
		dial_country_code: "968",
	},
	{
		code: "PA",
		name: "Panama",
		dial_country_code: "507",
	},
	{
		code: "PE",
		name: "Peru",
		dial_country_code: "51",
	},
	{
		code: "PF",
		name: "French Polynesia",
		dial_country_code: "689",
	},
	{
		code: "PG",
		name: "Papua New Guinea",
		dial_country_code: "675",
	},
	{
		code: "PH",
		name: "Philippines",
		dial_country_code: "63",
	},
	{
		code: "PK",
		name: "Pakistan",
		dial_country_code: "92",
	},
	{
		code: "PL",
		name: "Poland",
		dial_country_code: "48",
	},
	{
		code: "PM",
		name: "Saint Pierre and Miquelon",
		dial_country_code: "508",
	},
	{
		code: "PN",
		name: "Pitcairn",
		dial_country_code: "64",
	},
	{
		code: "PR",
		name: "Puerto Rico",
		dial_country_code: "1",
		dial_region_codes: ["787", "939"],
	},
	{
		code: "PS",
		name: "Palestinian Territory",
		dial_country_code: "970",
	},
	{
		code: "PT",
		name: "Portugal",
		dial_country_code: "351",
	},
	{
		code: "PW",
		name: "Palau",
		dial_country_code: "680",
	},
	{
		code: "PY",
		name: "Paraguay",
		dial_country_code: "595",
	},
	{
		code: "QA",
		name: "Qatar",
		dial_country_code: "974",
	},
	{
		code: "RE",
		name: "Réunion",
		dial_country_code: "262",
	},
	{
		code: "RO",
		name: "Romania",
		dial_country_code: "40",
	},
	{
		code: "RS",
		name: "Serbia",
		dial_country_code: "381",
	},
	{
		code: "RU",
		name: "Russia",
		dial_country_code: "7",
	},
	{
		code: "RW",
		name: "Rwanda",
		dial_country_code: "250",
	},
	{
		code: "SA",
		name: "Saudi Arabia",
		dial_country_code: "966",
	},
	{
		code: "SB",
		name: "Solomon Islands",
		dial_country_code: "677",
	},
	{
		code: "SC",
		name: "Seychelles",
		dial_country_code: "248",
	},
	{
		code: "SD",
		name: "Sudan",
		dial_country_code: "249",
	},
	{
		code: "SE",
		name: "Sweden",
		dial_country_code: "46",
	},
	{
		code: "SG",
		name: "Singapore",
		dial_country_code: "65",
	},
	{
		code: "SH",
		name: "Saint Helena, Ascension and Tristan Da Cunha",
		dial_country_code: "290",
	},
	{
		code: "SI",
		name: "Slovenia",
		dial_country_code: "386",
	},
	{
		code: "SJ",
		name: "Svalbard and Jan Mayen",
		dial_country_code: "47",
		dial_region_codes: ["79"],
	},
	{
		code: "SK",
		name: "Slovakia",
		dial_country_code: "421",
	},
	{
		code: "SL",
		name: "Sierra Leone",
		dial_country_code: "232",
	},
	{
		code: "SM",
		name: "San Marino",
		dial_country_code: "378",
	},
	{
		code: "SN",
		name: "Senegal",
		dial_country_code: "221",
	},
	{
		code: "SO",
		name: "Somalia",
		dial_country_code: "252",
	},
	{
		code: "SR",
		name: "Suriname",
		dial_country_code: "597",
	},
	{
		code: "SS",
		name: "South Sudan",
		dial_country_code: "211",
	},
	{
		code: "ST",
		name: "Sao Tome and Principe",
		dial_country_code: "239",
	},
	{
		code: "SV",
		name: "El Salvador",
		dial_country_code: "503",
	},
	{
		code: "SX",
		name: "Sint Maarten",
		dial_country_code: "1",
		dial_region_codes: ["721"],
	},
	{
		code: "SY",
		name: "Syrian Arab Republic",
		dial_country_code: "963",
	},
	{
		code: "SZ",
		name: "Swaziland",
		dial_country_code: "268",
	},
	{
		code: "TC",
		name: "Turks and Caicos Islands",
		dial_country_code: "1",
		dial_region_codes: ["649"],
	},
	{
		code: "TD",
		name: "Chad",
		dial_country_code: "235",
	},
	{
		code: "TF",
		name: "French Southern Territories",
		dial_country_code: "262",
	},
	{
		code: "TG",
		name: "Togo",
		dial_country_code: "228",
	},
	{
		code: "TH",
		name: "Thailand",
		dial_country_code: "66",
	},
	{
		code: "TJ",
		name: "Tajikistan",
		dial_country_code: "992",
	},
	{
		code: "TK",
		name: "Tokelau",
		dial_country_code: "690",
	},
	{
		code: "TL",
		name: "Timor-Leste",
		dial_country_code: "670",
	},
	{
		code: "TM",
		name: "Turkmenistan",
		dial_country_code: "993",
	},
	{
		code: "TN",
		name: "Tunisia",
		dial_country_code: "216",
	},
	{
		code: "TO",
		name: "Tonga",
		dial_country_code: "676",
	},
	{
		code: "TR",
		name: "Turkey",
		dial_country_code: "90",
	},
	{
		code: "TT",
		name: "Trinidad and Tobago",
		dial_country_code: "1",
		dial_region_codes: ["868"],
	},
	{
		code: "TV",
		name: "Tuvalu",
		dial_country_code: "688",
	},
	{
		code: "TW",
		name: "Taiwan",
		dial_country_code: "886",
	},
	{
		code: "TZ",
		name: "Tanzania",
		dial_country_code: "255",
	},
	{
		code: "UA",
		name: "Ukraine",
		dial_country_code: "380",
	},
	{
		code: "UG",
		name: "Uganda",
		dial_country_code: "256",
	},
	{
		code: "UM",
		name: "United States Minor Outlying Islands",
		dial_country_code: "1",
		dial_region_codes: ["8", "3"],
	},
	{
		code: "US",
		name: "United States",
		dial_country_code: "1",
	},
	{
		code: "UY",
		name: "Uruguay",
		dial_country_code: "598",
	},
	{
		code: "UZ",
		name: "Uzbekistan",
		dial_country_code: "998",
	},
	{
		code: "VA",
		name: "Vatican City",
		dial_country_code: "39",
		dial_region_codes: ["06698"],
	},
	{
		code: "VC",
		name: "Saint Vincent and The Grenadines",
		dial_country_code: "1",
		dial_region_codes: ["784"],
	},
	{
		code: "VE",
		name: "Venezuela",
		dial_country_code: "58",
	},
	{
		code: "VG",
		name: "Virgin Islands, British",
		dial_country_code: "1",
		dial_region_codes: ["284"],
	},
	{
		code: "VI",
		name: "Virgin Islands, U.S.",
		dial_country_code: "1",
		dial_region_codes: ["340"],
	},
	{
		code: "VN",
		name: "Viet Nam",
		dial_country_code: "84",
	},
	{
		code: "VU",
		name: "Vanuatu",
		dial_country_code: "678",
	},
	{
		code: "WF",
		name: "Wallis and Futuna",
		dial_country_code: "681",
	},
	{
		code: "WS",
		name: "Samoa",
		dial_country_code: "685",
	},
	{
		code: "YE",
		name: "Yemen",
		dial_country_code: "967",
	},
	{
		code: "YT",
		name: "Mayotte",
		dial_country_code: "262",
		dial_region_codes: ["269", "639"],
	},
	{
		code: "ZA",
		name: "South Africa",
		dial_country_code: "27",
	},
	{
		code: "ZM",
		name: "Zambia",
		dial_country_code: "260",
	},
	{
		code: "ZW",
		name: "Zimbabwe",
		dial_country_code: "263",
	},
].map((entry) => ({ ...entry, emoji: getFlagEmoji(entry.code) }));

/**
 * Because some countries can have multiple regional codes
 * flattenedCountries provides a flattened list of Country,
 * with each having a single unique dialing code
 */
export const flattenedCountries = mapBaseCountriesToCountries(countries).sort(
	(a, b) => a.name.localeCompare(b.name)
);

/**
 * We also build a map to make the dialing code lookup easier / cheaper
 */
export const countriesMap = new Map(
	flattenedCountries.map((country) => [country.dialing_code, country])
);
