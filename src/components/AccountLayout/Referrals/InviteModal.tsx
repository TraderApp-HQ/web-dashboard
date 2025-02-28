import { useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import InputField from "~/components/common/InputField";
import RemoveIcon from "~/components/icons/RemoveIcon";
import Modal from "~/components/Modal";
import { EmailValidation } from "~/config/constants";
import { useCreate } from "~/hooks/useCreate";

interface InviteFriendsModalProps {
	openModal: boolean;
	onClose: () => void;
	onSuccess: (value: boolean) => void;
	onError: (error: Error) => void;
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

const InviteModal: React.FC<InviteFriendsModalProps> = ({
	openModal,
	onClose,
	onSuccess,
	onError,
}) => {
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
			onClose();
		},
		onError: (error: Error) => {
			onError(error);
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
		<Modal
			openModal={openModal}
			onClose={onClose}
			width="md:w-[651px]"
			title="Invite Friends"
			headerDivider
		>
			<div className="py-[35px] flex flex-col gap-[50px]">
				<div className="rounded-md flex flex-col border border-[#DEE3F6] bg-white text-[#3E57BF] p-4">
					<div className="flex flex-wrap min-h-[2.5rem] gap-2.5">
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
								className="flex-grow w-full min-w-[210px] px-2.5 py-1"
								placeholder={
									emails.length
										? `Add up to ${MAX_EMAILS - emails.length} more email${MAX_EMAILS - emails.length === 1 ? "" : "s"}`
										: "Enter email addresses"
								}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
							/>
						)}
					</div>
					{emailError && <p className="text-red-500 text-sm">{emailError}</p>}
				</div>
				<button
					onClick={sendInvites}
					disabled={emails.length === 0 || isInvitePending}
					className="h-[73px] w-full p-2.5 bg-[#1836b2] rounded-[9px] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span className="text-white font-semibold">
						{isInvitePending ? "Sending..." : "Send Invite"}
					</span>
				</button>
			</div>
		</Modal>
	);
};

export { InviteModal };
