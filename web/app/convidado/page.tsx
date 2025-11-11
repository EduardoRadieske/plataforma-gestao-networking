import { Suspense } from 'react';
import ConvidadoPage from './components/ConvidadoPage';

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ConvidadoPage />
    </Suspense>
  );
}
