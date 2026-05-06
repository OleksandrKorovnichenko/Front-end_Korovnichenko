import { useState } from "react";

const PLACEHOLDER_IMAGE =
    "https://placehold.co/240x360/1e293b/94a3b8?text=New";

export function AddItemForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState("4");

    const handleSubmit = (e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;

        onAdd({
            title: t,
            description: description.trim() || "Без опису.",
            image: PLACEHOLDER_IMAGE,
            rating: Math.min(5, Math.max(1, Number(rating) || 4)),
            genre: "Custom",
            year: new Date().getFullYear(),
        });

        setTitle("");
        setDescription("");
        setRating("4");
    };

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <h2 className="add-form__title">Додати книгу</h2>
            <div className="add-form__row">
                <label htmlFor="add-title" className="add-form__label">
                    Назва
                </label>
                <input
                    id="add-title"
                    className="add-form__input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Назва книги"
                    required
                />
            </div>
            <div className="add-form__row">
                <label htmlFor="add-desc" className="add-form__label">
                    Опис
                </label>
                <textarea
                    id="add-desc"
                    className="add-form__textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Короткий опис"
                    rows={2}
                />
            </div>
            <div className="add-form__row">
                <label htmlFor="add-rating" className="add-form__label">
                    Рейтинг (1–5)
                </label>
                <select
                    id="add-rating"
                    className="add-form__select"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <button type="submit" className="add-form__submit">
                Додати до каталогу
            </button>
        </form>
    );
}
