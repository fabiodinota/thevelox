"use server";
import { headers } from "next/headers";
import React from "react";

const page = () => {
	const { timezone } = JSON.parse(headers().get("timezone") || "{}");

	console.log("Timezone: ", timezone);
	return <div>page</div>;
};

export default page;
