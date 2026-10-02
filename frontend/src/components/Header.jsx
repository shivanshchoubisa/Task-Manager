export default function Header({ theme, onToggleTheme, onCreate }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <h1>✅ Task Manager</h1>
        <div className="header-actions">
          <button
            className="btn btn-ghost"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className="btn btn-primary" onClick={onCreate}>
            + New Task
          </button>
        </div>
      </div>
    </header>
  );
}