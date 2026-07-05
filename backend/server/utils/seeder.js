const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Product = require("../models/Product");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({ role: "admin" }),
    Category.deleteMany(),
    Brand.deleteMany(),
    Product.deleteMany(),
  ]);

  console.log("Creating admin user...");
  await User.create({
    name: "NovaCart Admin",
    email: "admin@novacart.com",
    password: "Admin@12345",
    role: "admin",
    isEmailVerified: true,
  });

  console.log("Creating categories...");
  const categories = await Category.insertMany([
    {
      name: "Men",
      description: "Men's fashion and apparel",
      image: {
        url: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800",
        publicId: "novacart/sample/category-men",
      },
    },
    {
      name: "Women",
      description: "Women's fashion and apparel",
      image: {
        url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
        publicId: "novacart/sample/category-women",
      },
    },
    {
      name: "Footwear",
      description: "Shoes and sneakers",
      image: {
        url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
        publicId: "novacart/sample/category-footwear",
      },
    },
    {
      name: "Accessories",
      description: "Bags, watches, and more",
      image: {
        url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
        publicId: "novacart/sample/category-accessories",
      },
    },
    {
      name: "Electronics",
      description: "Gadgets and devices",
      image: {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        publicId: "novacart/sample/category-electronics",
      },
    },
  ]);

  console.log("Creating brands...");
  const brands = await Brand.insertMany([
    { name: "Nova Essentials", description: "In-house premium essentials" },
    { name: "Urban Edge", description: "Streetwear and modern fits" },
    { name: "Nimbus", description: "Athletic performance wear" },
    { name: "Aurora", description: "Luxury accessories" },
  ]);

  console.log("Creating sample products...");

  const imagePool = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800",
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
  ];

  const products = [];
  const titles = [
    "Essential Cotton Tee",
    "Tailored Wool Blazer",
    "Classic Denim Jacket",
    "Performance Running Sneakers",
    "Minimalist Leather Watch",
    "Structured Canvas Tote",
    "Cashmere Blend Sweater",
    "Slim Fit Chino Trousers",
  ];

  titles.forEach((title, i) => {
    const image = {
      url: imagePool[i % imagePool.length],
      publicId: `novacart/sample/placeholder-${i}`,
      altText: title,
    };

    products.push({
      title,
      description: `${title} — crafted with premium materials for everyday comfort and timeless style. Designed to move with you, built to last.`,
      shortDescription: `Premium ${title.toLowerCase()} for everyday wear.`,
      brand: brands[i % brands.length]._id,
      category: categories[i % categories.length]._id,
      images: [image],
      price: 49.99 + i * 15,
      discountPrice: i % 2 === 0 ? 39.99 + i * 10 : 0,
      stock: 50 + i * 5,
      sku: `NC-SKU-${1000 + i}`,
      tags: ["premium", "new", title.split(" ")[0].toLowerCase()],
      isFeatured: i % 3 === 0,
      isNewArrival: i % 2 === 0,
      isTrending: i % 4 === 0,
    });
  });

  await Product.insertMany(products);

  console.log("Seeding complete!");
  console.log("Admin login -> email: admin@novacart.com | password: Admin@12345");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});