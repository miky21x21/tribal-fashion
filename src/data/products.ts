export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Handwoven Shawl",
    price: "₹1,200",
    image: "/images/products/shawl.jpg",
  },
  {
    id: 2,
    name: "Tribal Necklace",
    price: "₹800",
    image: "/images/products/necklace.jpg",
  },
  {
    id: 3,
    name: "Ethnic Kurta",
    price: "₹1,500",
    image: "/images/products/kurta.jpg",
  },
  {
    id: 4,
    name: "Dokra Earrings",
    price: "₹600",
    image: "/images/products/earrings.jpg",
  },
  {
    id: 5,
    name: "Handmade Bag",
    price: "₹1,000",
    image: "/images/products/bag.jpg",
  },
  {
    id: 6,
    name: "Painted Saree",
    price: "₹2,000",
    image: "/images/products/saree.jpg",
  },
];
