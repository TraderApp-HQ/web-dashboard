import Image from "next/image";
import { TransactionType } from "~/config/enum";

const DisplayTransaction: React.FC<{
	transaction: TransactionType;
	styles?: string;
	textStyles?: string;
}> = ({ transaction, styles, textStyles }) => {
	const icon = (() => {
		switch (transaction.toUpperCase()) {
			case TransactionType.DEPOSIT:
				return "/images/depositIcon.svg";
			case TransactionType.WITHDRAWAL:
			case TransactionType.ACTIVATION:
				return "/images/withdrawalIcon.svg";
			default:
				return "";
		}
	})();

	return (
		<section className={`flex items-center justify-end md:justify-start space-x-2 ${styles}`}>
			<Image
				src={icon}
				alt="Asset Logo"
				className="w-[30px] h-[30px]"
				width={30}
				height={30}
			/>

			<span className={`text-stone-900 ${textStyles}`}>{transaction.toLowerCase()}</span>
		</section>
	);
};

export default DisplayTransaction;
