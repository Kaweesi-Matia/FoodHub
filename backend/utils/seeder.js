// Comprehensive demo seed data for local development.
// Run with: npm run seed         (reset + import)
//           npm run seed:destroy (wipe everything)

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

dotenv.config();
await connectDB();

const password = "password123";

const ownerSeeds = [
  ["Kampala Grill Owner", "grill@demo.com", "+256700100001"],
  ["Pizza Hub Owner", "pizza@demo.com", "+256700100002"],
  ["Spice Garden Owner", "indian@demo.com", "+256700100003"],
  ["Dragon Wok Owner", "chinese@demo.com", "+256700100004"],
  ["Burger House Owner", "burger@demo.com", "+256700100005"],
  ["Green Bowl Owner", "greenbowl@demo.com", "+256700100006"],
  ["Lake Victoria Owner", "lakevictoria@demo.com", "+256700100007"],
  ["Nile Bites Owner", "nilebites@demo.com", "+256700100008"],
  ["Acacia Cafe Owner", "acacia@demo.com", "+256700100009"],
  ["Royal Ethiopian Owner", "ethiopian@demo.com", "+256700100010"],
  ["Matooke Kitchen Owner", "matooke@demo.com", "+256700100011"],
  ["City Breakfast Owner", "breakfast@demo.com", "+256700100012"],
];

const customerSeeds = [
  ["Jane Customer", "jane@example.com", "+256701000001"],
  ["David Customer", "david@example.com", "+256701000002"],
  ["Sarah Namukasa", "sarah@example.com", "+256701000003"],
  ["Brian Okello", "brian@example.com", "+256701000004"],
  ["Mercy Achieng", "mercy@example.com", "+256701000005"],
  ["Daniel Kato", "daniel@example.com", "+256701000006"],
  ["Rebecca Nankya", "rebecca@example.com", "+256701000007"],
  ["Michael Ssemanda", "michael@example.com", "+256701000008"],
  ["Grace Atwine", "grace@example.com", "+256701000009"],
  ["Joseph Mugisha", "joseph@example.com", "+256701000010"],
  ["Esther Auma", "esther@example.com", "+256701000011"],
  ["Peter Walugembe", "peter@example.com", "+256701000012"],
  ["Linda Nakato", "linda@example.com", "+256701000013"],
  ["Andrew Tumusiime", "andrew@example.com", "+256701000014"],
  ["Patricia Namirembe", "patricia@example.com", "+256701000015"],
  ["Samuel Ouma", "samuel@example.com", "+256701000016"],
  ["Ruth Nabirye", "ruth@example.com", "+256701000017"],
  ["Charles Lwanga", "charles@example.com", "+256701000018"],
  ["Diana Akech", "diana@example.com", "+256701000019"],
  ["Alex Musoke", "alex@example.com", "+256701000020"],
];

const extraMenuByCuisine = {
  Ugandan: [
    ["Matooke & Beef Stew", "Steamed green bananas served with tender beef in rich tomato gravy.", 19000, "Mains", false, ["local", "popular"]],
    ["Matooke & Groundnut Sauce", "Soft matooke served with creamy traditional groundnut sauce.", 17000, "Mains", true, ["local", "vegetarian"]],
    ["Posho & Beans", "Classic Ugandan posho served with slow-cooked beans and vegetables.", 14000, "Mains", true, ["local", "vegetarian"]],
    ["Beef Pilau", "Fragrant East African rice cooked with beef and warm pilau spices.", 22000, "Rice", false, ["local"]],
    ["Chicken Pilau", "Spiced pilau rice with tender chicken and caramelized onions.", 24000, "Rice", false, ["local", "popular"]],
    ["Katogo with Chicken", "Matooke and chicken simmered together with tomatoes and onions.", 18000, "Breakfast & Snacks", false, ["local"]],
    ["Cassava Chips", "Crispy seasoned cassava chips served with a fresh dipping sauce.", 8000, "Sides", true, ["local", "vegetarian"]],
    ["Sweet Plantain", "Golden fried ripe plantain with a lightly caramelized finish.", 9000, "Sides", true, ["local", "vegetarian"]],
    ["Gonja Fries", "Crispy fried cooking banana slices, a Ugandan street-food favorite.", 9000, "Sides", true, ["local", "vegetarian"]],
    ["Samosa Beef", "Crisp pastry filled with seasoned minced beef and vegetables.", 7000, "Snacks", false, ["snack"]],
    ["Samosa Vegetable", "Crisp pastry filled with potato, peas and aromatic spices.", 6000, "Snacks", true, ["snack", "vegetarian"]],
    ["Fresh Sugarcane Juice", "Freshly pressed sugarcane juice served chilled.", 6000, "Drinks", true, ["fresh"]],
    ["Tamarind Juice", "Refreshing homemade tamarind drink with a sweet-tangy flavor.", 6000, "Drinks", true, ["fresh"]],
    ["African Coffee", "Freshly brewed East African coffee served hot.", 6000, "Drinks", true, ["hot"]],
    ["Mandazi", "Soft lightly sweetened fried dough, perfect with tea.", 5000, "Breakfast & Snacks", true, ["local", "breakfast"]],
  ],
  Grill: [
    ["Charcoal Beef Steak", "Juicy beef steak grilled over charcoal and served with house sauce.", 30000, "Mains", false, ["grill", "popular"]],
    ["Grilled Pork Ribs", "Slow-grilled pork ribs glazed with a smoky barbecue sauce.", 32000, "Mains", false, ["grill"]],
    ["BBQ Chicken Wings", "Charcoal-grilled chicken wings brushed with smoky BBQ glaze.", 22000, "Mains", false, ["grill", "popular"]],
    ["Grilled Goat Skewers", "Tender goat meat skewers grilled with peppers and onions.", 24000, "Mains", false, ["grill", "local"]],
    ["Grilled Tilapia", "Whole tilapia grilled with herbs, lemon and mild spices.", 30000, "Mains", false, ["grill", "fish"]],
    ["Grilled Chicken Breast", "Herb-marinated chicken breast grilled until juicy and tender.", 26000, "Mains", false, ["grill", "healthy"]],
    ["Beef Kebab Platter", "Charcoal beef kebabs with onions, peppers and house relish.", 28000, "Mains", false, ["grill"]],
    ["Grilled Sausages", "Seasoned beef sausages grilled and served with onions and sauce.", 15000, "Mains", false, ["grill"]],
    ["Corn on the Grill", "Sweet corn grilled over charcoal and finished with herb butter.", 9000, "Sides", true, ["grill", "vegetarian"]],
    ["Grilled Vegetables", "Seasonal peppers, onions, zucchini and carrots grilled with herbs.", 12000, "Sides", true, ["grill", "vegetarian"]],
    ["Garlic Butter Mushrooms", "Mushrooms grilled with garlic, butter and fresh herbs.", 13000, "Sides", true, ["grill", "vegetarian"]],
    ["Chips Masala", "Crispy fries tossed with tomato, onion, coriander and mild spices.", 12000, "Sides", true, ["popular"]],
    ["BBQ Beef Burger", "Charcoal beef patty with BBQ sauce, cheese, lettuce and onion.", 26000, "Burgers", false, ["grill", "popular"]],
    ["Grilled Chicken Salad", "Mixed greens topped with grilled chicken, avocado and tomato.", 22000, "Salads", false, ["grill", "healthy"]],
    ["Smoky BBQ Platter", "Mixed grilled chicken, beef, sausage and vegetables for sharing.", 55000, "Platters", false, ["grill", "sharing", "popular"]],
  ],
  Pizza: [
    ["Pepperoni Pizza", "Mozzarella, tomato sauce and savory beef pepperoni.", 39000, "Pizza", false, ["popular"]],
    ["Meat Lovers Pizza", "Beef pepperoni, minced beef, sausage, chicken and mozzarella.", 45000, "Pizza", false, ["popular"]],
    ["Chicken Tikka Pizza", "Indian-spiced chicken, mozzarella, peppers and red onion.", 40000, "Pizza", false, ["fusion"]],
    ["Peri Peri Chicken Pizza", "Spicy peri peri chicken, peppers, onions and mozzarella.", 40000, "Pizza", false, ["spicy", "popular"]],
    ["Beef & Mushroom Pizza", "Seasoned beef, mushrooms, onions and mozzarella.", 40000, "Pizza", false, ["popular"]],
    ["Four Cheese Pizza", "Mozzarella, cheddar, parmesan and blue cheese blend.", 42000, "Pizza", true, ["vegetarian"]],
    ["Spinach & Feta Pizza", "Spinach, feta, tomato, mozzarella and herbs.", 37000, "Pizza", true, ["vegetarian"]],
    ["Mediterranean Veggie Pizza", "Olives, peppers, tomato, onion, spinach and feta.", 38000, "Pizza", true, ["vegetarian"]],
    ["BBQ Beef Pizza", "BBQ beef strips, caramelized onions and mozzarella.", 41000, "Pizza", false, ["bbq"]],
    ["Tandoori Chicken Pizza", "Tandoori chicken, onion, coriander and creamy tikka sauce.", 42000, "Pizza", false, ["fusion"]],
    ["Pizza Fries", "Crispy fries topped with pizza sauce, cheese and beef pepperoni.", 18000, "Sides", false, ["popular"]],
    ["Mozzarella Sticks", "Crispy mozzarella sticks served with tomato dipping sauce.", 16000, "Sides", true, ["vegetarian"]],
    ["Cheesy Chicken Bread", "Oven-baked garlic bread filled with chicken and melted cheese.", 18000, "Sides", false, ["popular"]],
    ["Caramel Cheesecake", "Creamy cheesecake finished with a smooth caramel topping.", 14000, "Desserts", true, ["dessert"]],
    ["Strawberry Sundae", "Vanilla ice cream topped with strawberry sauce and whipped cream.", 12000, "Desserts", true, ["dessert"]],
  ],
  Chinese: [
    ["Beef Fried Rice", "Wok-fried rice with tender beef, egg and mixed vegetables.", 25000, "Rice", false, ["popular"]],
    ["Prawn Fried Rice", "Fragrant fried rice with prawns, egg, peas and spring onion.", 32000, "Rice", false, ["seafood"]],
    ["Yangzhou Fried Rice", "Classic fried rice with egg, vegetables, chicken and prawns.", 30000, "Rice", false, ["classic"]],
    ["Chicken Lo Mein", "Soft noodles stir-fried with chicken and fresh vegetables.", 27000, "Noodles", false, ["popular"]],
    ["Singapore Noodles", "Rice noodles with vegetables, egg and aromatic curry spices.", 25000, "Noodles", true, ["spicy"]],
    ["Beef & Broccoli", "Tender beef strips and broccoli in savory oyster-style sauce.", 29000, "Mains", false, ["popular"]],
    ["Orange Chicken", "Crispy chicken glazed in a sweet orange and ginger sauce.", 28000, "Mains", false, ["popular"]],
    ["Szechuan Beef", "Spicy beef stir-fry with peppers, onions and Szechuan seasoning.", 30000, "Mains", false, ["spicy"]],
    ["Mapo Tofu", "Silken tofu cooked with chili, garlic and savory bean sauce.", 24000, "Mains", true, ["vegetarian", "spicy"]],
    ["Vegetable Manchurian", "Crispy vegetable balls tossed in a tangy Chinese-style sauce.", 23000, "Mains", true, ["vegetarian"]],
    ["Prawn Spring Rolls", "Crispy pastry rolls filled with prawns and vegetables.", 18000, "Starters", false, ["seafood"]],
    ["Chicken Wonton Soup", "Light broth with chicken wontons, greens and spring onion.", 17000, "Soups", false, ["soup"]],
    ["Crispy Tofu", "Golden tofu cubes served with sweet chili dipping sauce.", 16000, "Starters", true, ["vegetarian"]],
    ["Sesame Cucumber Salad", "Fresh cucumber tossed with sesame, soy and chili dressing.", 12000, "Salads", true, ["vegetarian"]],
    ["Lychee Iced Tea", "Chilled black tea with lychee and fresh citrus.", 8000, "Drinks", true, ["fresh"]],
  ],
  Indian: [
    ["Lamb Rogan Josh", "Slow-cooked lamb in a fragrant tomato and Kashmiri spice gravy.", 38000, "Curries", false, ["popular"]],
    ["Chicken Korma", "Tender chicken in a creamy cashew, yogurt and spice sauce.", 34000, "Curries", false, ["mild"]],
    ["Palak Paneer", "Paneer cheese cooked in creamy spinach and aromatic spices.", 30000, "Vegetarian", true, ["vegetarian", "popular"]],
    ["Aloo Gobi", "Potatoes and cauliflower cooked with turmeric, cumin and coriander.", 22000, "Vegetarian", true, ["vegetarian"]],
    ["Dal Tadka", "Yellow lentils finished with garlic, cumin and sizzling spices.", 20000, "Vegetarian", true, ["vegetarian"]],
    ["Malai Kofta", "Vegetable and paneer dumplings in a creamy tomato sauce.", 28000, "Vegetarian", true, ["vegetarian"]],
    ["Lamb Biryani", "Aromatic basmati rice layered with spiced tender lamb.", 36000, "Rice", false, ["popular"]],
    ["Prawn Masala", "Prawns cooked in a rich tomato, coconut and spice gravy.", 38000, "Seafood", false, ["seafood"]],
    ["Tandoori Chicken", "Chicken marinated in yogurt and spices, roasted in a tandoor-style oven.", 34000, "Tandoor", false, ["popular"]],
    ["Chicken Seekh Kebab", "Minced chicken kebabs seasoned with herbs and Indian spices.", 30000, "Starters", false, ["popular"]],
    ["Aloo Paratha", "Stuffed flatbread filled with spiced potato and herbs.", 12000, "Breads", true, ["vegetarian"]],
    ["Butter Naan", "Soft naan brushed with butter and fresh coriander.", 9000, "Breads", true, ["vegetarian"]],
    ["Pani Puri", "Crisp puri filled with spiced potato and tangy flavored water.", 10000, "Snacks", true, ["vegetarian", "street-food"]],
    ["Gulab Jamun", "Soft milk dumplings soaked in fragrant cardamom syrup.", 10000, "Desserts", true, ["dessert"]],
    ["Kulfi", "Traditional Indian frozen dessert flavored with pistachio and cardamom.", 10000, "Desserts", true, ["dessert"]],
  ],
  "Fast Food": [
    ["Crispy Chicken Box", "Crispy chicken pieces, fries, coleslaw and dipping sauce.", 24000, "Mains", false, ["popular", "quick"]],
    ["Spicy Chicken Wrap", "Crispy chicken, lettuce, tomato and spicy mayo in a warm wrap.", 18000, "Wraps", false, ["spicy", "quick"]],
    ["Beef Shawarma", "Seasoned beef, salad, pickles and garlic sauce in flatbread.", 20000, "Wraps", false, ["popular"]],
    ["Chicken Shawarma", "Grilled chicken, fresh salad, pickles and garlic sauce.", 19000, "Wraps", false, ["popular"]],
    ["Beef Loaded Fries", "Crispy fries topped with seasoned beef, cheese and sauce.", 19000, "Sides", false, ["popular"]],
    ["Chicken Nuggets", "Golden chicken nuggets served with ketchup and dipping sauce.", 15000, "Snacks", false, ["kids", "quick"]],
    ["Fish Fingers", "Crispy breaded fish fingers with tartar-style sauce.", 18000, "Snacks", false, ["quick"]],
    ["Chicken Quesadilla", "Grilled tortilla filled with chicken, cheese, peppers and onions.", 22000, "Wraps", false, ["popular"]],
    ["Cheese Toastie", "Toasted bread filled with melted cheese and herbs.", 10000, "Snacks", true, ["vegetarian", "quick"]],
    ["Mini Pancake Stack", "Fluffy mini pancakes served with syrup and fruit.", 12000, "Breakfast", true, ["breakfast"]],
    ["Chicken Club Sandwich", "Triple-layer sandwich with chicken, egg, lettuce, tomato and mayo.", 22000, "Sandwiches", false, ["popular"]],
    ["Tuna Sandwich", "Tuna, lettuce, tomato and creamy dressing on toasted bread.", 18000, "Sandwiches", false, ["quick"]],
    ["Chicken Caesar Wrap", "Grilled chicken, lettuce, parmesan and Caesar dressing in a wrap.", 20000, "Wraps", false, ["popular"]],
    ["Mozzarella Panini", "Toasted panini with mozzarella, tomato, basil and pesto.", 18000, "Sandwiches", true, ["vegetarian"]],
    ["Vanilla Ice Cream", "Creamy vanilla ice cream served with chocolate drizzle.", 8000, "Desserts", true, ["dessert"]],
  ],
  Vegetarian: [
    ["Buddha Bowl", "Quinoa, chickpeas, avocado, roasted vegetables and tahini dressing.", 24000, "Bowls", true, ["vegetarian", "healthy"]],
    ["Lentil Curry Bowl", "Creamy lentil curry served with rice and fresh herbs.", 22000, "Bowls", true, ["vegetarian", "healthy"]],
    ["Vegetable Stir Fry", "Crisp seasonal vegetables wok-fried with ginger and garlic.", 20000, "Mains", true, ["vegetarian"]],
    ["Paneer Wrap", "Grilled paneer, peppers, onions and mint yogurt in a soft wrap.", 22000, "Wraps", true, ["vegetarian"]],
    ["Falafel Wrap", "Crispy falafel with hummus, tomato, cucumber and tahini.", 18000, "Wraps", true, ["vegetarian", "popular"]],
    ["Mushroom Pasta", "Penne pasta with mushrooms, garlic, herbs and creamy sauce.", 23000, "Pasta", true, ["vegetarian"]],
    ["Tomato Basil Pasta", "Pasta tossed with tomato, basil, garlic and parmesan.", 21000, "Pasta", true, ["vegetarian"]],
    ["Vegetable Lasagna", "Layers of pasta, roasted vegetables, tomato sauce and cheese.", 26000, "Pasta", true, ["vegetarian"]],
    ["Stuffed Bell Peppers", "Bell peppers filled with rice, beans, corn and herbs.", 22000, "Mains", true, ["vegetarian"]],
    ["Hummus & Pita", "Creamy chickpea hummus served with warm pita bread.", 14000, "Starters", true, ["vegetarian"]],
    ["Roasted Vegetable Plate", "Seasonal vegetables roasted with olive oil and herbs.", 18000, "Mains", true, ["vegetarian", "healthy"]],
    ["Caprese Salad", "Tomato, mozzarella, basil and balsamic dressing.", 18000, "Salads", true, ["vegetarian"]],
    ["Berry Smoothie", "Mixed berries blended with yogurt and banana.", 13000, "Smoothies", true, ["vegetarian", "fresh"]],
    ["Avocado Toast", "Toasted bread topped with smashed avocado, tomato and herbs.", 15000, "Breakfast", true, ["vegetarian", "breakfast"]],
    ["Vegetable Spring Rolls", "Crispy rolls filled with cabbage, carrot, peppers and herbs.", 12000, "Starters", true, ["vegetarian"]],
  ],
};

const restaurantSeeds = [
  {
    name: "Kampala Grill House",
    owner: "grill@demo.com",
    description: "Charcoal-grilled favorites and Ugandan classics prepared fresh every day.",
    cuisine: ["Ugandan", "Grill", "Local"],
    street: "12 Kampala Road",
    phone: "+256700100001",
    email: "grill@demo.com",
    priceRange: "$$",
    deliveryFee: 3,
    minOrderAmount: 5,
    estimatedDeliveryTime: "25-35 min",
    opening: "09:00",
    closing: "23:00",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1544025162-d76694265947",
    items: [
      ["Grilled Chicken & Chips", "Half chicken marinated in herbs and charcoal grilled, served with fries.", 22000, "Mains", false, ["popular", "grill"]],
      ["Beef Brochettes", "Tender beef skewers grilled over charcoal with onions and peppers.", 18000, "Mains", false, ["grill"]],
      ["Rolex Wrap", "Chapati rolled with a spiced vegetable omelette.", 8000, "Breakfast & Snacks", true, ["quick", "vegetarian"]],
      ["Chicken Rolex", "Fresh chapati wrapped around egg, grilled chicken and vegetables.", 12000, "Breakfast & Snacks", false, ["popular"]],
      ["Luwombo Stew", "Slow-cooked traditional groundnut stew served with matooke.", 20000, "Mains", false, ["local"]],
      ["Katogo Breakfast", "Matooke cooked with beef, tomatoes, onions and spices.", 16000, "Breakfast & Snacks", false, ["local"]],
      ["Garden Salad", "Crisp lettuce, tomato, cucumber, carrot and avocado.", 10000, "Sides", true, ["healthy", "vegetarian"]],
      ["Passion Fruit Juice", "Fresh passion fruit juice with no artificial flavoring.", 5000, "Drinks", true, ["fresh"]],
      ["African Tea", "Hot spiced milk tea served the Ugandan way.", 4000, "Drinks", true, ["hot"]],
      ["Chapati", "Soft layered chapati cooked fresh to order.", 3000, "Sides", true, ["local"]],
    ],
  },
  {
    name: "Kampala Pizza Hub",
    owner: "pizza@demo.com",
    description: "Hand-stretched pizzas, loaded sides and cold drinks for family and friends.",
    cuisine: ["Pizza", "Fast Food"],
    street: "Plot 18 Acacia Avenue, Kololo",
    phone: "+256700100002",
    email: "pizza@demo.com",
    priceRange: "$$$",
    deliveryFee: 4,
    minOrderAmount: 15000,
    estimatedDeliveryTime: "30-45 min",
    opening: "10:00",
    closing: "23:30",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    items: [
      ["Margherita Pizza", "Tomato sauce, mozzarella, basil and oregano.", 28000, "Pizza", true, ["vegetarian", "classic"]],
      ["Chicken BBQ Pizza", "BBQ chicken, mozzarella, onions and sweet peppers.", 38000, "Pizza", false, ["popular"]],
      ["Beef Pepperoni Pizza", "Pepperoni-style beef, mozzarella and tomato sauce.", 40000, "Pizza", false, ["popular"]],
      ["Veggie Supreme Pizza", "Mushrooms, peppers, onions, olives, tomato and mozzarella.", 35000, "Pizza", true, ["vegetarian"]],
      ["Hawaiian Pizza", "Chicken, pineapple, mozzarella and tomato sauce.", 36000, "Pizza", false, ["sweet"]],
      ["Garlic Bread", "Oven-baked bread brushed with garlic butter and herbs.", 10000, "Sides", true, ["side"]],
      ["Chicken Wings", "Crispy wings tossed in your choice of BBQ or spicy sauce.", 22000, "Sides", false, ["popular"]],
      ["Loaded Potato Wedges", "Seasoned wedges topped with cheese and herbs.", 16000, "Sides", true, ["vegetarian"]],
      ["Iced Tea", "Refreshing house iced tea with lemon.", 6000, "Drinks", true, ["drink"]],
      ["Chocolate Brownie", "Warm chocolate brownie served as a sweet finish.", 10000, "Desserts", true, ["dessert"]],
    ],
  },
  {
    name: "Spice Garden Kampala",
    owner: "indian@demo.com",
    description: "Aromatic Indian curries, biryanis, grills and vegetarian favorites.",
    cuisine: ["Indian", "Vegetarian"],
    street: "45 Bukoto Crescent, Bukoto",
    phone: "+256700100003",
    email: "indian@demo.com",
    priceRange: "$$$",
    deliveryFee: 4,
    minOrderAmount: 18000,
    estimatedDeliveryTime: "35-50 min",
    opening: "11:00",
    closing: "22:30",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    items: [
      ["Chicken Tikka Masala", "Tender chicken in a creamy tomato and spice sauce.", 32000, "Curries", false, ["popular"]],
      ["Butter Chicken", "Char-grilled chicken simmered in rich buttery tomato gravy.", 34000, "Curries", false, ["popular"]],
      ["Paneer Tikka", "Grilled Indian cottage cheese with peppers and aromatic spices.", 28000, "Starters", true, ["vegetarian"]],
      ["Chana Masala", "Chickpeas cooked with tomato, ginger, garlic and spices.", 22000, "Vegetarian", true, ["vegetarian"]],
      ["Vegetable Biryani", "Fragrant basmati rice cooked with seasonal vegetables and spices.", 26000, "Rice", true, ["vegetarian"]],
      ["Chicken Biryani", "Basmati rice layered with spiced chicken and saffron.", 30000, "Rice", false, ["popular"]],
      ["Garlic Naan", "Soft naan topped with roasted garlic and coriander.", 10000, "Breads", true, ["vegetarian"]],
      ["Samosa", "Crisp pastry filled with seasoned potato and peas.", 8000, "Starters", true, ["snack"]],
      ["Mango Lassi", "Creamy yogurt drink blended with ripe mango.", 9000, "Drinks", true, ["drink"]],
      ["Masala Chai", "Traditional Indian tea with cardamom and warming spices.", 6000, "Drinks", true, ["hot"]],
    ],
  },
  {
    name: "Dragon Wok Kampala",
    owner: "chinese@demo.com",
    description: "Chinese-inspired stir fries, noodles, rice and dumplings cooked to order.",
    cuisine: ["Chinese", "Fast Food"],
    street: "7 Kira Road, Kamwokya",
    phone: "+256700100004",
    email: "chinese@demo.com",
    priceRange: "$$",
    deliveryFee: 3.5,
    minOrderAmount: 15000,
    estimatedDeliveryTime: "25-40 min",
    opening: "10:30",
    closing: "22:30",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d",
    items: [
      ["Chicken Fried Rice", "Wok-fried rice with chicken, egg, peas and vegetables.", 24000, "Rice", false, ["popular"]],
      ["Vegetable Fried Rice", "Wok-fried rice with fresh vegetables and egg.", 20000, "Rice", true, ["vegetarian"]],
      ["Beef Chow Mein", "Stir-fried noodles with beef, cabbage, carrots and spring onions.", 26000, "Noodles", false, ["popular"]],
      ["Vegetable Chow Mein", "Stir-fried noodles loaded with crisp vegetables.", 22000, "Noodles", true, ["vegetarian"]],
      ["Sweet & Sour Chicken", "Crispy chicken with pineapple and sweet-tangy sauce.", 28000, "Mains", false, ["popular"]],
      ["Kung Pao Chicken", "Chicken, peanuts, vegetables and a mildly spicy sauce.", 29000, "Mains", false, ["spicy"]],
      ["Spring Rolls", "Crispy rolls filled with cabbage, carrot and herbs.", 12000, "Starters", true, ["vegetarian"]],
      ["Chicken Dumplings", "Steamed dumplings filled with seasoned chicken.", 18000, "Starters", false, ["popular"]],
      ["Hot & Sour Soup", "Classic Chinese soup with mushrooms, tofu and vegetables.", 14000, "Soups", true, ["vegetarian", "spicy"]],
      ["Ginger Lemon Tea", "Hot tea with fresh ginger and lemon.", 6000, "Drinks", true, ["hot"]],
    ],
  },
  {
    name: "Kampala Burger House",
    owner: "burger@demo.com",
    description: "Big burgers, crispy chicken, loaded fries and quick family meals.",
    cuisine: ["Fast Food", "Grill"],
    street: "22 Bombo Road, Wandegeya",
    phone: "+256700100005",
    email: "burger@demo.com",
    priceRange: "$$",
    deliveryFee: 2.5,
    minOrderAmount: 10000,
    estimatedDeliveryTime: "20-35 min",
    opening: "09:00",
    closing: "23:00",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    items: [
      ["Classic Beef Burger", "Beef patty, lettuce, tomato, onion and house sauce.", 22000, "Burgers", false, ["popular"]],
      ["Double Cheese Burger", "Two beef patties with double cheese and burger sauce.", 30000, "Burgers", false, ["popular"]],
      ["Crispy Chicken Burger", "Crunchy chicken fillet with lettuce and creamy sauce.", 24000, "Burgers", false, ["chicken"]],
      ["Veggie Burger", "Plant-based patty with lettuce, tomato and avocado sauce.", 22000, "Burgers", true, ["vegetarian"]],
      ["Chicken & Chips", "Crispy chicken strips with seasoned fries.", 20000, "Mains", false, ["quick"]],
      ["Loaded Fries", "Crispy fries topped with cheese, beef and house sauce.", 18000, "Sides", false, ["popular"]],
      ["Onion Rings", "Golden crispy onion rings with dipping sauce.", 10000, "Sides", true, ["vegetarian"]],
      ["Coleslaw", "Fresh cabbage slaw with a creamy dressing.", 7000, "Sides", true, ["vegetarian"]],
      ["Milkshake", "Thick vanilla, chocolate or strawberry milkshake.", 10000, "Drinks", true, ["drink"]],
      ["Fresh Lemonade", "Chilled lemonade made with fresh lemons.", 6000, "Drinks", true, ["fresh"]],
    ],
  },
  {
    name: "Green Bowl Kampala",
    owner: "greenbowl@demo.com",
    description: "Fresh salads, healthy bowls, smoothies and plant-forward meals.",
    cuisine: ["Vegetarian", "Fast Food"],
    street: "9 Kisementi Lane, Kisementi",
    phone: "+256700100006",
    email: "greenbowl@demo.com",
    priceRange: "$$$",
    deliveryFee: 3,
    minOrderAmount: 12000,
    estimatedDeliveryTime: "20-35 min",
    opening: "08:00",
    closing: "21:30",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    items: [
      ["Avocado Power Bowl", "Quinoa, avocado, beans, tomato, cucumber and greens.", 24000, "Bowls", true, ["healthy", "vegetarian"]],
      ["Grilled Chicken Bowl", "Brown rice, grilled chicken, greens, avocado and salsa.", 28000, "Bowls", false, ["healthy"]],
      ["Falafel Bowl", "Crispy falafel, hummus, salad and warm flatbread.", 22000, "Bowls", true, ["vegetarian"]],
      ["Greek Salad", "Cucumber, tomato, olives, feta and mixed greens.", 18000, "Salads", true, ["vegetarian"]],
      ["Tropical Fruit Bowl", "Pineapple, watermelon, mango, banana and passion fruit.", 15000, "Breakfast", true, ["fresh"]],
      ["Granola Yogurt Cup", "Yogurt layered with granola, berries and honey.", 12000, "Breakfast", true, ["breakfast"]],
      ["Peanut Butter Smoothie", "Banana, peanut butter, milk and a touch of honey.", 13000, "Smoothies", true, ["drink"]],
      ["Mango Smoothie", "Fresh mango blended with yogurt and ice.", 12000, "Smoothies", true, ["drink"]],
      ["Ginger Shot", "Fresh ginger, lemon and turmeric wellness shot.", 6000, "Drinks", true, ["healthy"]],
      ["Veggie Wrap", "Whole-wheat wrap with hummus, vegetables and avocado.", 16000, "Wraps", true, ["vegetarian"]],
    ],
  },
  {
    name: "Lake Victoria Fish Corner",
    owner: "lakevictoria@demo.com",
    description: "Fresh fish, seafood and lakeside-inspired Ugandan dishes.",
    cuisine: ["Ugandan", "Grill", "Local"],
    street: "31 Ggaba Road, Muyenga",
    phone: "+256700100007",
    email: "lakevictoria@demo.com",
    priceRange: "$$$",
    deliveryFee: 4,
    minOrderAmount: 18000,
    estimatedDeliveryTime: "35-50 min",
    opening: "11:00",
    closing: "22:30",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
    items: [
      ["Whole Tilapia Grill", "Charcoal-grilled whole tilapia with lemon and herbs.", 42000, "Fish", false, ["popular", "grill"]],
      ["Fried Tilapia", "Crispy fried tilapia served with chips and salad.", 38000, "Fish", false, ["popular"]],
      ["Fish Fingers", "Crispy fish strips served with tartar-style dipping sauce.", 24000, "Starters", false, ["quick"]],
      ["Fish Curry", "Tender fish in a coconut and tomato curry.", 30000, "Curries", false, ["spicy"]],
      ["Prawns Garlic Butter", "Sauteed prawns with garlic, herbs and butter.", 42000, "Seafood", false, ["premium"]],
      ["Matooke", "Steamed green bananas, a classic Ugandan side.", 8000, "Sides", true, ["local"]],
      ["Posho", "Soft maize meal served as a traditional side.", 6000, "Sides", true, ["local"]],
      ["Kachumbari", "Tomato, onion, coriander and lemon salad.", 7000, "Sides", true, ["fresh"]],
      ["Pineapple Juice", "Freshly blended pineapple juice.", 7000, "Drinks", true, ["fresh"]],
      ["African Tea", "Milk tea with warming spices.", 5000, "Drinks", true, ["hot"]],
    ],
  },
  {
    name: "Nile Bites Kitchen",
    owner: "nilebites@demo.com",
    description: "Comfort food inspired by East African flavors with modern presentation.",
    cuisine: ["Ugandan", "Fast Food"],
    street: "15 Ntinda Road, Ntinda",
    phone: "+256700100008",
    email: "nilebites@demo.com",
    priceRange: "$$",
    deliveryFee: 3,
    minOrderAmount: 10000,
    estimatedDeliveryTime: "25-40 min",
    opening: "08:00",
    closing: "22:00",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1547592180-85f173990554",
    items: [
      ["Chicken Pilau", "Fragrant East African rice cooked with spiced chicken.", 22000, "Rice", false, ["local", "popular"]],
      ["Beef Pilau", "Spiced rice with tender beef and caramelized onions.", 24000, "Rice", false, ["local"]],
      ["Beef Samosa", "Crispy pastry filled with seasoned minced beef.", 9000, "Snacks", false, ["snack"]],
      ["Vegetable Samosa", "Crispy pastry filled with potato, peas and spices.", 8000, "Snacks", true, ["vegetarian"]],
      ["Chicken Lollipop", "Crispy chicken pieces served with a spicy dipping sauce.", 22000, "Starters", false, ["popular"]],
      ["Beef Stir Fry", "Tender beef strips with peppers, onions and vegetables.", 25000, "Mains", false, ["quick"]],
      ["Chapati & Beans", "Fresh chapati served with rich tomato bean stew.", 12000, "Mains", true, ["vegetarian", "local"]],
      ["Avocado Salad", "Avocado, tomato, cucumber and fresh herbs.", 10000, "Salads", true, ["healthy"]],
      ["Passion Juice", "Fresh passion fruit drink.", 5000, "Drinks", true, ["fresh"]],
      ["Soda", "Chilled soft drink.", 4000, "Drinks", true, ["drink"]],
    ],
  },
  {
    name: "Acacia Coffee & Cafe",
    owner: "acacia@demo.com",
    description: "Breakfast, coffee, sandwiches, pastries and relaxed all-day cafe meals.",
    cuisine: ["Fast Food", "Vegetarian"],
    street: "3 Acacia Mall Drive, Kisementi",
    phone: "+256700100009",
    email: "acacia@demo.com",
    priceRange: "$$",
    deliveryFee: 2.5,
    minOrderAmount: 10000,
    estimatedDeliveryTime: "20-30 min",
    opening: "07:00",
    closing: "21:00",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
    items: [
      ["Full Breakfast", "Eggs, sausage, toast, beans, tomato and seasonal fruit.", 22000, "Breakfast", false, ["popular"]],
      ["Avocado Toast", "Sourdough toast topped with smashed avocado and herbs.", 18000, "Breakfast", true, ["vegetarian"]],
      ["Pancake Stack", "Fluffy pancakes with banana, berries and honey.", 18000, "Breakfast", true, ["sweet"]],
      ["Chicken Sandwich", "Grilled chicken, lettuce, tomato and mayo on toasted bread.", 20000, "Sandwiches", false, ["quick"]],
      ["Veggie Sandwich", "Grilled vegetables, avocado and hummus on toasted bread.", 18000, "Sandwiches", true, ["vegetarian"]],
      ["Beef Pie", "Flaky pastry filled with seasoned minced beef.", 10000, "Pastries", false, ["snack"]],
      ["Blueberry Muffin", "Soft muffin packed with blueberries.", 9000, "Pastries", true, ["sweet"]],
      ["Cappuccino", "Espresso with steamed milk and a soft foam layer.", 9000, "Coffee", true, ["coffee"]],
      ["Latte", "Smooth espresso with steamed milk.", 9000, "Coffee", true, ["coffee"]],
      ["Iced Coffee", "Chilled coffee with milk and ice.", 10000, "Coffee", true, ["cold"]],
    ],
  },
  {
    name: "Royal Ethiopian Kitchen",
    owner: "ethiopian@demo.com",
    description: "Rich Ethiopian stews, injera platters and coffee traditions.",
    cuisine: ["Vegetarian", "Grill"],
    street: "14 Kira Road, Kamwokya",
    phone: "+256700100010",
    email: "ethiopian@demo.com",
    priceRange: "$$$",
    deliveryFee: 4,
    minOrderAmount: 18000,
    estimatedDeliveryTime: "35-50 min",
    opening: "11:00",
    closing: "22:00",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1547592180-85f173990554",
    items: [
      ["Doro Wat", "Spiced chicken stew with egg, served with injera.", 30000, "Stews", false, ["popular", "spicy"]],
      ["Beef Tibs", "Sauteed beef with onions, peppers and Ethiopian spices.", 32000, "Grill", false, ["popular"]],
      ["Vegetable Firfir", "Injera tossed with spiced vegetables and berbere sauce.", 22000, "Vegetarian", true, ["vegetarian"]],
      ["Shiro Wat", "Creamy chickpea stew seasoned with Ethiopian spices.", 22000, "Vegetarian", true, ["vegetarian"]],
      ["Lentil Wat", "Slow-cooked red lentils with berbere and aromatics.", 20000, "Vegetarian", true, ["vegetarian", "spicy"]],
      ["Chicken Kitfo", "Minced seasoned chicken served Ethiopian-style.", 30000, "Mains", false, ["special"]],
      ["Injera", "Traditional fermented flatbread served with stews.", 7000, "Sides", true, ["local"]],
      ["Ethiopian Salad", "Tomato, onion, cucumber and herbs with lemon.", 8000, "Sides", true, ["fresh"]],
      ["Ethiopian Coffee", "Freshly roasted coffee prepared in traditional style.", 9000, "Drinks", true, ["coffee"]],
      ["Spiced Tea", "Black tea infused with cardamom, cinnamon and cloves.", 6000, "Drinks", true, ["hot"]],
    ],
  },
  {
    name: "Matooke Kitchen",
    owner: "matooke@demo.com",
    description: "Traditional Ugandan meals featuring matooke, groundnut sauce and local vegetables.",
    cuisine: ["Ugandan", "Local", "Vegetarian"],
    street: "28 Makerere Hill Road, Makerere",
    phone: "+256700100011",
    email: "matooke@demo.com",
    priceRange: "$$",
    deliveryFee: 2.5,
    minOrderAmount: 8000,
    estimatedDeliveryTime: "25-40 min",
    opening: "09:00",
    closing: "21:30",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    items: [
      ["Matooke with Beef", "Steamed matooke served with tender beef stew.", 20000, "Local", false, ["local", "popular"]],
      ["Matooke with Groundnut Sauce", "Steamed matooke with rich peanut sauce.", 16000, "Local", true, ["vegetarian", "local"]],
      ["Chicken in Groundnut Sauce", "Chicken simmered in a rich Ugandan peanut sauce.", 22000, "Local", false, ["local"]],
      ["Beans & Matooke", "Slow-cooked beans served with steamed matooke.", 14000, "Vegetarian", true, ["vegetarian", "local"]],
      ["G-nut Sauce", "Traditional creamy groundnut sauce.", 7000, "Sides", true, ["local"]],
      ["Nakati Greens", "Seasonal local greens cooked with onions and tomatoes.", 7000, "Sides", true, ["vegetarian"]],
      ["Cassava Chips", "Crispy cassava chips seasoned with salt and herbs.", 8000, "Snacks", true, ["snack"]],
      ["Roasted Plantain", "Sweet plantain roasted until caramelized.", 8000, "Snacks", true, ["vegetarian"]],
      ["Hibiscus Juice", "Chilled hibiscus drink with ginger and lemon.", 6000, "Drinks", true, ["fresh"]],
      ["Millet Porridge", "Warm traditional millet porridge.", 7000, "Breakfast", true, ["breakfast"]],
    ],
  },
  {
    name: "City Breakfast Club",
    owner: "breakfast@demo.com",
    description: "All-day breakfast, quick lunches, fresh juices and family-friendly meals.",
    cuisine: ["Fast Food", "Vegetarian"],
    street: "6 Buganda Road, Central Kampala",
    phone: "+256700100012",
    email: "breakfast@demo.com",
    priceRange: "$$",
    deliveryFee: 2,
    minOrderAmount: 8000,
    estimatedDeliveryTime: "15-30 min",
    opening: "06:30",
    closing: "20:30",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666",
    items: [
      ["Classic Omelette", "Three-egg omelette with tomato, onion, peppers and cheese.", 14000, "Breakfast", true, ["breakfast"]],
      ["Spanish Omelette", "Egg, potato, onion and herbs cooked until golden.", 15000, "Breakfast", true, ["vegetarian"]],
      ["Egg & Sausage Plate", "Eggs, sausages, toast and tomato relish.", 18000, "Breakfast", false, ["popular"]],
      ["French Toast", "Golden French toast with banana and honey.", 15000, "Breakfast", true, ["sweet"]],
      ["Chicken Wrap", "Grilled chicken, lettuce, tomato and creamy dressing.", 17000, "Wraps", false, ["quick"]],
      ["Falafel Wrap", "Falafel, hummus, greens and tomato in a soft wrap.", 15000, "Wraps", true, ["vegetarian"]],
      ["Chicken Salad", "Grilled chicken with crisp greens and vinaigrette.", 19000, "Salads", false, ["healthy"]],
      ["Fruit Salad", "Seasonal tropical fruit with lime and mint.", 10000, "Salads", true, ["fresh"]],
      ["Fresh Orange Juice", "Freshly squeezed orange juice.", 7000, "Drinks", true, ["fresh"]],
      ["Ginger Tea", "Fresh ginger tea with lemon and honey.", 6000, "Drinks", true, ["hot"]],
    ],
  },
];

const reviewComments = [
  "The food was delicious and arrived hot.",
  "Great portions and very good value for money.",
  "Fast delivery and friendly service.",
  "Everything tasted fresh. I will order again.",
  "One of my favorite places to order from.",
  "The packaging was neat and the meal was excellent.",
  "Really enjoyed the flavors and portion size.",
  "Delivery was quick and the food was still warm.",
];

const imageFallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

const importData = async () => {
  try {
    console.log("Clearing existing demo data...");
    await Order.deleteMany();
    await Review.deleteMany();
    await MenuItem.deleteMany();
    await Restaurant.deleteMany();
    await User.deleteMany();

    const admin = await User.create({
      name: "System Administrator",
      email: "admin@example.com",
      password,
      role: "admin",
      phone: "+256700000000",
      addresses: [{ label: "Office", street: "Parliament Avenue", city: "Kampala", country: "Uganda", isDefault: true }],
    });

    const owners = await User.create(
      ownerSeeds.map(([name, email, phone]) => ({
        name,
        email,
        password,
        role: "restaurantOwner",
        phone,
        addresses: [{ label: "Business", street: "Kampala, Uganda", city: "Kampala", country: "Uganda", isDefault: true }],
      }))
    );

    const customers = await User.create(
      customerSeeds.map(([name, email, phone], index) => ({
        name,
        email,
        password,
        role: "customer",
        phone,
        addresses: [{
          label: "Home",
          street: `${10 + index} Kampala Avenue`,
          city: "Kampala",
          country: "Uganda",
          isDefault: true,
        }],
      }))
    );

    const ownerByEmail = new Map(owners.map((user) => [user.email, user]));

    const restaurantDocs = restaurantSeeds.map((r, index) => ({
      owner: ownerByEmail.get(r.owner)._id,
      name: r.name,
      description: r.description,
      cuisine: r.cuisine,
      coverImage: r.coverImage,
      logo: r.coverImage,
      address: {
        street: r.street,
        city: "Kampala",
        coordinates: { lat: 0.3136 + index * 0.002, lng: 32.5811 + index * 0.002 },
      },
      contact: { phone: r.phone, email: r.email },
      priceRange: r.priceRange,
      deliveryFee: r.deliveryFee,
      minOrderAmount: r.minOrderAmount,
      estimatedDeliveryTime: r.estimatedDeliveryTime,
      openingHours: { open: r.opening, close: r.closing },
      isOpen: true,
      isFeatured: r.featured,
      isApproved: true,
    }));

    const restaurants = await Restaurant.insertMany(restaurantDocs);
    const restaurantByName = new Map(restaurants.map((r) => [r.name, r]));

    const menuDocs = [];
    for (const r of restaurantSeeds) {
      const restaurant = restaurantByName.get(r.name);
      const existingNames = new Set(r.items.map((item) => item[0]));
      const extraItems = [];
      const preferredCuisine = r.cuisine.find((cuisine) => extraMenuByCuisine[cuisine]);
      const pools = r.cuisine.filter((cuisine) => extraMenuByCuisine[cuisine]).map((cuisine) => extraMenuByCuisine[cuisine]);
      let poolIndex = 0;

      // Add 12 additional items per restaurant from its cuisine categories.
      // This makes search, category filters, restaurant pages and carts feel fully populated.
      while (extraItems.length < 12 && pools.length) {
        const pool = pools[poolIndex % pools.length];
        const candidate = pool.find((item) => !existingNames.has(item[0]));
        if (!candidate) {
          poolIndex += 1;
          if (poolIndex >= pools.length * 3) break;
          continue;
        }
        extraItems.push(candidate);
        existingNames.add(candidate[0]);
        poolIndex += 1;
      }

      const allItems = [...r.items, ...extraItems];
      for (const [name, description, price, category, isVegetarian, tags] of allItems) {
        menuDocs.push({
          restaurant: restaurant._id,
          name,
          description,
          price,
          category,
          image: imageFallback,
          isVegetarian,
          isAvailable: true,
          tags,
          rating: 4.2 + Math.random() * 0.7,
          numReviews: 3 + Math.floor(Math.random() * 18),
        });
      }
    }

    const menuItems = await MenuItem.insertMany(menuDocs);
    const menuByRestaurant = new Map();
    for (const item of menuItems) {
      const key = item.restaurant.toString();
      if (!menuByRestaurant.has(key)) menuByRestaurant.set(key, []);
      menuByRestaurant.get(key).push(item);
    }

    // Create a healthy amount of realistic demo orders so dashboards and order pages have data.
    const orderDocs = [];
    for (let i = 0; i < 36; i += 1) {
      const restaurant = restaurants[i % restaurants.length];
      const availableItems = menuByRestaurant.get(restaurant._id.toString());
      const customer = customers[i % customers.length];
      const first = availableItems[i % availableItems.length];
      const second = availableItems[(i + 2) % availableItems.length];
      const qty1 = (i % 3) + 1;
      const qty2 = (i % 2) + 1;
      const items = [
        { menuItem: first._id, name: first.name, price: first.price, quantity: qty1, image: first.image },
      ];
      if (second._id.toString() !== first._id.toString()) {
        items.push({ menuItem: second._id, name: second.name, price: second.price, quantity: qty2, image: second.image });
      }
      const itemsPrice = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
      const deliveryFee = restaurant.deliveryFee;
      const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
      const totalPrice = Number((itemsPrice + deliveryFee + taxPrice).toFixed(2));
      const statuses = ["delivered", "delivered", "confirmed", "preparing", "outForDelivery", "pending"];
      const status = statuses[i % statuses.length];
      const createdAt = new Date(Date.now() - (i + 1) * 1000 * 60 * 60 * 18);
      orderDocs.push({
        user: customer._id,
        restaurant: restaurant._id,
        items,
        deliveryAddress: {
          street: customer.addresses[0].street,
          city: "Kampala",
          postalCode: "256",
          instructions: i % 4 === 0 ? "Please call on arrival." : "",
        },
        paymentMethod: ["cash", "mobileMoney", "card"][i % 3],
        isPaid: status !== "pending" && status !== "cancelled",
        paidAt: status !== "pending" && status !== "cancelled" ? new Date(createdAt.getTime() + 20 * 60 * 1000) : undefined,
        itemsPrice,
        deliveryFee,
        taxPrice,
        totalPrice,
        status,
        statusHistory: [
          { status: "pending", changedAt: createdAt },
          ...(status !== "pending" ? [{ status, changedAt: new Date(createdAt.getTime() + 30 * 60 * 1000) }] : []),
        ],
        deliveredAt: status === "delivered" ? new Date(createdAt.getTime() + 90 * 60 * 1000) : undefined,
        createdAt,
        updatedAt: new Date(),
      });
    }

    const orders = await Order.insertMany(orderDocs);

    // Reviews are attached to delivered orders, giving restaurant pages realistic ratings.
    const deliveredOrders = orders.filter((order) => order.status === "delivered");
    const reviewDocs = deliveredOrders.map((order, index) => ({
      user: order.user,
      restaurant: order.restaurant,
      order: order._id,
      rating: [5, 4, 5, 4, 5, 3][index % 6],
      comment: reviewComments[index % reviewComments.length],
      createdAt: new Date(order.createdAt.getTime() + 2 * 60 * 60 * 1000),
      updatedAt: new Date(order.createdAt.getTime() + 2 * 60 * 60 * 1000),
    }));

    if (reviewDocs.length) await Review.insertMany(reviewDocs);

    // Recalculate restaurant ratings after bulk review insertion.
    for (const restaurant of restaurants) {
      const stats = await Review.aggregate([
        { $match: { restaurant: restaurant._id } },
        { $group: { _id: "$restaurant", avgRating: { $avg: "$rating" }, numReviews: { $sum: 1 } } },
      ]);
      await Restaurant.findByIdAndUpdate(restaurant._id, {
        rating: Number((stats[0]?.avgRating || 4.5).toFixed(1)),
        numReviews: stats[0]?.numReviews || 0,
      });
    }

    console.log("\n========================================");
    console.log("Comprehensive seed completed successfully");
    console.log("========================================");
    console.log(`Restaurants : ${restaurants.length}`);
    console.log(`Menu items  : ${menuItems.length}`);
    console.log("Target: 20+ items per restaurant where cuisine pools allow it");
    console.log(`Customers   : ${customers.length}`);
    console.log(`Owners      : ${owners.length}`);
    console.log(`Orders      : ${orders.length}`);
    console.log(`Reviews     : ${reviewDocs.length}`);
    console.log("\nDemo login accounts (all passwords: password123)");
    console.log("Admin:           admin@example.com");
    console.log("Restaurant owner: grill@demo.com");
    console.log("Customer:         jane@example.com");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error.stack || error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Review.deleteMany();
    await MenuItem.deleteMany();
    await Restaurant.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed successfully");
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
