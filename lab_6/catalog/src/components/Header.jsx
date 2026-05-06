export function Header({ searchQuery, onSearch }) {
    return (
        <header className="header">
            <div className="header__brand">
                <h1 className="header__title">Book Catalog</h1>
                <p className="header__tagline">Лабораторна 6 — React + Vite</p>
            </div>
            <label className="header__search-label">
                <span className="visually-hidden">Пошук за назвою</span>
                <input
                    type="search"
                    className="header__search"
                    placeholder="Пошук за назвою…"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    autoComplete="off"
                />
            </label>
        </header>
    );
}
