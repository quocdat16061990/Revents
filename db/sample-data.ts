import { hashSync } from 'bcrypt-ts-edge'; // Import the hashSync function from the bcrypt-ts-edge library

export const sampleData = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: hashSync('123456', 10),
      role: 'ADMIN',
    },
    {
      name: 'Jane',
      email: 'jane@example.com',
      password: hashSync('123456', 10),
      role: 'USER',
    },
  ],

  products: [
    {
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
      ],
      brand: "Apple",
      description: "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
      stock: 50,
      price: 999.99,
      rating: 4.8,
      numReviews: 1250,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200"
    },
    {
      name: "MacBook Pro 16-inch",
      slug: "macbook-pro-16",
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"
      ],
      brand: "Apple",
      description: "Powerful laptop with M3 Pro chip, stunning Liquid Retina XDR display, and all-day battery life.",
      stock: 25,
      price: 2499.99,
      rating: 4.9,
      numReviews: 890,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200"
    },
    {
      name: "Sony WH-1000XM5 Headphones",
      slug: "sony-wh-1000xm5",
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
      ],
      brand: "Sony",
      description: "Industry-leading noise canceling wireless headphones with 30-hour battery life.",
      stock: 75,
      price: 399.99,
      rating: 4.7,
      numReviews: 2100,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200"
    },
    {
      name: "Nike Air Max 270",
      slug: "nike-air-max-270",
      category: "Fashion",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"
      ],
      brand: "Nike",
      description: "Comfortable running shoes with Max Air cushioning and breathable mesh upper.",
      stock: 100,
      price: 150.00,
      rating: 4.5,
      numReviews: 3200,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200"
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
      ],
      brand: "Samsung",
      description: "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features.",
      stock: 40,
      price: 1199.99,
      rating: 4.6,
      numReviews: 980,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200"
    },
    {
      name: "Levi's 501 Original Jeans",
      slug: "levis-501-original",
      category: "Fashion",
      images: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
        "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500"
      ],
      brand: "Levi's",
      description: "Classic straight-fit jeans made from 100% cotton denim with timeless style.",
      stock: 200,
      price: 89.99,
      rating: 4.3,
      numReviews: 4500,
      isFeatured: false,
      banner: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200"
    },
    {
      name: "KitchenAid Stand Mixer",
      slug: "kitchenaid-stand-mixer",
      category: "Home & Garden",
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
      ],
      brand: "KitchenAid",
      description: "Professional-grade stand mixer with 5-quart bowl and multiple attachments.",
      stock: 15,
      price: 329.99,
      rating: 4.9,
      numReviews: 1200,
      isFeatured: true,
      banner: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200"
    }
  ]
};
