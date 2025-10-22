import React from 'react';
import './projects.css';
import ProjectData from './ProjectData';
import ProjectCard from './ProjectCard';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const Projects = () => {
  return (
    <section className="projects container section" id="projects">
      <h2 className="section__title">My Projects</h2>
      <span className="section__subtitle">Portfolio</span>

      <Swiper
        className="projects__container project-swiper"
        loop={true}
        grabCursor={true}
        spaceBetween={24}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        breakpoints={{
          576: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 48,
          },
        }}
        modules={[Pagination, Autoplay]}
      >
        {ProjectData.map(({ id, title, description, image, liveLink, githubLink }) => (
          <SwiperSlide className="project__card" key={id}>
            <ProjectCard
              title={title}
              description={description}
              image={image}
              liveLink={liveLink}
              githubLink={githubLink}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Projects;