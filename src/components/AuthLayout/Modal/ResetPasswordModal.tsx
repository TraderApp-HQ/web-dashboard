import Image from "next/image";
import Modal from ".";

interface IResetModal {
	open: boolean;
	setOpen(boo: boolean): void;
}

export default function ResetPasswordModal({ open, setOpen }: IResetModal) {
	return (
		<Modal open={open} setOpen={setOpen}>
			<section>
				<div>
					<header className="flex flex-col items-center mb-[40px]">
						<Image
							src="/images/auth/pen.png"
							width={73}
							height={73}
							alt="pen"
							className="mb-[12px] w-[73px] h-[73px]"
						/>
						<p className="text-[32px] text-[#102477] font-extrabold">
							Reset your password
						</p>
						<div className="flex items-center justify-center gap-x-[13px]">
							<p className="font-bold text-[#08123B]">Please check your email</p>
						</div>
					</header>
					<div>
						<p className="text-center text-[#01171F] font-bold text-[14px]">
							An email containing password reset instructions has been sent to the
							email address.
						</p>
					</div>
					<form className="space-y-[16px]">
						{/* action button */}
						<div className="p-[16px] space-y-[16px] flex flex-col items-center">
							<button
								type="button"
								className="bg-[#1836B2] max-w-[364px] rounded-2xl p-[10px] font-semibold w-full text-white"
								onClick={() => setOpen(false)}
							>
								Got it
							</button>
						</div>
					</form>
				</div>
			</section>
		</Modal>
	);
}
