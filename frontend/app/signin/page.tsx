"use client";

import React from "react";

const page = () => {
	return (
		<div>
			<h1>Sign In</h1>
			<div onClick={() => window.history.back()}>Go Back</div>
			<form>
				<label htmlFor="username">Username</label>
				<input type="text" id="username" name="username" />
				<label htmlFor="password">Password</label>
				<input type="password" id="password" name="password" />
				<button type="submit">Sign In</button>
			</form>
		</div>
	);
};

export default page;
