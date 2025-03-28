import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const teamMembers = [
  {
    id: 1,
    name: "about.team.james.name",
    role: "about.team.james.role",
    image: "/assets/team/james.jpg",
  },
  {
    id: 2,
    name: "about.team.sarah.name",
    role: "about.team.sarah.role",
    image: "/assets/team/sarah.jpg",
  },
  {
    id: 3,
    name: "about.team.david.name",
    role: "about.team.david.role",
    image: "/assets/team/david.jpg",
  },
];

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center h-[50vh] text-center bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/assets/about-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-green-800">
            {t("about.hero.title")}
          </h1>
          <p className="mt-4 text-lg max-w-3xl text-gray-700">
            {t("about.hero.description")}
          </p>
        </div>
      </motion.div>

      {/* Our Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-green-800">
          {t("about.mission.title")}
        </h2>
        <p className="mt-4 text-lg text-gray-700 max-w-4xl mx-auto">
          {t("about.mission.description")}
        </p>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-green-100 py-16 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800">
            {t("about.whyChooseUs.title")}
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-800">
                {t("about.whyChooseUs.features.0.title")}
              </h3>
              <p className="text-gray-700 mt-2">
                {t("about.whyChooseUs.features.0.description")}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-800">
                {t("about.whyChooseUs.features.1.title")}
              </h3>
              <p className="text-gray-700 mt-2">
                {t("about.whyChooseUs.features.1.description")}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-800">
                {t("about.whyChooseUs.features.2.title")}
              </h3>
              <p className="text-gray-700 mt-2">
                {t("about.whyChooseUs.features.2.description")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Meet the Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 px-4 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-green-800">
          {t("about.team.title")}
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={member.image}
                alt={t(member.name)}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="mt-4 text-xl font-semibold text-green-800">
                {t(member.name)}
              </h3>
              <p className="text-gray-700">{t(member.role)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-12 bg-white text-white text-center"
      >
        <h2 className="text-3xl font-bold text-green-800">
          {t("about.cta.title")}
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
          {t("about.cta.description")}
          <div className="text-center">
            <Link
              to="/contact"
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              {t("about.cta.buttonText")}
            </Link>
          </div>
        </p>
      </motion.div>
    </div>
  );
};

export default About;
