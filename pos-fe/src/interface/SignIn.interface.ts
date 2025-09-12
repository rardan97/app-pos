

export interface SignInReq {
    username: string;
    password: string;
}


export interface SignInRes {
    token: string;
    refreshToken: string;
    petugasId: number;
    petugasUsername: string;
    petugasRoles: string[];
    type: string;
}
