const tours = [
  {
    id: 1,
    rating: 4.5,
    title: "Boma National Park Safari",
    type: "Wildlife",
    description:
      "Explore one of Africa's largest national parks, home to elephants, giraffes, antelopes, and the famous white-eared kob migration.",
    image: "../tour_pics/boma.webp",
    video: "/assets/tour_videos/boma.mp4",
    price: 600,
    duration: "4 days",
  },
  {
    id: 2,
    rating: 4.8,
    title: "White Nile Rafting Adventure",
    type: "Adventure",
    description:
      "Experience the thrill of rafting on the White Nile, one of the world's most exciting rivers, with rapids suitable for all skill levels.",
    image: "../tour_pics/white_nile.webp",
    video: "/assets/tour_videos/white-nile.mp4",
    price: 350,
    duration: "2 days",
  },
  {
    id: 3,
    rating: 4.2,
    title: "Juba Cultural Experience",
    type: "Cultural",
    description:
      "Immerse yourself in the vibrant culture of Juba, South Sudan's capital, with visits to local markets, museums, and traditional dance performances.",
    image: "/assets/tours/juba-cultural.jpg",
    video: "/assets/tour_videos/juba.mp4",
    price: 200,
    duration: "1 day",
  },
  {
    id: 4,
    rating: 4.6,
    title: "Sudd Wetlands Exploration",
    type: "Wildlife",
    description:
      "Discover the Sudd, one of the largest wetlands in the world, teeming with birdlife, hippos, and unique aquatic ecosystems.",
    image: "/assets/tours/sudd-wetlands.jpg",
    video: "/assets/tour_videos/sudd.mp4",
    price: 450,
    duration: "3 days",
  },
  {
    id: 5,
    rating: 4.4,
    title: "Mount Kinyeti Trekking",
    type: "Adventure",
    description:
      "Hike to the summit of Mount Kinyeti, South Sudan's highest peak, and enjoy breathtaking views of the surrounding landscapes.",
    image: "/assets/tours/mount-kinyeti.jpg",
    video: "/assets/tour_videos/kinyeti.mp4",
    price: 500,
    duration: "5 days",
  },
  {
    id: 6,
    rating: 4.7,
    title: "Bor Wildlife Reserve Tour",
    type: "Wildlife",
    description:
      "Visit the Bor Wildlife Reserve, a haven for wildlife enthusiasts, with opportunities to spot lions, leopards, and rare bird species.",
    image: "/assets/tours/bor-wildlife.jpg",
    video: "/assets/tour_videos/bor.mp4",
    price: 400,
    duration: "3 days",
  },
  {
    id: 7,
    rating: 4.3,
    title: "Nimule National Park Safari",
    type: "Wildlife",
    description:
      "Explore Nimule National Park, known for its lush forests, waterfalls, and diverse wildlife, including elephants and buffaloes.",
    image: "/assets/tours/nimule-safari.jpg",
    video: "/assets/tour_videos/nimule.mp4",
    price: 550,
    duration: "4 days",
  },
  {
    id: 8,
    rating: 4.9,
    title: "Traditional Dinka Village Visit",
    type: "Cultural",
    description:
      "Experience the traditional lifestyle of the Dinka people, with guided tours of their villages, cattle camps, and cultural ceremonies.",
    image: "/assets/tours/dinka-village.jpg",
    video: "/assets/tour_videos/dinka.mp4",
    price: 300,
    duration: "2 days",
  },
  {
    id: 9,
    rating: 4.1,
    title: "Bandingilo National Park Tour",
    type: "Wildlife",
    description:
      "Witness the spectacular migration of antelopes in Bandingilo National Park, one of Africa's most remarkable wildlife events.",
    image: "/assets/tours/bandingilo.jpg",
    video: "/assets/tour_videos/bandingilo.mp4",
    price: 600,
    duration: "5 days",
  },
  {
    id: 10,
    rating: 4.7,
    title: "Kapoeta Cultural Tour",
    type: "Cultural",
    description:
      "Discover the rich cultural heritage of the Toposa people in Kapoeta, with visits to local markets and traditional dance performances.",
    image: "/assets/tours/kapoeta-cultural.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 250,
    duration: "2 days",
  },
  {
    id: 11,
    rating: 4.5,
    title: "Fula Rapids Adventure",
    type: "Adventure",
    description:
      "Challenge yourself with kayaking or rafting on the Fula Rapids, one of the most thrilling sections of the White Nile.",
    image: "/assets/tours/fula-rapids.jpg",
    video: "/assets/tour_videos/fula.mp4",
    price: 400,
    duration: "3 days",
  },
  {
    id: 12,
    rating: 4.8,
    title: "Wau Cultural Experience",
    type: "Cultural",
    description:
      "Explore the historic town of Wau, known for its colonial architecture, vibrant markets, and cultural festivals.",
    image: "/assets/tours/wau-cultural.jpg",
    video: "/assets/tour_videos/wau.mp4",
    price: 300,
    duration: "2 days",
  },
  {
    id: 13,
    rating: 4.6,
    title: "Shambe National Park Birdwatching",
    type: "Wildlife",
    description:
      "Visit Shambe National Park, a paradise for birdwatchers, with over 400 species of birds, including the rare shoebill stork.",
    image: "/assets/tours/shambe-birdwatching.jpg",
    video: "/assets/tour_videos/shambe.mp4",
    price: 500,
    duration: "4 days",
  },
  {
    id: 14,
    rating: 4.4,
    title: "Lantoto National Park Safari",
    type: "Wildlife",
    description:
      "Explore Lantoto National Park, a lesser-known gem with diverse wildlife, including elephants, buffaloes, and antelopes.",
    image: "/assets/tours/lantoto-safari.jpg",
    video: "/assets/tour_videos/lantoto.mp4",
    price: 450,
    duration: "3 days",
  },
  {
    id: 15,
    rating: 4.9,
    title: "Jebel Kujur Hiking Adventure",
    type: "Adventure",
    description:
      "Hike to the top of Jebel Kujur, a sacred mountain near Juba, and enjoy panoramic views of the surrounding plains.",
    image: "/assets/tours/jebel-kujur.jpg",
    video: "/assets/tour_videos/kujur.mp4",
    price: 300,
    duration: "1 day",
  },
  {
    id: 16,
    rating: 4.2,
    title: "Yirol Lakeside Retreat",
    type: "Cultural",
    description:
      "Relax by the serene lakes of Yirol and experience the local culture of the Dinka and Jur people.",
    image: "/assets/tours/yirol-lakeside.jpg",
    video: "/assets/tour_videos/yirol.mp4",
    price: 350,
    duration: "2 days",
  },
  {
    id: 17,
    rating: 4.7,
    title: "Kidepo Game Reserve Safari",
    type: "Wildlife",
    description:
      "Explore the Kidepo Game Reserve, a remote and untouched wilderness with abundant wildlife and stunning landscapes.",
    image: "/assets/tours/kidepo-safari.jpg",
    video: "/assets/tour_videos/kidepo.mp4",
    price: 700,
    duration: "5 days",
  },
  {
    id: 18,
    rating: 4.5,
    title: "Torit Cultural Immersion",
    type: "Cultural",
    description:
      "Visit Torit, the capital of Eastern Equatoria, and learn about the traditions of the Lotuko and Lopit people.",
    image: "/assets/tours/torit-cultural.jpg",
    video: "/assets/tour_videos/torit.mp4",
    price: 250,
    duration: "2 days",
  },
  {
    id: 19,
    rating: 4.8,
    title: "Imatong Mountains Trek",
    type: "Adventure",
    description:
      "Trek through the Imatong Mountains, a lush and scenic range with diverse flora and fauna.",
    image: "/assets/tours/imatong-trek.jpg",
    video: "/assets/tour_videos/imatong.mp4",
    price: 550,
    duration: "4 days",
  },
  {
    id: 20,
    rating: 4.3,
    title: "Malakal Riverside Experience",
    type: "Cultural",
    description:
      "Explore Malakal, a historic town on the banks of the White Nile, and learn about its rich cultural heritage.",
    image: "/assets/tours/malakal-riverside.jpg",
    video: "/assets/tour_videos/malakal.mp4",
    price: 300,
    duration: "2 days",
  },
  {
    id: 21,
    rating: 4.6,
    title: "Badingilo National Park Safari",
    type: "Wildlife",
    description:
      "Explore Badingilo National Park, known for its vast savannahs and the annual migration of white-eared kob and tiang antelopes.",
    image: "/assets/tours/badingilo-safari.jpg",
    video: "/assets/tour_videos/badingilo.mp4",
    price: 650,
    duration: "5 days",
  },
  {
    id: 22,
    rating: 4.9,
    title: "Kapoeta Rock Formations Tour",
    type: "Adventure",
    description:
      "Discover the stunning rock formations and caves near Kapoeta, a hidden gem for adventure seekers and photographers.",
    image: "/assets/tours/kapoeta-rocks.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 400,
    duration: "3 days",
  },
  {
    id: 23,
    rating: 4.4,
    title: "Terekeka Cultural Experience",
    type: "Cultural",
    description:
      "Visit Terekeka and learn about the traditions of the Mundari people, known for their cattle camps and unique way of life.",
    image: "/assets/tours/terekeka-cultural.jpg",
    video: "/assets/tour_videos/terekeka.mp4",
    price: 300,
    duration: "2 days",
  },
  {
    id: 24,
    rating: 4.7,
    title: "Nimule Waterfalls Adventure",
    type: "Adventure",
    description:
      "Hike to the breathtaking Nimule Waterfalls, one of South Sudan's most scenic natural attractions.",
    image: "/assets/tours/nimule-waterfalls.jpg",
    video: "/assets/tour_videos/nimule.mp4",
    price: 350,
    duration: "2 days",
  },
  {
    id: 25,
    rating: 4.5,
    title: "Juba City Tour",
    type: "Cultural",
    description:
      "Explore the bustling city of Juba, including its markets, historical sites, and vibrant nightlife.",
    image: "/assets/tours/juba-city.jpg",
    video: "/assets/tour_videos/juba.mp4",
    price: 150,
    duration: "1 day",
  },
  {
    id: 26,
    rating: 4.8,
    title: "Bahr el Ghazal River Cruise",
    type: "Adventure",
    description:
      "Enjoy a relaxing cruise along the Bahr el Ghazal River, surrounded by lush landscapes and abundant wildlife.",
    image: "/assets/tours/bahr-el-ghazal.jpg",
    video: "/assets/tour_videos/bahr-el-ghazal.mp4",
    price: 500,
    duration: "3 days",
  },
  {
    id: 27,
    rating: 4.2,
    title: "Yambio Cultural Tour",
    type: "Cultural",
    description:
      "Experience the rich culture of the Azande people in Yambio, including traditional dances, crafts, and storytelling.",
    image: "/assets/tours/yambio-cultural.jpg",
    video: "/assets/tour_videos/yambio.mp4",
    price: 250,
    duration: "2 days",
  },
  {
    id: 28,
    rating: 4.6,
    title: "Lobonok Eco-Tour",
    type: "Adventure",
    description:
      "Explore the lush forests and rivers of Lobonok, a perfect destination for eco-tourism and nature lovers.",
    image: "/assets/tours/lobonok-eco.jpg",
    video: "/assets/tour_videos/lobonok.mp4",
    price: 400,
    duration: "3 days",
  },
  {
    id: 29,
    rating: 4.9,
    title: "Rumbek Cattle Camp Experience",
    type: "Cultural",
    description:
      "Visit the famous cattle camps of Rumbek and learn about the pastoral lifestyle of the Dinka people.",
    image: "/assets/tours/rumbek-cattle.jpg",
    video: "/assets/tour_videos/rumbek.mp4",
    price: 300,
    duration: "2 days",
  },
  {
    id: 30,
    rating: 4.4,
    title: "Kapoeta Desert Safari",
    type: "Adventure",
    description:
      "Embark on a thrilling desert safari in Kapoeta, exploring its unique landscapes and nomadic cultures.",
    image: "/assets/tours/kapoeta-desert.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 450,
    duration: "3 days",
  },
  {
    id: 31,
    rating: 4.7,
    title: "Boma-Jonglei Landscape Tour",
    type: "Wildlife",
    description:
      "Explore the Boma-Jonglei landscape, a vast area known for its diverse ecosystems and wildlife, including elephants, giraffes, and antelopes.",
    image: "/assets/tours/boma-jonglei.jpg",
    video: "/assets/tour_videos/boma-jonglei.mp4",
    price: 700,
    duration: "6 days",
  },
  {
    id: 32,
    rating: 4.5,
    title: "Kapoeta Hot Springs Adventure",
    type: "Adventure",
    description:
      "Visit the natural hot springs near Kapoeta, a unique geological feature perfect for relaxation and exploration.",
    image: "/assets/tours/kapoeta-hot-springs.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 300,
    duration: "2 days",
  },
  {
    id: 33,
    rating: 4.8,
    title: "Wau Cathedral and Historical Sites",
    type: "Cultural",
    description:
      "Explore the historic Wau Cathedral and other colonial-era buildings in Wau, a town rich in history and architecture.",
    image: "/assets/tours/wau-cathedral.jpg",
    video: "/assets/tour_videos/wau.mp4",
    price: 200,
    duration: "1 day",
  },
  {
    id: 34,
    rating: 4.2,
    title: "Imatong Forest Exploration",
    type: "Adventure",
    description:
      "Discover the lush Imatong Forest, home to diverse flora and fauna, including rare bird species and primates.",
    image: "/assets/tours/imatong-forest.jpg",
    video: "/assets/tour_videos/imatong.mp4",
    price: 450,
    duration: "3 days",
  },
  {
    id: 35,
    rating: 4.6,
    title: "Pibor River Fishing Expedition",
    type: "Adventure",
    description:
      "Enjoy a fishing expedition along the Pibor River, known for its abundant fish and serene surroundings.",
    image: "/assets/tours/pibor-fishing.jpg",
    video: "/assets/tour_videos/pibor.mp4",
    price: 400,
    duration: "3 days",
  },
  {
    id: 36,
    rating: 4.9,
    title: "Torit Mountain Climbing",
    type: "Adventure",
    description:
      "Climb the scenic mountains near Torit and enjoy panoramic views of the surrounding landscapes.",
    image: "/assets/tours/torit-mountain.jpg",
    video: "/assets/tour_videos/torit.mp4",
    price: 500,
    duration: "4 days",
  },
  {
    id: 37,
    rating: 4.4,
    title: "Yirol Cultural Festival Tour",
    type: "Cultural",
    description:
      "Experience the vibrant Yirol Cultural Festival, showcasing traditional dances, music, and crafts of the Dinka people.",
    image: "/assets/tours/yirol-festival.jpg",
    video: "/assets/tour_videos/yirol.mp4",
    price: 350,
    duration: "2 days",
  },
  {
    id: 38,
    rating: 4.7,
    title: "Lobonok River Rafting",
    type: "Adventure",
    description:
      "Raft down the Lobonok River, a thrilling adventure through scenic landscapes and rapids.",
    image: "/assets/tours/lobonok-rafting.jpg",
    video: "/assets/tour_videos/lobonok.mp4",
    price: 450,
    duration: "3 days",
  },
  {
    id: 39,
    rating: 4.5,
    title: "Kapoeta Camel Safari",
    type: "Adventure",
    description:
      "Embark on a unique camel safari in the deserts of Kapoeta, exploring its rugged beauty and nomadic cultures.",
    image: "/assets/tours/kapoeta-camel.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 500,
    duration: "4 days",
  },
  {
    id: 40,
    rating: 4.8,
    title: "Juba Night Market Experience",
    type: "Cultural",
    description:
      "Explore Juba's vibrant night markets, offering a variety of local crafts, food, and entertainment.",
    image: "/assets/tours/juba-night-market.jpg",
    video: "/assets/tour_videos/juba.mp4",
    price: 150,
    duration: "1 day",
  },
  {
    id: 41,
    rating: 4.2,
    title: "Boma Plateau Trek",
    type: "Adventure",
    description:
      "Trek across the scenic Boma Plateau, offering stunning views, diverse wildlife, and unique cultural encounters.",
    image: "/assets/tours/boma-plateau.jpg",
    video: "/assets/tour_videos/boma.mp4",
    price: 600,
    duration: "5 days",
  },
  {
    id: 42,
    rating: 4.6,
    title: "Kapoeta Rock Art Exploration",
    type: "Cultural",
    description:
      "Discover ancient rock art sites near Kapoeta, showcasing the rich history and creativity of South Sudan's early inhabitants.",
    image: "/assets/tours/kapoeta-rock-art.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 350,
    duration: "2 days",
  },
  {
    id: 43,
    rating: 4.9,
    title: "Juba Botanical Gardens Tour",
    type: "Nature",
    description:
      "Visit the Juba Botanical Gardens, a peaceful retreat with diverse plant species and walking trails.",
    image: "/assets/tours/juba-botanical.jpg",
    video: "/assets/tour_videos/juba.mp4",
    price: 100,
    duration: "1 day",
  },
  {
    id: 44,
    rating: 4.4,
    title: "Sobat River Canoeing",
    type: "Adventure",
    description:
      "Canoe along the Sobat River, enjoying the serene waters and spotting wildlife along the riverbanks.",
    image: "/assets/tours/sobat-canoeing.jpg",
    video: "/assets/tour_videos/sobat.mp4",
    price: 400,
    duration: "3 days",
  },
  {
    id: 45,
    rating: 4.7,
    title: "Torit Cultural Heritage Tour",
    type: "Cultural",
    description:
      "Explore Torit's cultural heritage, including traditional villages, crafts, and historical landmarks.",
    image: "/assets/tours/torit-heritage.jpg",
    video: "/assets/tour_videos/torit.mp4",
    price: 250,
    duration: "2 days",
  },
  {
    id: 46,
    rating: 4.5,
    title: "Lobonok Waterfall Hike",
    type: "Adventure",
    description:
      "Hike to the stunning Lobonok Waterfall, a hidden gem surrounded by lush forests and wildlife.",
    image: "/assets/tours/lobonok-waterfall.jpg",
    video: "/assets/tour_videos/lobonok.mp4",
    price: 300,
    duration: "2 days",
  },
  {
    id: 47,
    rating: 4.8,
    title: "Kapoeta Star Gazing Experience",
    type: "Nature",
    description:
      "Experience the breathtaking night skies of Kapoeta, perfect for star gazing and astrophotography.",
    image: "/assets/tours/kapoeta-stars.jpg",
    video: "/assets/tour_videos/kapoeta.mp4",
    price: 200,
    duration: "1 night",
  },
  {
    id: 48,
    rating: 4.2,
    title: "Yirol Lakeside Birdwatching",
    type: "Nature",
    description:
      "Enjoy birdwatching by the serene lakes of Yirol, home to a variety of migratory and resident bird species.",
    image: "/assets/tours/yirol-birdwatching.jpg",
    video: "/assets/tour_videos/yirol.mp4",
    price: 250,
    duration: "2 days",
  },
  {
    id: 49,
    rating: 4.6,
    title: "Bahr el Jebel River Cruise",
    type: "Adventure",
    description:
      "Cruise along the Bahr el Jebel River, enjoying the scenic landscapes and spotting wildlife along the way.",
    image: "/assets/tours/bahr-el-jebel.jpg",
    video: "/assets/tour_videos/bahr-el-jebel.mp4",
    price: 500,
    duration: "3 days",
  },
  {
    id: 50,
    rating: 4.9,
    title: "Juba Street Food Tour",
    type: "Cultural",
    description:
      "Explore Juba's vibrant street food scene, sampling local delicacies and learning about South Sudanese cuisine.",
    image: "/assets/tours/juba-street-food.jpg",
    video: "/assets/tour_videos/juba.mp4",
    price: 150,
    duration: "1 day",
  },
];

// Function to shuffle an array and return the first `n` elements
const getRandomTours = (toursArray, n) => {
  const shuffled = toursArray.sort(() => 0.5 - Math.random()); // Shuffle the array
  return shuffled.slice(0, n); // Return the first `n` elements
};

// Get 9 random Featured Destinations (Wildlife tours)
const featuredDestinations = getRandomTours(
  tours.filter((tour) => tour.type === "Wildlife"),
  9
);

// Get 9 random Cultural Highlights (Cultural tours)
const culturalHighlights = getRandomTours(
  tours.filter((tour) => tour.type === "Cultural"),
  9
);

// Get 9 random Popular Tours (Adventure tours)
const popularTours = getRandomTours(
  tours.filter((tour) => tour.type === "Adventure"),
  9
);

// Log the results
console.log("Featured Destinations:", featuredDestinations);
console.log("Cultural Highlights:", culturalHighlights);
console.log("Popular Tours:", popularTours);

export default tours;
