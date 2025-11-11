export enum LevelApi {  
    PUBLIC,
    PRIVATE
}

export const apiFetch = async <T>(
    endpoint: string,
    options: RequestInit = {},
    level: LevelApi = LevelApi.PUBLIC
): Promise<T> => {

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    let token = process.env.NEXT_PUBLIC_PUBLIC_TOKEN;

    if (level == LevelApi.PRIVATE) {
        token = process.env.NEXT_PUBLIC_JWT_TOKEN;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Erro ${res.status}`);
    }

    return res.json();
};