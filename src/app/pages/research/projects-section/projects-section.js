import React, {useState} from 'react';
import LinkOrNot from '../link-or-not';
import cn from 'classnames';
import './projects-section.css';

const projectColors = ['blue', 'green', 'yellow', 'red', 'orange'];

export default function ProjectsSection({data: {projectsHeader, projects, ...other}}) {
    return (
        <section className="projects-section">
            <div className="content">
                <h1>{projectsHeader}</h1>
                <div className="project-cards">
                    {
                        projects.map((project, i) =>
                            <div
                                className={cn('card', projectColors[i % projectColors.length])}
                                key={project.title}
                            >
                                <LinkOrNot url={project.url}>
                                    <div className="card-content">
                                        <h2>{project.title}</h2>
                                        <div>{project.blurb}</div>
                                    </div>
                                </LinkOrNot>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    );
}
