import Modal from "~/components/Modal";
import AtIcon from "~/components/icons/AtIcon";
import Success from "../Success";
import { useState } from "react";
import Button from "~/components/AccountLayout/Button";

interface OtpParam {
    openModal?: boolean,
    onClose?: () => void;
}
export default function ({ openModal, onClose }: OtpParam) {

    const [message, setMessage] = useState("You have successfully withdraw $20.00 form your main account.")
    const [isSuccess, setIsSuccess] = useState(false)
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setIsSuccess(true)
    }
    const handleSuccessClose = () => {
        setIsSuccess(false)
    }
    return (
        <>
            <Success openModal={isSuccess} message={message} onClose={handleSuccessClose} />
            <Modal openModal={openModal} width="md:w-[807px]">
                <div className="wallet-modal-btn-div flex-col px-8">
                    <AtIcon />
                    <div className="flex flex-col justify-center items-center pt-9">
                        <h3 className="text-[#102477] text-2xl font-bold">Verification code</h3>
                        <div className="text-[#666666] text-sm whitespace-pre-wrap text-center">
                            A code has been sent to your email address <span className="text-[#CA6B1B]"> “Goodnessoluwatobi23@gmail.com”</span> please enter the code sent to your  email.
                        </div>
                    </div>
                    <h3 className="text-[#102477] text-sm pt-5">OTP</h3>
                    <div className="flex space-x-1 pb-10">
                        <input type="texbox" className="otp-box"></input>
                        <input type="texbox" className="otp-box"></input>
                        <input type="texbox" className="otp-box"></input>
                        <input type="texbox" className="otp-box"></input>
                        <input type="texbox" className="otp-box"></input>
                        <input type="texbox" className="otp-box"></input>
                    </div>
                    <Button onClick={handleClose} fluid>
                        Confirm
                    </Button>
                </div>
            </Modal>
        </>
    );
}
