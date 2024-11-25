import InputField from "~/components/common/InputField";
import { Dispatch, SetStateAction, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import PlaneIcon from "~/components/icons/PlaneIcon";

interface ISendInvitesProps {
	onError: Dispatch<SetStateAction<boolean>>;
	onSuccess: Dispatch<SetStateAction<boolean>>;
}

// const SendInvite: React.FC<ISendInvitesProps> = ({ onSuccess, onError }) => {
// 	const [emails, setEmails] = useState<string[]>([""]);
// 	const usersService = new UsersService();

// 	const sendInvites = async () => {
// 		// return;
// 		try {
// 			const validEmails = emails.filter((email) => email.trim() !== "");
// 			await usersService.inviteFriends(validEmails);
// 			onSuccess(true);
// 			setEmails([""]);
// 		} catch (err) {
// 			onError(true);
// 		}
// 	};

// 	return (
// 		<section className="mt-8">
// 			<h3 className="font-bold text-lg mb-1 text-[#0A0D14]">Invite Your friends </h3>

// 			<div className="rounded-md flex flex-col border border-[#DEE3F6] bg-white text-[#3E57BF] p3 mt-3">
// 				<div className="py-0.5 flex items-center grow">
// 					<InputField
// 						type="text"
// 						className="py-1"
// 						placeholder="Enter email addresses"
// 						onChange={(text) => setEmails([text])}
// 					/>
// 					<InputField
// 						type="text"
// 						className="py-1"
// 						placeholder="Enter email addresses"
// 						onChange={(text) => setEmails([text])}
// 					/>
// 				</div>

// 				<button
// 					onClick={sendInvites}
// 					className="bg-[#465ec1] flex gap-0.5 items-center justify-center px-3 py-2 text-nowrap text-white rounded-md mt-3 self-end"
// 				>
// 					<span>Send invite</span>
// 					<PlaneIcon />
// 				</button>
// 			</div>
// 		</section>
// 	);
// };

const RecipientChip = ({ email, onRemove }: { email: string; onRemove: () => void }) => (
	<div className="inline-flex items-center gap-2 px-3 h-8 bg-[#F0F2FD] text-[#3E57BF] rounded-lg mx-1">
		<span>{email}</span>
		<button onClick={onRemove} className="hover:text-[#465ec1]">
			×
		</button>
	</div>
);

const SendInvite: React.FC<ISendInvitesProps> = ({ onSuccess, onError }) => {
	const [emails, setEmails] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState("");
	const usersService = new UsersService();

	const sendInvites = async () => {
		try {
			const validEmails = emails.filter((email) => email.trim() !== "");
			await usersService.inviteFriends(validEmails);
			onSuccess(true);
			setEmails([""]);
		} catch (err) {
			onError(true);
		}
	};

	const addEmail = (email: string) => {
		if (email && !emails.includes(email)) {
			setEmails([...emails, email]);
			setInputValue("");
		}
	};

	const removeEmail = (index: number) => {
		setEmails(emails.filter((_, i) => i !== index));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && inputValue.trim()) {
			e.preventDefault();
			addEmail(inputValue.trim());
		}
	};

	return (
		<section className="mt-8">
			<h3 className="font-bold text-lg mb-1 text-[#0A0D14]">Invite Your friends</h3>

			<div className="rounded-md flex flex-col border border-[#DEE3F6] bg-white text-[#3E57BF] p-4 mt-3">
				<div className="flex flex-wrap min-h-[2.5rem] mb-2">
					{emails.map((email, index) => (
						<RecipientChip
							key={index}
							email={email}
							onRemove={() => removeEmail(index)}
						/>
					))}
					<InputField
						type="text"
						value={inputValue}
						className="flex-grow py-1 min-w-[200px]"
						placeholder={emails.length ? "Add more emails" : "Enter email addresses"}
						onChange={setInputValue}
						onKeyDown={handleKeyDown}
					/>
					{/* <InputField
						type="text"
						value={inputValue}
						className="flex-grow py-1 min-w-[200px]"
						placeholder={emails.length ? "Add more emails" : "Enter email addresses"}
						onChange={setInputValue}
						onKeyDown={handleKeyDown}
					/> */}
				</div>

				<button
					onClick={sendInvites}
					disabled={emails.length === 0}
					className="bg-[#465ec1] flex gap-0.5 items-center justify-center px-3 py-2 text-nowrap text-white rounded-md self-start disabled:opacity-50"
				>
					<span>Send invite</span>
					<PlaneIcon />
				</button>
			</div>
		</section>
	);
};

export { SendInvite };
