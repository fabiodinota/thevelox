import React from "react";
import { Amex } from "@/app/components/Icons";
import { Bancontact } from "@/app/components/Icons";
import { Diners } from "@/app/components/Icons";
import { Discover } from "@/app/components/Icons";
import { Elo } from "@/app/components/Icons";
import { Generic } from "@/app/components/Icons";
import { Hiper } from "@/app/components/Icons";
import { Hipercard } from "@/app/components/Icons";
import { Jcb } from "@/app/components/Icons";
import { Maestro } from "@/app/components/Icons";
import { Mastercard } from "@/app/components/Icons";
import { Mir } from "@/app/components/Icons";
import { Unionpay } from "@/app/components/Icons";
import { Visa } from "@/app/components/Icons";
import { CARD_NAMES } from "../types/types";

const getIconFromCard = (name: CARD_NAMES, className: string) => {
	switch (name) {
		case "american_express":
			return <Amex className={className} />;
		case "bancontact":
			return <Bancontact className={className} />;
		case "diners_club":
			return <Diners className={className} />;
		case "discover":
			return <Discover className={className} />;
		case "elo":
			return <Elo className={className} />;
		case "hipercard":
			return <Hipercard className={className} />;
		case "hiper":
			return <Hiper className={className} />;
		case "jcb":
			return <Jcb className={className} />;
		case "maestro":
			return <Maestro className={className} />;
		case "mastercard":
			return <Mastercard className={className} />;
		case "mir":
			return <Mir className={className} />;
		case "unionpay":
			return <Unionpay className={className} />;
		case "visa":
			return <Visa className={className} />;
		default:
			return <Generic className={className} />;
	}
};

export default getIconFromCard;
