"use client";

import RippleButton from "@/app/components/RippleButton";
import Header from "@/app/components/app/Header";
import ManagePaymentMethods from "@/app/components/app/account/managePaymentMethods";
import Link from "next/link";
import React from "react";

const ManagePaymentMethodsPage = () => {
	return (
		<div className="pb-[140px] pt-[70px]">
			<Header />
			<div className="w-full h-full flex flex-col justify-center items-center mt-10">
				<div className="w-full max-w-[700px] flex flex-col gap-2.5 p-5 justify-center items-center">
					<div className="w-full justify-between items-center flex flex-row">
						<span className="text-[24px] font-bold">
							Manage Payment Methods
						</span>
						<Link href="/app/account">Back</Link>
					</div>
					<p className="pb-2 opacity-50">
						Saved payment methods are fully encrypted. The Velox
						does not have access to your payment information.
					</p>
					<ManagePaymentMethods />
				</div>
			</div>
		</div>
	);
};

export default ManagePaymentMethodsPage;
