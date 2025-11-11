export default function SemAcessoPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Acesso Negado</h1>
      <p className="text-gray-600 max-w-md">
        Você não tem permissão para acessar esta área. 
        Caso acredite que isso é um erro, entre em contato com o administrador.
      </p>
    </div>
  );
}