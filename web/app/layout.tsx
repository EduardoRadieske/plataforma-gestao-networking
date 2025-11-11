import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grupos de Networking',
  description: 'Plataforma de Gestão para Grupos de Networking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-800 font-sans antialiased">
        <header className="w-full bg-blue-700 text-white py-4 shadow">
          <h1 className="text-center text-2xl font-bold tracking-wide">
            🌐 Grupos de Networking
          </h1>
        </header>

        <main>
          {children}
        </main>

        <footer className="w-full text-center text-sm text-gray-500 py-4 border-t border-gray-200">
          © {new Date().getFullYear()} Grupos de Networking — Todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}