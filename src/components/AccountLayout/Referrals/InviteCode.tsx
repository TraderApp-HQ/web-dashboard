import React from "react";
import { IInviteCodeProps } from "~/apis/handlers/users/interfaces";
import Toast from "~/components/common/Toast";
import ComponentError from "~/components/Error/ComponentError";
import { CopyIcon2 } from "~/components/icons/CopyIcon";
import { Polygon } from "~/components/Loaders";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";

const InviteCode: React.FC<IInviteCodeProps> = ({ code, title, isError }) => {
	const { copyMessage, copyToClipboard } = useCopyToClipboard();
	return (
		<section className="mt-5">
			<h3 className="font-bold text-lg mb-1 text-[#0A0D14]">{title}</h3>
			{isError ? (
				<ComponentError />
			) : (
				<div className="rounded-md flex justify-between border border-[#DEE3F6] bg-white text-[#3E57BF] px-3 py-4 mt-2">
					{code ? (
						<>
							<p>{code}</p>
							<button onClick={() => copyToClipboard(code)}>
								<CopyIcon2 />
							</button>
						</>
					) : (
						<Polygon size="sm" variant="rounded" className="min-w-[60%]" />
					)}
				</div>
			)}
			{copyMessage && (
				<Toast
					type="success"
					variant="outlined"
					title="Success"
					message={copyMessage}
					autoVanish
				/>
			)}
		</section>
	);
};

export { InviteCode };
