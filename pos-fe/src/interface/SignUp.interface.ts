export interface SignUpReq {
    fullName: string;
    username: string;
    password: string;
    email: string;
    role: string;
}

export interface SignUpRes {
    token: string;
    refreshToken: string;
    username: string;
    roles: string[];
}