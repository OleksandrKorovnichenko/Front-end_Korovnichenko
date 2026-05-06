import { stableRatingFromString } from "../utils/helpers.js";

const PLACEHOLDER_IMAGE =
    "https://placehold.co/240x360/0f172a/64748b?text=No+Cover";

/**
 * @param {object} doc
 * @param {number} index
 */
export function mapOpenLibraryDocToItem(doc, index) {
    const title = doc.title?.trim() || "Untitled";
    const key = doc.key || `work-${index}`;
    const id = `${key}-${index}`;

    const coverId = doc.cover_i;
    const image = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : PLACEHOLDER_IMAGE;

    const authors = Array.isArray(doc.author_name)
        ? doc.author_name.join(", ")
        : "";

    const year = doc.first_publish_year ?? null;
    const parts = [];
    if (authors) parts.push(authors);
    if (year) parts.push(`Рік: ${year}`);
    const description = parts.join(" · ") || "Опис недоступний.";

    const genre =
        Array.isArray(doc.subject) && doc.subject.length > 0
            ? doc.subject[0]
            : "General";

    const rating = stableRatingFromString(`${title}${id}`);

    return {
        id,
        title,
        image,
        rating,
        description,
        genre,
        year,
    };
}

/**
 * @param {{ signal?: AbortSignal }} options
 */
export async function fetchBooks({ signal } = {}) {
    const url =
        "https://openlibrary.org/search.json?q=fiction&limit=20";

    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error("Не вдалося завантажити каталог з Open Library.");
    }

    const data = await response.json();
    const docs = Array.isArray(data.docs) ? data.docs : [];

    return docs.map((doc, index) => mapOpenLibraryDocToItem(doc, index));
}
