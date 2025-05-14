export default function Header() {
  const cars = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/cars/car${i + 1}.jpg`,
  alt: `Car`
}));
  return (
    <div className="grid grid-cols-4">
        {cars.map(img => (
            <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="object-cover w-8 h-8"
            />
        ))}
    </div>
  );
}
