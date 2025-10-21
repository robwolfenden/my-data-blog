import { Container } from '@mantine/core';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer__inner" size={960}>
        <p>© {new Date().getFullYear()} • MIT Licensed</p>
        <p className="site-footer__links">
          <a href="/rss.xml">rss</a>
          <a href="https://github.com/robwolfenden/my-data-blog" rel="noopener noreferrer">
            view source
          </a>
        </p>
      </Container>
    </footer>
  );
}