import mongoose from "mongoose";
import path from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, "../.env.local") });

// MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mongolzshop";

// Product data
const products = [
  {
    id: "17624",
    title: "The MongolZ - Pro Jersey 2025",
    description: "Official Jersey. Ази size учраас нэг size томруулж аваарай.",
    price: 150000,
    price_on_sale: null,
    image:
      "https://kom-uploads.s3.amazonaws.com/store-1599/product-17624--1733167005-w400.jpg",
    sizes: ["XL", "2XL", "3XL", "5XL"],
    category: "jersey",
    inStock: true,
  },
  {
    id: "63535",
    title: "The MongolZ - Kids Jersey (No Sponsor Logos)",
    description: "Хүүхдэд зориулсан жижиг размерын өмсгөл.",
    price: 80000,
    price_on_sale: null,
    image:
      "https://kom-uploads.s3.amazonaws.com/store-1599/product-63535--1736944491-w400.jpg",
    sizes: ["2XS", "3XS", "4XS", "5XS"],
    category: "kids",
    inStock: true,
  },
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get the Product model
    const Product = mongoose.model(
      "Product",
      new mongoose.Schema({
        id: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        price_on_sale: { type: Number, default: null },
        image: { type: String, required: true },
        sizes: { type: [String], required: true },
        category: { type: String, default: "jersey" },
        inStock: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      })
    );

    // Clear existing data
    console.log("Clearing existing products...");
    await Product.deleteMany({});

    // Insert new data
    console.log("Inserting products...");
    await Product.insertMany(products);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the seeding function
seedProducts();
