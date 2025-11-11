import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex justify-center items-center">
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-3">Bem-vindo a Plataforma de Gestão para Grupos de Networking</h2>
        <p className="text-gray-600 mb-6">
          Um ambiente colaborativo para membros e empreendedores conectarem oportunidades.
        </p>
        <div className="flex justify-center items-center flex-col gap-2">
          <Link
            href="/intencao"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Enviar Intenção de Participação
          </Link>
          <Link
            href="/indicacao"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Sistema de Indicações
          </Link>
          <Link
            href="/admin"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Área do Administrador
          </Link>
        </div>
      </section>
    </div>
  );
}