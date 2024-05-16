declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_API_URL: string;
		CRYPT_SECRET_KEY: string;
	}
}

declare module "react-autocomplete";
