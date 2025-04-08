/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import CertificateCard from "@/components/cards/CertificateCard";
import SkillCard from "@/components/cards/SkillCard";
import CertificateModal from "@/components/modals/CertificateModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const skillItem = [
  // Programming Languages
  {
    imgSrc: "/skills_images/python.png",
    label: "Python",
    desc: "Back-End Development",
  },
  {
    imgSrc: "/skills_images/java.png",
    label: "Java",
    desc: "Object-Oriented Programming",
  },
  {
    imgSrc: "/skills_images/javascript.png",
    label: "JavaScript",
    desc: "Front-End & Back-End Development",
  },

  // Front-End Development
  {
    imgSrc: "/skills_images/html.png",
    label: "HTML",
    desc: "Markup Language",
  },
  {
    imgSrc: "/skills_images/css.png",
    label: "CSS",
    desc: "Styling & Responsive UI",
  },
  {
    imgSrc: "/skills_images/react.png",
    label: "React",
    desc: "Front-End Framework",
  },

  // Back-End Development
  {
    imgSrc: "/skills_images/spring_boot.png",
    label: "Spring Boot",
    desc: "Java Framework",
  },
  {
    imgSrc: "/skills_images/django.png",
    label: "Django",
    desc: "Python Web Framework",
  },
  // Databases
  {
    imgSrc: "/skills_images/mysql.png",
    label: "MySQL",
    desc: "Relational Database",
  },
  {
    imgSrc: "/skills_images/postgresql.png",
    label: "PostgreSQL",
    desc: "SQL-Based Database",
  },
  {
    imgSrc: "/skills_images/mongodb.png",
    label: "MongoDB",
    desc: "NoSQL Database",
  },

  // Cloud & DevOps
  {
    imgSrc: "/skills_images/aws.png",
    label: "AWS",
    desc: "Cloud Computing",
  },
  {
    imgSrc: "/skills_images/docker.png",
    label: "Docker",
    desc: "Containerization",
  },

  // Version Control & Tools
  {
    imgSrc: "/skills_images/git.png",
    label: "Git",
    desc: "Version Control",
  },
  {
    imgSrc: "/skills_images/github.png",
    label: "GitHub",
    desc: "Code Collaboration",
  },
  {
    imgSrc: "/skills_images/vscode.png",
    label: "VS Code",
    desc: "Development Environment",
  },
  {
    imgSrc: "/skills_images/intelij.png",
    label: "IntelliJ IDEA",
    desc: "Java Development",
  },
];

const certificateItems = [
  {
    imgSrc: "images/certificate.jpg",
    title: "Certified React Developer",
    issuer: "Udemy",
    date: "Issued in January 2025",
  },
  {
    imgSrc: "images/certificate.jpg",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "Issued in December 2024",
  },
];

const AboutPage = () => {
  const [showAll, setShowAll] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const openModal = (certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  const displayedSkills = showAll ? skillItem : skillItem.slice(0, 6);

  return (
    <div className="section">
      <div className="container">
        <div className="bg-gradient-to-tl from-zinc-500 to-zinc-200 dark:bg-gradient-to-br  dark:from-zinc-800 dark:to-zinc-600 dark:text-zinc-100 rounded-2xl p-8 md:p-14">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Hey there, I’m Mihai!{" "}
            <span className="hidden md:inline-block">👋</span>
          </h1>
          <p className="text-lg dark:text-gray-300 leading-relaxed max-w-3xl mx-auto text-center">
            Passionate about crafting clean and efficient code, I specialize in
            building seamless digital experiences. Whether it’s a sleek
            **React** frontend, a robust **Spring Boot** backend, or a scalable
            **AWS** deployment, I bring a detail-oriented and innovative
            approach to development.
          </p>
        </div>
        <div className="mt-12 border border-zinc-100 dark:border-zinc-900 dark:border-t-zinc-100 border-t-zinc-900 py-8">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-6">
            My Certificates & Badges
            <span className="hidden md:inline-block">🏅</span>
          </h2>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {certificateItems.map((certificate, index) => (
              <div
                key={index}
                onClick={() => openModal(certificate)}
                className="cursor-pointer"
              >
                <CertificateCard
                  imgSrc={certificate.imgSrc}
                  title={certificate.title}
                  issuer={certificate.issuer}
                  date={certificate.date}
                />
              </div>
            ))}
          </div>
        </div>
        {isModalOpen && (
          <CertificateModal
            certificate={selectedCertificate}
            onClose={closeModal}
          />
        )}
        <div className="mt-12 border border-zinc-100 dark:border-zinc-900 dark:border-t-zinc-100 border-t-zinc-900 py-8">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-6">
            My Developer Toolkit
            <span className="hidden md:inline-block">🛠️</span>
          </h2>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {displayedSkills.map((skill, index) => (
              <SkillCard
                key={index}
                imgSrc={skill.imgSrc}
                label={skill.label}
                desc={skill.desc}
              />
            ))}
          </div>
          <div className="text-center mt-6">
            <Button
              onClick={() => setShowAll(!showAll)}
              className="sm:hidden text-lg font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 shadow-none hover:underline cursor-pointer"
            >
              {showAll ? "Show Less" : "Show All"}
            </Button>
          </div>
        </div>
        <div className="text-center mt-14">
          <p className="headline-1">Want to work together?</p>
          <Link
            to="/contact"
            className="mt-3 inline-block px-6 py-3 text-lg font-medium border text-zinc-900 hover:bg-zinc-900 hover:text-zinc-100 border-zinc-900 dark:text-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:hover:border-zinc-100 rounded-lg transition-all"
          >
            Let’s Connect!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
