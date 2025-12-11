export interface User {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    role?: {
        id: number;
        name: string;
    };
}
