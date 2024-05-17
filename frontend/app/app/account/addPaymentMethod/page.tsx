import RippleButton from "@/app/components/RippleButton";
import Header from "@/app/components/app/Header";
import ManagePaymentMethods from "@/app/components/app/account/managePaymentMethods";
import AddPaymentMethod from "@/app/components/app/account/AddPaymentMethod";
import React from "react";

const ManagePaymentMethodsPage = () => {
	return (
		<div className="pb-[140px] pt-[70px]">
			<Header />
			<div className="w-full h-full flex flex-col justify-center items-center mt-10">
				<div className="w-full max-w-[800px] flex flex-col gap-2.5 p-5 justify-center items-center">
					<span className="text-[24px] font-bold w-full text-left">
						Add Payment Method
					</span>
					<AddPaymentMethod />
				</div>
			</div>
		</div>
	);
};

export default ManagePaymentMethodsPage;
