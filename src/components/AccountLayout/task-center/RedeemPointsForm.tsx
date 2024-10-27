import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";

const RedeemPointsForm = () => {
	return (
		<form data-testid="redeem-points-form" className="my-4 space-y-5 px-2 w-[25rem]">
			<section>
				<p className="capitalize font-bold text-base text-black">withdraw funds</p>
				<span className="font-normal text-sm text-black">
					You can redeem your Accumulated Points to money
				</span>
			</section>
			<InputField
				labelText="Amount to withdraw"
				type="text"
				labelClassName="text-textColor"
				placeholder="USDT"
				// value={formData?.title || ""}
				// onChange={(value) => updateFormData("title", value)}
			/>

			<Button
				labelText="withdraw funds"
				onClick={() => {}}
				className="capitalize py-4 mt-6 text-sm font-bold w-full"
			/>
		</form>
	);
};

export default RedeemPointsForm;
