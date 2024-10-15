import { Polygon } from "~/components/Loaders";
import { iInviteCodeProps } from "~/apis/handlers/users/interfaces";

function InviteCode({ code, title, subtext }: iInviteCodeProps) {
	return (
		<section className="mt-5">
			<h3 className="font-bold text-lg mb-1 text-[#102477]">{title}</h3>
			<p className="text-[#414141] font-light">{subtext}</p>

			<div className="rounded-md flex justify-between border border-[#DEE3F6] bg-white text-[#3E57BF] px-3 py-4 mt-3">
				{code ? (
					<>
						<p>{code}</p>
						<button onClick={() => navigator.clipboard.writeText(code)}>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M14 7C14 6.068 14 5.602 13.848 5.235C13.7475 4.99218 13.6001 4.77155 13.4143 4.58572C13.2284 4.3999 13.0078 4.25251 12.765 4.152C12.398 4 11.932 4 11 4H8C6.114 4 5.172 4 4.586 4.586C4 5.172 4 6.114 4 8V11C4 11.932 4 12.398 4.152 12.765C4.25251 13.0078 4.3999 13.2284 4.58572 13.4143C4.77155 13.6001 4.99218 13.7475 5.235 13.848C5.602 14 6.068 14 7 14"
									stroke="#08123B"
									strokeWidth="1.5"
								/>
								<path
									d="M18 10H12C10.8954 10 10 10.8954 10 12V18C10 19.1046 10.8954 20 12 20H18C19.1046 20 20 19.1046 20 18V12C20 10.8954 19.1046 10 18 10Z"
									stroke="#08123B"
									strokeWidth="1.5"
								/>
							</svg>
						</button>
					</>
				) : (
					<Polygon size="sm" variant="rounded" className="min-w-[60%]" />
				)}
			</div>
		</section>
	);
}

export { InviteCode };
