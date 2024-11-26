import InputField from "~/components/common/InputField";
import { Dispatch, SetStateAction, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import PlaneIcon from "~/components/icons/PlaneIcon";
import RemoveIcon from "~/components/icons/RemoveIcon";
import { EmailValidation } from "~/config/constants";
import { useCreate } from "~/hooks/useCreate";

interface ISendInvitesProps {
	onError: Dispatch<SetStateAction<boolean>>;
	onSuccess: Dispatch<SetStateAction<boolean>>;
}

const MAX_EMAILS = 20;

const RecipientChip = ({ email, onRemove }: { email: string; onRemove: () => void }) => (
	<div className="inline-flex items-center gap-2 px-3 h-8 bg-[#F0F2FD] text-[#08123b] font-semibold rounded-lg">
		{email}
		<button onClick={onRemove} className="hover:text-[#465ec1] p-1">
			<RemoveIcon />
		</button>
	</div>
);

const SendInvite: React.FC<ISendInvitesProps> = ({ onSuccess, onError }) => {
	const [emails, setEmails] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [emailError, setEmailError] = useState("");
	const usersService = new UsersService();

	const validateEmail = (email: string): boolean => {
		return EmailValidation.test(email);
	};

	const addEmail = (email: string) => {
		const trimmedEmail = email.trim().toLowerCase();
		if (trimmedEmail && !emails.includes(trimmedEmail)) {
			if (validateEmail(trimmedEmail)) {
				setEmails([...emails, trimmedEmail]);
				setInputValue("");
				setEmailError("");
			} else {
				setEmailError("Please enter a valid email address.");
			}
		} else if (emails.includes(trimmedEmail)) {
			setEmailError("This email has already been added.");
		}
	};

	const removeEmail = (index: number) => {
		setEmails(emails.filter((_, i) => i !== index));
	};

	const { mutate: inviteFriends, isPending: isInvitePending } = useCreate({
		mutationFn: usersService.inviteFriends.bind(usersService),
		onSuccess: () => {
			onSuccess(true);
			setEmails([]);
		},
		onError: () => {
			onError(true);
		},
	});

	const sendInvites = () => {
		const validEmails = emails.filter((email) => validateEmail(email));
		if (validEmails.length === 0) {
			setEmailError("Please add at least one valid email address.");
			return;
		}
		inviteFriends(validEmails);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && inputValue.trim()) {
			e.preventDefault();
			addEmail(inputValue.trim());
		}
	};

	const handleInputChange = (value: string) => {
		setInputValue(value);
		if (emailError) {
			setEmailError("");
		}
	};

	return (
		<section className="mt-8">
			<h3 className="font-bold text-lg mb-1 text-[#0A0D14]">Invite Your friends</h3>

			<div className="rounded-md flex flex-col border border-[#DEE3F6] bg-white text-[#3E57BF] p-4 mt-3">
				<div className="flex flex-wrap min-h-[2.5rem] mb-2 gap-2.5">
					{emails.map((email, index) => (
						<RecipientChip
							key={index}
							email={email}
							onRemove={() => removeEmail(index)}
						/>
					))}
					{emails.length < MAX_EMAILS && (
						<InputField
							type="email"
							value={inputValue}
							className="flex-grow w-full min-w-[250px] px-2 py-1 pr-3"
							placeholder={
								emails.length
									? `Enter up to ${MAX_EMAILS - emails.length} more email(s)`
									: "Enter email address"
							}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
					)}
				</div>
				{emailError && <p className="text-red-500 text-sm">{emailError}</p>}

				<button
					onClick={sendInvites}
					disabled={emails.length === 0 || isInvitePending}
					className="bg-[#465ec1] flex gap-0.5 items-center justify-center px-3 py-1 mt-1 text-nowrap text-white rounded-md self-start disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span>{isInvitePending ? "Sending..." : "Send Invite"}</span>
					<PlaneIcon />
				</button>
			</div>
		</section>
	);
};

export { SendInvite };
