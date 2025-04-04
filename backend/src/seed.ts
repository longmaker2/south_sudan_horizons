import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Tour from "./models/Tour";

// Manually specify .env location
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Check if MONGO_URI is defined
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const tours = [
  {
    rating: 4.5,
    title: "Boma National Park Safari",
    type: "Wildlife",
    description:
      "Explore one of Africa's largest national parks, home to elephants, giraffes, antelopes, and the famous white-eared kob migration.",
    image: "boma.webp",
    video: "/assets/tour_videos/boma.mp4",
    price: 600,
    duration: "4 days",
    reviews: [],
  },
  {
    rating: 4.8,
    title: "White Nile Rafting Adventure",
    type: "Adventure",
    description:
      "Experience the thrill of rafting on the White Nile, one of the world's most exciting rivers, with rapids suitable for all skill levels.",
    image: "white_nile.webp",
    video: "/assets/tour_videos/white-nile.mp4",
    price: 350,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.2,
    title: "Juba Cultural Experience",
    type: "Cultural",
    description:
      "Immerse yourself in the vibrant culture of Juba, South Sudan's capital, with visits to local markets, museums, and traditional dance performances.",
    image: "juba_markets.webp",
    video: "/assets/tour_videos/juba.mp4",
    price: 200,
    duration: "1 day",
    reviews: [],
  },
  {
    rating: 4.6,
    title: "Sudd Wetlands Exploration",
    type: "Wildlife",
    description:
      "Discover the Sudd, one of the largest wetlands in the world, teeming with birdlife, hippos, and unique aquatic ecosystems.",
    image: "sudd_wetlands.webp",
    video: "/assets/tour_videos/sudd.mp4",
    price: 450,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.4,
    title: "Mount Kinyeti Trekking",
    type: "Adventure",
    description:
      "Hike to the summit of Mount Kinyeti, South Sudan's highest peak, and enjoy breathtaking views of the surrounding landscapes.",
    image: "mountain_adventure.webp",
    video: "/assets/tour_videos/kinyeti.mp4",
    price: 500,
    duration: "5 days",
    reviews: [],
  },
  {
    rating: 4.7,
    title: "Bor Wildlife Reserve Tour",
    type: "Wildlife",
    description:
      "Visit the Bor Wildlife Reserve, a haven for wildlife enthusiasts, with opportunities to spot lions, leopards, and rare bird species.",
    image: "Bor_National.webp",
    video: "/assets/tour_videos/bor.mp4",
    price: 400,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.3,
    title: "Nimule National Park Safari",
    type: "Wildlife",
    description:
      "Explore Nimule National Park, known for its lush forests, waterfalls, and diverse wildlife, including elephants and buffaloes.",
    image: "nimule.webp",
    video: "/assets/tour_videos/nimule.mp4",
    price: 550,
    duration: "4 days",
    reviews: [],
  },
  {
    rating: 4.9,
    title: "Traditional Dinka Village Visit",
    type: "Cultural",
    description:
      "Experience the traditional lifestyle of the Dinka people, with guided tours of their villages, cattle camps, and cultural ceremonies.",
    image: "cultural_village.webp",
    video: "/assets/tour_videos/dinka.mp4",
    price: 300,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.1,
    title: "Bandingilo National Park Tour",
    type: "Wildlife",
    description:
      "Witness the spectacular migration of antelopes in Bandingilo National Park, one of Africa's most remarkable wildlife events.",
    image: "badingilo.webp",
    video: "/assets/tour_videos/bandingilo.mp4",
    price: 600,
    duration: "5 days",
    reviews: [],
  },
  {
    rating: 4.7,
    title: "Kapoeta Cultural Tour",
    type: "Cultural",
    description:
      "Discover the rich cultural heritage of the Toposa people in Kapoeta, with visits to local markets and traditional dance performances.",
    image: "cultural_tour.webp",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 250,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.5,
    title: "Fula Rapids Adventure",
    type: "Adventure",
    description:
      "Challenge yourself with kayaking or rafting on the Fula Rapids, one of the most thrilling sections of the White Nile.",
    image: "fula.jpg",
    video: "/assets/tour_videos/fula.mp4",
    price: 400,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.8,
    title: "Wau Cultural Experience",
    type: "Cultural",
    description:
      "Explore the historic town of Wau, known for its colonial architecture, vibrant markets, and cultural festivals.",
    image: "cultural_heritage.webp",
    video: "/assets/tour_videos/wau.mp4",
    price: 300,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.6,
    title: "Shambe National Park Birdwatching",
    type: "Wildlife",
    description:
      "Visit Shambe National Park, a paradise for birdwatchers, with over 400 species of birds, including the rare shoebill stork.",
    image: "shambe_nature.jpg",
    video: "/assets/tour_videos/shambe.mp4",
    price: 500,
    duration: "4 days",
    reviews: [],
  },
  {
    rating: 4.4,
    title: "Lantoto National Park Safari",
    type: "Wildlife",
    description:
      "Explore Lantoto National Park, a lesser-known gem with diverse wildlife, including elephants, buffaloes, and antelopes.",
    image: "wildlife_safari.webp",
    video: "/assets/tour_videos/lantoto.mp4",
    price: 450,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.9,
    title: "Jebel Kujur Hiking Adventure",
    type: "Adventure",
    description:
      "Hike to the top of Jebel Kujur, a sacred mountain near Juba, and enjoy panoramic views of the surrounding plains.",
    image: "jebel-kunyjur.jpg",
    video: "/assets/tour_videos/kujur.mp4",
    price: 300,
    duration: "1 day",
    reviews: [],
  },
  {
    rating: 4.2,
    title: "Yirol Lakeside Retreat",
    type: "Cultural",
    description:
      "Relax by the serene lakes of Yirol and experience the local culture of the Dinka and Jur people.",
    image: "nature_tour2.webp",
    video: "/assets/tour_videos/yirol.mp4",
    price: 350,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.7,
    title: "Kidepo Game Reserve Safari",
    type: "Wildlife",
    description:
      "Explore the Kidepo Game Reserve, a remote and untouched wilderness with abundant wildlife and stunning landscapes.",
    image: "Wildlife_Bandingilo.webp",
    video: "/assets/tour_videos/kidepo.mp4",
    price: 700,
    duration: "5 days",
    reviews: [],
  },
  {
    rating: 4.5,
    title: "Torit Cultural Immersion",
    type: "Cultural",
    description:
      "Visit Torit, the capital of Eastern Equatoria, and learn about the traditions of the Lotuko and Lopit people.",
    image: "torit_culture.jpg",
    video: "/assets/tour_videos/torit.mp4",
    price: 250,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.8,
    title: "Imatong Mountains Trek",
    type: "Adventure",
    description:
      "Trek through the Imatong Mountains, a lush and scenic range with diverse flora and fauna.",
    image: "imatong_mountain.avif",
    video: "/assets/tour_videos/imatong.mp4",
    price: 550,
    duration: "4 days",
    reviews: [],
  },
  {
    rating: 4.3,
    title: "Malakal Riverside Experience",
    type: "Cultural",
    description:
      "Explore Malakal, a historic town on the banks of the White Nile, and learn about its rich cultural heritage.",
    image: "nile_river.webp",
    video: "/assets/tour_videos/malakal.mp4",
    price: 300,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.6,
    title: "Badingilo National Park Safari",
    type: "Wildlife",
    description:
      "Explore Badingilo National Park, known for its vast savannahs and the annual migration of white-eared kob and tiang antelopes.",
    image: "badingilo.webp",
    video: "/assets/tour_videos/badingilo.mp4",
    price: 650,
    duration: "5 days",
    reviews: [],
  },
  {
    rating: 4.9,
    title: "Kapoeta Rock Formations Tour",
    type: "Adventure",
    description:
      "Discover the stunning rock formations and caves near Kapoeta, a hidden gem for adventure seekers and photographers.",
    image: "rocks_formation.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 400,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.4,
    title: "Terekeka Cultural Experience",
    type: "Cultural",
    description:
      "Visit Terekeka and learn about the traditions of the Mundari people, known for their cattle camps and unique way of life.",
    image: "hero-section1.jpg",
    video: "/assets/tour_videos/terekeka.mp4",
    price: 300,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.7,
    title: "Nimule Waterfalls Adventure",
    type: "Adventure",
    description:
      "Hike to the breathtaking Nimule Waterfalls, one of South Sudan's most scenic natural attractions.",
    image: "waterfall.jpg",
    video: "/assets/tour_videos/nimule.mp4",
    price: 350,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.5,
    title: "Juba City Tour",
    type: "Cultural",
    description:
      "Explore the bustling city of Juba, including its markets, historical sites, and vibrant nightlife.",
    image: "juba_ssd.jpg",
    video: "/assets/tour_videos/juba.mp4",
    price: 150,
    duration: "1 day",
    reviews: [],
  },
  {
    rating: 4.8,
    title: "Bahr el Ghazal River Cruise",
    type: "Adventure",
    description:
      "Enjoy a relaxing cruise along the Bahr el Ghazal River, surrounded by lush landscapes and abundant wildlife.",
    image: "river_nile.webp",
    video: "/assets/tour_videos/bahr-el-ghazal.mp4",
    price: 500,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.2,
    title: "Yambio Cultural Tour",
    type: "Cultural",
    description:
      "Experience the rich culture of the Azande people in Yambio, including traditional dances, crafts, and storytelling.",
    image: "yambio_culture.jpg",
    video: "/assets/tour_videos/yambio.mp4",
    price: 250,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.6,
    title: "Lobonok Eco-Tour",
    type: "Adventure",
    description:
      "Explore the lush forests and rivers of Lobonok, a perfect destination for eco-tourism and nature lovers.",
    image: "nature_tour1.webp",
    video: "/assets/tour_videos/lobonok.mp4",
    price: 400,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.9,
    title: "Rumbek Cattle Camp Experience",
    type: "Cultural",
    description:
      "Visit the famous cattle camps of Rumbek and learn about the pastoral lifestyle of the Dinka people.",
    image: "South_Sudan_Cows.jpg",
    video: "/assets/tour_videos/rumbek.mp4",
    price: 300,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.4,
    title: "Kapoeta Desert Safari",
    type: "Adventure",
    description:
      "Embark on a thrilling desert safari in Kapoeta, exploring its unique landscapes and nomadic cultures.",
    image: "desert_safari.webp",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 450,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.7,
    title: "Boma-Jonglei Landscape Tour",
    type: "Wildlife",
    description:
      "Explore the Boma-Jonglei landscape, a vast area known for its diverse ecosystems and wildlife, including elephants, giraffes, and antelopes.",
    image: "boma_jonglei.webp",
    video: "/assets/tour_videos/boma-jonglei.mp4",
    price: 700,
    duration: "6 days",
    reviews: [],
  },
  {
    rating: 4.5,
    title: "Kapoeta Hot Springs Adventure",
    type: "Adventure",
    description:
      "Visit the natural hot springs near Kapoeta, a unique geological feature perfect for relaxation and exploration.",
    image: "kapoeta_hot-springs.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 300,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.8,
    title: "Wau Cathedral and Historical Sites",
    type: "Cultural",
    description:
      "Explore the historic Wau Cathedral and other colonial-era buildings in Wau, a town rich in history and architecture.",
    image: "wau_church.jpg",
    video: "/assets/tour_videos/wau.mp4",
    price: 200,
    duration: "1 day",
    reviews: [],
  },
  {
    rating: 4.2,
    title: "Imatong Forest Exploration",
    type: "Adventure",
    description:
      "Discover the lush Imatong Forest, home to diverse flora and fauna, including rare bird species and primates.",
    image: "imatong_forest.webp",
    video: "/assets/tour_videos/imatong.mp4",
    price: 450,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.6,
    title: "Pibor River Fishing Expedition",
    type: "Adventure",
    description:
      "Enjoy a fishing expedition along the Pibor River, known for its abundant fish and serene surroundings.",
    image: "sudd.webp",
    video: "/assets/tour_videos/pibor.mp4",
    price: 400,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.9,
    title: "Torit Mountain Climbing",
    type: "Adventure",
    description:
      "Climb the scenic mountains near Torit and enjoy panoramic views of the surrounding landscapes.",
    image: "mountain_adventure.webp",
    video: "/assets/tour_videos/torit.mp4",
    price: 500,
    duration: "4 days",
    reviews: [],
  },
  {
    rating: 4.4,
    title: "Yirol Cultural Festival Tour",
    type: "Cultural",
    description:
      "Experience the vibrant Yirol Cultural Festival, showcasing traditional dances, music, and crafts of the Dinka people.",
    image: "yirol_culture.jpg",
    video: "/assets/tour_videos/yirol.mp4",
    price: 350,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.7,
    title: "Lobonok River Rafting",
    type: "Adventure",
    description:
      "Raft down the Lobonok River, a thrilling adventure through scenic landscapes and rapids.",
    image: "River_Rafting.webp",
    video: "/assets/tour_videos/lobonok.mp4",
    price: 450,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.5,
    title: "Kapoeta Camel Safari",
    type: "Adventure",
    description:
      "Embark on a unique camel safari in the deserts of Kapoeta, exploring its rugged beauty and nomadic cultures.",
    image: "camel_safari.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 500,
    duration: "4 days",
    reviews: [],
  },
  {
    rating: 4.8,
    title: "Juba Night Market Experience",
    type: "Cultural",
    description:
      "Explore Juba's vibrant night markets, offering a variety of local crafts, food, and entertainment.",
    image: "cultural_delights_Juba.webp",
    video: "/assets/tour_videos/juba.mp4",
    price: 150,
    duration: "1 day",
    reviews: [],
  },
  {
    rating: 4.2,
    title: "Boma Plateau Trek",
    type: "Adventure",
    description:
      "Trek across the scenic Boma Plateau, offering stunning views, diverse wildlife, and unique cultural encounters.",
    image: "Boma_Plateau.jpg",
    video: "/assets/tour_videos/boma.mp4",
    price: 600,
    duration: "5 days",
    reviews: [],
  },
  {
    rating: 4.6,
    title: "Kapoeta Rock Art Exploration",
    type: "Cultural",
    description:
      "Discover ancient rock art sites near Kapoeta, showcasing the rich history and creativity of South Sudan's early inhabitants.",
    image: "kapoeta_arts.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 350,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.9,
    title: "Juba Botanical Gardens Tour",
    type: "Nature",
    description:
      "Visit the Juba Botanical Gardens, a peaceful retreat with diverse plant species and walking trails.",
    image: "garden_tour.jpeg",
    video: "/assets/tour_videos/juba.mp4",
    price: 100,
    duration: "1 day",
    reviews: [],
  },
  {
    rating: 4.4,
    title: "Sobat River Canoeing",
    type: "Adventure",
    description:
      "Canoe along the Sobat River, enjoying the serene waters and spotting wildlife along the riverbanks.",
    image: "sobat_river.webp",
    video: "/assets/tour_videos/sobat.mp4",
    price: 400,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.7,
    title: "Torit Cultural Heritage Tour",
    type: "Cultural",
    description:
      "Explore Torit's cultural heritage, including traditional villages, crafts, and historical landmarks.",
    image: "Lou_culture.jpeg",
    video: "/assets/tour_videos/torit.mp4",
    price: 250,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.5,
    title: "Lobonok Waterfall Hike",
    type: "Adventure",
    description:
      "Hike to the stunning Lobonok Waterfall, a hidden gem surrounded by lush forests and wildlife.",
    image: "Nile_river_adventure.webp",
    video: "/assets/tour_videos/lobonok.mp4",
    price: 300,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.8,
    title: "Kapoeta Star Gazing Experience",
    type: "Nature",
    description:
      "Experience the breathtaking night skies of Kapoeta, perfect for star gazing and astrophotography.",
    image: "star_gazing.webp",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 200,
    duration: "1 night",
    reviews: [],
  },
  {
    rating: 4.2,
    title: "Yirol Lakeside Birdwatching",
    type: "Nature",
    description:
      "Enjoy birdwatching by the serene lakes of Yirol, home to a variety of migratory and resident bird species.",
    image: "Dinka_culture.jpg",
    video: "/assets/tour_videos/yirol.mp4",
    price: 250,
    duration: "2 days",
    reviews: [],
  },
  {
    rating: 4.6,
    title: "Bahr el Jebel River Cruise",
    type: "Adventure",
    description:
      "Cruise along the Bahr el Jebel River, enjoying the scenic landscapes and spotting wildlife along the way.",
    image: "mountain_river.jpg",
    video: "/assets/tour_videos/bahr-el-jebel.mp4",
    price: 500,
    duration: "3 days",
    reviews: [],
  },
  {
    rating: 4.9,
    title: "Juba Street Food Tour",
    type: "Cultural",
    description:
      "Explore Juba's vibrant street food scene, sampling local delicacies and learning about South Sudanese cuisine.",
    image: "street_food_tour.jpg",
    video: "/assets/tour_videos/juba.mp4",
    price: 150,
    duration: "1 day",
    reviews: [],
  },
];

const seedDB = async () => {
  try {
    await Tour.deleteMany({});
    await Tour.insertMany(tours);
    console.log("✅ Database Seeded Successfully");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB Connection Closed");
  }
};

seedDB();
