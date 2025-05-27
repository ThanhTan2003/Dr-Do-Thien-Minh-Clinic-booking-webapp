export interface AuthenticationResponse {
    authenticated: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
}