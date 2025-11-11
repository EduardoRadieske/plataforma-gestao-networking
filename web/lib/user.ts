export function usuarioLogado() {
    const JWT_TOKEN = process.env.NEXT_PUBLIC_JWT_TOKEN || '';
    return JSON.parse(atob(JWT_TOKEN.split('.')[1]));
}