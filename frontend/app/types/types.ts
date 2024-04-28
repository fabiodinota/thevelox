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
