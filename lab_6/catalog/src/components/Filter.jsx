export function Filter({ filter, genres, onFilterChange }) {
    const handleSort = (e) => {
        onFilterChange({ ...filter, sort: e.target.value });
    };

    const handleGenre = (e) => {
        onFilterChange({ ...filter, genre: e.target.value });
    };

    return (
        <div className="filter-bar">
            <div className="filter-bar__group">
                <label htmlFor="sort-select" className="filter-bar__label">
                    Сортування
                </label>
                <select
                    id="sort-select"
                    className="filter-bar__select"
                    value={filter.sort}
                    onChange={handleSort}
                >
                    <option value="rating-desc">Рейтинг: високий → низький</option>
                    <option value="rating-asc">Рейтинг: низький → високий</option>
                    <option value="year-desc">Рік: новіші</option>
                    <option value="year-asc">Рік: старіші</option>
                </select>
            </div>
            <div className="filter-bar__group">
                <label htmlFor="genre-select" className="filter-bar__label">
                    Жанр
                </label>
                <select
                    id="genre-select"
                    className="filter-bar__select"
                    value={filter.genre}
                    onChange={handleGenre}
                >
                    {genres.map((g) => (
                        <option key={g} value={g}>
                            {g === "all" ? "Усі жанри" : g}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
