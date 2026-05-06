import { useEffect, useMemo, useState } from "react";
import { fetchBooks } from "../services/api.js";
import {
    filterByGenre,
    filterBySearch,
    sortItems,
    uniqueGenres,
} from "../utils/helpers.js";
import { AddItemForm } from "./AddItemForm.jsx";
import { Filter } from "./Filter.jsx";
import { Header } from "./Header.jsx";
import { ItemList } from "./ItemList.jsx";
import { Section } from "./Section.jsx";

export function App() {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState({
        sort: "rating-desc",
        genre: "all",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchBooks({ signal: controller.signal });
                setItems(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Сталася невідома помилка.",
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        load();
        return () => controller.abort();
    }, []);

    const genres = useMemo(() => uniqueGenres(items), [items]);

    const visibleItems = useMemo(() => {
        let list = filterBySearch(items, searchQuery);
        list = filterByGenre(list, filter.genre);
        list = sortItems(list, filter.sort);
        return list;
    }, [items, searchQuery, filter]);

    const handleAdd = (payload) => {
        const newItem = {
            ...payload,
            id: `local-${Date.now()}`,
        };
        setItems((prev) => [...prev, newItem]);
    };

    const handleDelete = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="app">
            <Header searchQuery={searchQuery} onSearch={setSearchQuery} />

            <main className="main">
                {isLoading ? (
                    <p className="state state--loading">Завантаження…</p>
                ) : null}

                {error ? (
                    <p className="state state--error" role="alert">
                        Помилка: {error}
                    </p>
                ) : null}

                {!isLoading && !error ? (
                    <>
                        {items.length === 0 ? (
                            <p className="state">Каталог порожній</p>
                        ) : (
                            <>
                                <Filter
                                    filter={filter}
                                    genres={genres}
                                    onFilterChange={setFilter}
                                />
                                {visibleItems.length === 0 ? (
                                    <p className="state">Нічого не знайдено</p>
                                ) : (
                                    <Section title="Каталог">
                                        <ItemList
                                            items={visibleItems}
                                            onDelete={handleDelete}
                                        />
                                    </Section>
                                )}
                            </>
                        )}
                    </>
                ) : null}

                <Section title="Додати книгу">
                    <AddItemForm onAdd={handleAdd} />
                </Section>
            </main>
        </div>
    );
}
