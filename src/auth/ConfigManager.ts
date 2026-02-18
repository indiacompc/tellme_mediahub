export const ConfigManager = {
	apiBase: process.env.NEXT_PUBLIC_BACKEND_URL!,
	publicApiBase: '/backend_api'
};
export const isProduction = process.env.NODE_ENV === 'production';

export const access_token_expire_minutes = process.env
	.ACCESS_TOKEN_EXPIRE_MINUTES as unknown as number;

export const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL || 'http://tellme360.media';

export default ConfigManager;
