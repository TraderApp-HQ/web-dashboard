export const getAccessToken = (): string | null => {
	return localStorage.getItem("myTAppAccessToken");
};

export const setAccessToken = (accessToken: string): void => {
	localStorage.setItem("myTAppAccessToken", accessToken);
};

export const removeAccessToken = (): void => {
	localStorage.removeItem("myTAppAccessToken");
};
