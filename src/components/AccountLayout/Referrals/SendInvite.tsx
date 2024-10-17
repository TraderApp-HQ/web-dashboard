import InputField from "~/components/common/InputField";
import { Dispatch, SetStateAction, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import PlaneIcon from "~/components/icons/PlaneIcon";

interface ISendInvitesProps {
	onError: Dispatch<SetStateAction<boolean>>;
	onSuccess: Dispatch<SetStateAction<boolean>>;
}

const SendInvite: React.FC<ISendInvitesProps> = ({ onSuccess, onError }) => {
	const [emails, setEmails] = useState<string>("");
	const usersService = new UsersService();

	const sendInvites = async () => {
		try {
			await usersService.inviteFriends(emails.split(","));
			onSuccess(true);
			setEmails("");
		} catch (err) {
			onError(true);
		}
	};

	return (
		<section className="mt-5">
			<h3 className="font-bold text-lg mb-1 text-[#102477]">Invite Your friends </h3>
			<p className="text-[#414141] font-light">
				Insert your friends email addresses and send them an invitation to join TraderApp
			</p>

			<div className="rounded-md flex justify-between border border-[#DEE3F6] bg-white text-[#3E57BF] pl-3 mt-3">
				<div className="py-0.5 flex items-center grow">
					<InputField
						type="text"
						className="py-1"
						placeholder="Enter email addresses"
						onChange={(text) => setEmails(text)}
					/>
				</div>

				<button
					onClick={sendInvites}
					className="bg-[#465ec1] flex gap-0.5 items-center justify-center px-3 py-2 text-nowrap text-white rounded-md"
				>
					<span>Send invite</span>
					<PlaneIcon />
				</button>
			</div>
		</section>
	);
};

export { SendInvite };
