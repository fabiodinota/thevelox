export type Ticket = {
	departureTime: string;
	arrivalTime: string;
	startStation: string;
	endStation: string;
	startLine: number;
	endLine: number;
	startLevel: number;
	endLevel: number;
	times: string[];
	price?: number;
};

export type ISearchReqData = {
	startStation: string;
	endStation: string;
	startLevel: number;
	endLevel: number;
	lines: string[];
	path: string[];
	fullPath: Station[];
	times: string[];
	tickets: Ticket[];
};

export type Station = {
	name: string;
	level: number | undefined;
	label: string;
};

export type SearchParams = {
	startStation: string;
	endStation: string;
	departureDate: string;
};

export type FormSchemaProps = {
	startStation: string;
	endStation: string;
	departureDate: string;
};

export type CARD_NAMES =
	| "american_express"
	| "diners_club"
	| "discover"
	| "elo"
	| "hipercard"
	| "hiper"
	| "jcb"
	| "maestro"
	| "mastercard"
	| "mir"
	| "unionpay"
	| "visa"
	| "bancontact"
	| "paypal";

export type PaymentMethod = {
	user_id: number;
	type: CARD_NAMES;
	card_number: string;
	card_holder_name: string;
	card_expiry: string;
	card_cvv: string;
	paypal_email: string;
	last_updated: string;
	created_on: string;
	payment_method_id: number;
};

export type PaymentMethodResponse = {
	payment_method_id: number;
	type: CARD_NAMES;
	formatted_card_number: string;
	formatted_paypal_email: string;
};

export type Journey = {
	journey_id: number;
	line_id_start: string;
	line_id_end: string;
	departure_station: string;
	arrival_station: string;
	departure_time: string;
	arrival_time: string;
};

export type TicketResponse = {
	ticket_id: number;
	user_id: number;
	journey_id: number;
	payment_method_id: number;
	journey_date: string;
	booking_date: string;
	price: number;
	ticket_object: string;
	journeys: Journey;
};

export type ParsedTicketResponse = {
	ticket_id: number;
	user_id: number;
	journey_id: number;
	payment_method_id: number;
	journey_date: string;
	booking_date: string;
	price: number;
	ticket_object: Ticket;
	journeys: Journey;
};
