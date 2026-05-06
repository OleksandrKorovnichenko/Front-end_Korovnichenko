export function stableRatingFromString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i += 1) {
        h = Math.imul(31, h) + str.charCodeAt(i);
    }
    return (Math.abs(h) % 5) + 1;
}

export function filterBySearch(items, query) {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.title.toLowerCase().includes(q));
}

export function filterByGenre(items, genre) {
    if (!genre || genre === "all") return items;
    return items.filter(
        (item) =>
            (item.genre || "").toLowerCase() === genre.toLowerCase(),
    );
}

export function sortItems(items, sortMode) {
    const copy = [...items];
    switch (sortMode) {
        case "rating-desc":
            copy.sort((a, b) => b.rating - a.rating);
            break;
        case "rating-asc":
            copy.sort((a, b) => a.rating - b.rating);
            break;
        case "year-desc":
            copy.sort((a, b) => (b.year || 0) - (a.year || 0));
            break;
        case "year-asc":
            copy.sort((a, b) => (a.year || 0) - (b.year || 0));
            break;
        default:
            break;
    }
    return copy;
}

export function uniqueGenres(items) {
    const set = new Set(
        items.map((i) => i.genre).filter((g) => g && g !== "General"),
    );
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
}
