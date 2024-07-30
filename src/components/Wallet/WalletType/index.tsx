import ArrowDown from "~/components/icons/ArrowDown";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Wallet } from "~/lib/types";

interface CustomWalletTypeParam {
    className?: string,
    wallets: Wallet[],
    selectedDefault: Wallet,
    onSelected?: (wallett: Wallet) => void;
}

export default function ({ className, wallets, selectedDefault, onSelected }: CustomWalletTypeParam) {
    const [isOpen, setIsOpen] = useState(false)
    const [, setSelectedWallet] = useState(selectedDefault)
    const handleClick = () => {
        setIsOpen(!isOpen);
    }
    const handleSelect = (wallet: Wallet) => {
        setSelectedWallet(wallet)
        setIsOpen(!isOpen);
        if (onSelected) {
            onSelected(wallet)
        }
    }

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: { target: any }) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen && setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [setIsOpen]);

    return (<div ref={ref} className={clsx("dropdown w-full cursor-pointer", className)}>
        <div onClick={handleClick} className={clsx("flex justify-between border-0 items-center border-[#DEE3F6] p-1 rounded")}>
            <ArrowDown className="w-4 h-4" />
        </div>
        <div className={clsx("z-10 dropdown-content bg-white divide-y absolute divide-gray-100 rounded-lg shadow w-5/6", isOpen ? "block" : "hidden")}>
            <ul className="py-2 text-sm text-gray-700 ">
                {wallets && wallets.map((item) =>
                    <li onClick={() => handleSelect(item)}>
                        <button type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                            <div className="inline-flex items-center">
                                {item?.name}
                            </div>
                        </button>
                    </li>)}
            </ul>
        </div>
    </div>)
}