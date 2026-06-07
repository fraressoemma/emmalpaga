import './globals.css';

export const metadata = {
  title: 'SansCigarette — Arrêter de fumer gratuitement',
  description: 'Application gratuite pour arrêter de fumer. Compteur en temps réel, économies, étapes santé, gestion des envies.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ background: '#070d0a' }}>{children}</body>
    </html>
  );
}
