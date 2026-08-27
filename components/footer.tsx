export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-center text-sm text-text-muted">
      <div className="flex items-center justify-center gap-5">
        <a href="https://github.com/ryiatan1127" target="_blank" rel="noreferrer" className="hover:text-text">GitHub</a>
        <a href="mailto:ryiatan1127@gmail.com" className="hover:text-text">Email</a>
      </div>
      <p className="mt-4">© {new Date().getFullYear()} Ryia</p>
    </footer>
  );
}
