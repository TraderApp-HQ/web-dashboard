import React from "react";
import InputField from "~/components/common/InputField";
import CopyIcon from "~/components/icons/CopyIcon";

interface IIpAddressesListProps {
	ipString: string;
	handleCopy: () => void;
}

const IpAddressesList: React.FC<IIpAddressesListProps> = ({ ipString, handleCopy }) => {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-gray-950 text-base font-bold uppercase">Important</h3>
				<span className="text-zinc-500 text-sm font-bold leading-tight">
					You must add TraderApp IP Addresses from below to your list of trusted IPs.
					Otherwise, if there are some days of inactivity, your API key will be deleted by
					the exchange.
				</span>
			</div>
			<InputField
				type="text"
				icon={{ name: <CopyIcon color="#1836B2" />, onClick: handleCopy }}
				labelText="IP Addresses"
				props={{ name: "ipaddress", disabled: true }}
				placeholder={ipString}
			/>
		</div>
	);
};

export default IpAddressesList;
