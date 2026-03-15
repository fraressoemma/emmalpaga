import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'EmmAlpaga — Bucket List de Voyages',
  description: 'Planifiez vos rêves de voyage avec une carte interactive et une liste personnalisée de destinations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
