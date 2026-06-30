export function Footer() {
  return (
    <footer style={{ marginTop: 'auto', paddingTop: '32px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid var(--card-border)' }}>
      <p>Ohara Library © 2026. Made with GUSTO in Massachusetts.</p>
      <p style={{ marginTop: '4px', fontSize: '11px' }}>
        Configured for automatic deployment to <a href="https://fly.io" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--text-muted)' }}>fly.io</a>.
      </p>
    </footer>
  );
}
