export function ItemCard({
    title,
    image,
    rating,
    description,
    onDelete,
}) {
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

    return (
        <article className="item-card">
            <div className="item-card__media">
                <img
                    className="item-card__image"
                    src={image}
                    alt={title}
                    loading="lazy"
                    width="240"
                    height="360"
                />
            </div>
            <div className="item-card__content">
                <h3 className="item-card__title">{title}</h3>
                <p className="item-card__rating" aria-label={`Рейтинг ${rating} з 5`}>
                    {stars}
                </p>
                <p className="item-card__description">{description}</p>
                <button
                    type="button"
                    className="item-card__delete"
                    onClick={onDelete}
                >
                    Видалити
                </button>
            </div>
        </article>
    );
}
