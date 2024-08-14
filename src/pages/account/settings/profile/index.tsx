import ProfileTextAndSubText from "~/components/AccountLayout/ProfileTextAndSubText";
import UserProfileField from "~/components/AccountLayout/UserProfileField";
import UserTile from "~/components/AccountLayout/UserTile";
import useUserProfileData from "~/hooks/useUserProfileData";
import { NestedSettingsLayout } from "..";

const ProfileSettings = () => {
	const { userProfile, userEmail, userFirstNameInitials, userLastNameInitials, userFullName } =
		useUserProfileData();

	return (
		<div>
			<div className="w-12/12 lg:w-10/12 2xl:w-10/12">
				<ProfileTextAndSubText
					mainText="Personal info"
					subText="Update your photo and personal details here."
				/>
			</div>
			<div className="mt-6 border-b" />
			<div className="mt-10 mb-6">
				<ProfileTextAndSubText
					mainText="Your photo"
					subText="This will be displayed on your profile."
				/>
			</div>
			<div>
				<UserTile
					firstName={userFirstNameInitials}
					lastName={userLastNameInitials}
					size={{ width: "39px", height: "39px" }}
				/>
			</div>
			<div className="flex flex-row flex-wrap items-center max-[640px]:justify-center gap-4 mt-6 border-b">
				<UserProfileField fieldLabel="Name" fieldValue={userFullName} />
				<UserProfileField fieldLabel="Email" fieldValue={userEmail} />
			</div>
			<div className="flex flex-row flex-wrap items-center max-[640px]:justify-center gap-4 mt-6 border-b">
				<UserProfileField fieldLabel="Country" fieldValue={userProfile?.countryName} />
				<UserProfileField fieldLabel="Phone number" fieldValue={userProfile?.phone} />
			</div>
		</div>
	);
};

ProfileSettings.getLayout = (page: React.ReactElement) => <NestedSettingsLayout>{page}</NestedSettingsLayout>;
export default ProfileSettings;
