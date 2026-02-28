import type { promises } from "dns";

interface AuthState  {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null;
}

type AuthContext = {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null;
    refreshAuth: () => promises<boolean>;
    SignIn: () => promises<boolean>;
    SignOut: () => promises<boolean>;
}