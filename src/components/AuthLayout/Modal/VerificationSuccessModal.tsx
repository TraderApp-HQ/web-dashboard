import Modal from ".";
import { useRouter } from "next/router";

interface ISuccessModal {
  open: boolean;
  setOpen(boo: boolean): void;
}
export default function VerificationSuccessModal({ open, setOpen }: ISuccessModal) {
  const router = useRouter();

  return (
    <Modal open={open} setOpen={setOpen}>
      <section>
        <div>
          <header className="flex flex-col items-center mb-[20px]">
            <img src="/images/auth/thumbs.png" width={73} alt="thumbs" className="mb-[12px]" />
            <p className="text-[32px] text-[#102477] font-extrabold">Verification Successful</p>
            <div className="flex items-center justify-center gap-x-[13px]">
              <p className="font-bold text-[#08123B]">Your email verification was successful.</p>
            </div>
          </header>
          <form className="space-y-[16px]">
            {/* action button */}
            <div className="p-[16px] space-y-[16px] flex flex-col items-center">
              <button
                type="button"
                className="bg-[#1836B2] max-w-[364px] rounded-2xl p-[10px] font-semibold w-full text-white"
                onClick={() => {
                  router.push("/auth/login");
                }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </section>
    </Modal>
  );
}
