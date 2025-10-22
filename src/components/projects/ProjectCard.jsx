import React from "react";
import "./projects.css";

const ProjectCard = ({ title, description, image, liveLink, githubLink }) => {
    return (
        <div className="project__wrapper">
            <div className="project__card-content">
                <div className="project__card-header">
                    <span className="project__title">{title}</span>
                    <div className="project__links">
                        {liveLink && liveLink !== "#" && (
                            <a
                                href={liveLink}
                                className="project__btn project__btn--active"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Live Project"
                            >
                                <i className="uil uil-external-link-alt"></i>
                            </a>
                        )}
                        {liveLink === "#" && (
                            <span
                                className="project__btn project__btn--disabled"
                                aria-label="Figma Design"
                                title="Figma Design - No Live Link"
                            >
                                <i className="uil uil-figma"></i>
                            </span>
                        )}
                        {githubLink && githubLink !== "#" && (
                            <a
                                href={githubLink}
                                className="project__btn"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub Repo"
                            >
                                <i className="uil uil-github"></i>
                            </a>
                        )}
                    </div>
                </div>
                <p className="project__description">{description}</p>
                <p className="project__note"></p>
                <div className="project__img-wrapper">
                    <img src={image} alt={title} className="project__img" />
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
