import React from "react";
import Amex from "@/public/icons/credit_cards/amex.svg";
import Bancontact from "@/public/icons/credit_cards/bancontact.svg";
import Diners from "@/public/icons/credit_cards/diners.svg";
import Discover from "@/public/icons/credit_cards/discover.svg";
import Elo from "@/public/icons/credit_cards/elo.svg";
import Generic from "@/public/icons/credit_cards/generic.svg";
import Hiper from "@/public/icons/credit_cards/hiper.svg";
import Hipercard from "@/public/icons/credit_cards/hipercard.svg";
import Jcb from "@/public/icons/credit_cards/jcb.svg";
import Maestro from "@/public/icons/credit_cards/maestro.svg";
import Mastercard from "@/public/icons/credit_cards/mastercard.svg";
import Mir from "@/public/icons/credit_cards/mir.svg";
import Unionpay from "@/public/icons/credit_cards/unionpay.svg";
import Visa from "@/public/icons/credit_cards/visa.svg";
import { CARD_NAMES } from "../types/types";

const getIconFromCard = (name: CARD_NAMES, className: string) => {
	switch (name) {
		case "american_express":
			return Amex;
		case "bancontact":
			return Bancontact;
		case "diners_club":
			return Diners;
		case "discover":
			return Discover;
		case "elo":
			return Elo;
		case "hipercard":
			return Hipercard;
		case "hiper":
			return Hiper;
		case "jcb":
			return Jcb;
		case "maestro":
			return Maestro;
		case "mastercard":
			return Mastercard;
		case "mir":
			return Mir;
		case "unionpay":
			return Unionpay;
		case "visa":
			return Visa;
		default:
			return Generic;
	}
};

export default getIconFromCard;
