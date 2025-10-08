import { APIClient } from "~/apis/apiClient";
import { UsersService } from "~/apis/handlers/users";

export function createServiceClient(baseURL = "/api/proxy") {
	const usersService = new UsersService();
	const apiClient = new APIClient(
		baseURL, // This will be overridden in APIClient
		usersService.refreshUserAccessToken.bind(usersService),
	);
	return { apiClient, usersService };
}
