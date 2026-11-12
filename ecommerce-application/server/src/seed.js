// LOCAL DEV ONLY — seeds the database with sample products and an admin user.
// Admin: admin@shop.local / Admin123!
// Run: npm run seed (requires MONGO_URI, e.g. via docker compose exec server npm run seed)
require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const products = require('./data/products');

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await User.deleteMany({});
  await Product.insertMany(products);
  await User.create({ name: 'Admin', email: 'admin@shop.local', password: 'Admin123!', isAdmin: true });
  console.log(`Seeded ${products.length} products and admin user admin@shop.local`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
