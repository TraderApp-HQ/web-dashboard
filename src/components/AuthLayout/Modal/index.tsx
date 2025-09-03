import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import React, { Fragment } from "react";

interface IModal {
	open: boolean;
	setOpen(boo: boolean): void;
	children: React.ReactNode;
	width?: string;
}
export default function Modal({ children, open, setOpen, width = "579px" }: IModal) {
	function closeModal() {
		setOpen(!open);
	}
	return (
		<div>
			<Transition appear show={open} as={Fragment}>
				<Dialog as="div" className="relative z-[500]" onClose={closeModal}>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-[rgba(75,74,74,0.58)]" />
					</TransitionChild>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<TransitionChild
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<DialogPanel
									className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
									style={{ maxWidth: width }}
								>
									{children}
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
}
