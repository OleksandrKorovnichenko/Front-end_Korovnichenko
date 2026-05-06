import { ItemCard } from "./ItemCard.jsx";

export function ItemList({ items, onDelete }) {
    return (
        <ul className="item-list">
            {items.map((item) => (
                <li key={item.id} className="item-list__item">
                    <ItemCard
                        title={item.title}
                        image={item.image}
                        rating={item.rating}
                        description={item.description}
                        onDelete={() => onDelete(item.id)}
                    />
                </li>
            ))}
        </ul>
    );
}
