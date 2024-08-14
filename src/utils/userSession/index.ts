import type { UserRole } from "~/apis/handlers/users/enums";
import { serverRedirect } from "~/helpers";

interface IRequireUserSession {
	request: Request;
	allowedRoles?: UserRole[];
}

export async function requireUserSession({ request }: IRequireUserSession) {
	const cookieHeader = request.headers.get("Cookie");

	// Parse cookies (you might need a library like `cookie` to parse the cookie header)
	const cookies = parseCookies(cookieHeader);

	// Check for the presence of the httpOnly cookie
	const isHttpOnlyCookieSet = !!cookies["refreshToken"];
	if (!isHttpOnlyCookieSet) {
		throw serverRedirect("/");
	}
}

// Utility function to parse cookies (you can use the `cookie` library for this)
function parseCookies(cookieHeader: string | null): Record<string, string> {
	if (!cookieHeader) return {};

	const cookies: Record<string, string> = {};

	cookieHeader.split(";").forEach((cookie) => {
		const [name, ...parts] = cookie.split("=").map((part) => part.trim());
		const value = parts.join("=");

		if (name && value) {
			console.log("name: ", name, "value: ", value);
			cookies[name] = decodeURIComponent(value);
		}
	});

	return cookies;
}
