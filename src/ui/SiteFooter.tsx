export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__links" style={{ display: 'flex', gap: 16 }}>
          <a href="#">rss</a>
          <a href="#">github</a>
          <a href="#">view source</a>
        </div>
        <span className="site-footer__copy">© 2025 MIT Licensed</span>
      </div>
    </footer>
  );
}