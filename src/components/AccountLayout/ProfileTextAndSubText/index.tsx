type ProfileTextProps = {
	mainText?: string;
	subText?: string;
};

const ProfileTextAndSubText = ({ mainText, subText }: ProfileTextProps) => {
	return (
		<>
			<h2 className="text-[#101828] font-medium text=[18px]">{mainText}</h2>
			<p className="text-[#667085] font-normal text=[14px]">{subText}</p>
		</>
	);
};

export default ProfileTextAndSubText;
