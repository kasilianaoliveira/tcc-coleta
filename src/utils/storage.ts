export type User = {
	// id: string;
	// name: string;
	// role: string;
	token: string;

}

export function setUserLocalStorage(user: User | null) {
	localStorage.setItem("@auth.token", JSON.stringify(user));
}

export function getUserLocalStorage() {
	const json = localStorage.getItem("@auth.token");
	if (!json) {
		return null;
	}

	const user = JSON.parse(json);

	return user ?? null;

}