// import tours from "../assets/data/tours";

// // Function to shuffle and get 9 random tours
// const getRandomTours = (type?: string) => {
//   let filteredTours = type ? tours.filter((tour) => tour.type === type) : tours;
//   return filteredTours.sort(() => Math.random() - 0.5).slice(0, 9);
// };

// // Export functions for different categories
// export const getFeaturedDestinations = () => getRandomTours();
// export const getCulturalHighlights = () => getRandomTours("Cultural");

// // Updated getPopularTours to include Adventure, Wildlife, and Nature tours
// export const getPopularTours = () => {
//   const filteredTours = tours.filter(
//     (tour) =>
//       tour.type === "Adventure" ||
//       tour.type === "Wildlife" ||
//       tour.type === "Nature"
//   );
//   return filteredTours.sort(() => Math.random() - 0.5).slice(0, 9);
// };
