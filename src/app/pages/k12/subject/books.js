import React from 'react';
import FAQSection from '../shared/faq-section';
import RawHTML from '~/components/jsx-helpers/raw-html';
import BookTile from '~/components/book-tile/book-tile';
import usePageData from '~/helpers/use-page-data';
import './books.scss';

const data = {
    subject: 'Biology',
    subhead: 'Peer-reviewed. Openly licensed. 100% free.',
    description: `All OpenStax textbooks are simple to adopt, free to use. The
    textbooks below are currently used in high school biology classrooms. Some
    of the books are developed with the higher education audience in mind but
    have been valuable additions to high school learning environments across
    the nation.`,
    aboutHeader: 'About the books',
    aboutInfo: [
        {
            title: 'Biology 2e',
            html: `<p><i>Biology 2e</i> is designed to cover the scope and sequence requirements of a typical
              two-semester biology course for science majors. The text provides comprehensive coverage of
              foundational research and core biology concepts through an evolutionary lens. Biology includes
              rich features that engage students in scientific inquiry, highlight careers in the biological
              sciences, and offer everyday applications. The book also includes various types of practice
              and homework questions that help students understand—and apply—key concepts.</p>

            <p>The 2nd edition has been revised to incorporate clearer, more current, and more dynamic
              explanations, while maintaining the same organization as the first edition. Art and
              illustrations have been substantially improved, and the textbook features additional
              assessments and related resources.</p>
            <p><strong>Senior Contributing Authors</strong></p>
            <p>Mary Ann Clark, Texas Wesleyan University<br>
              Matthew Douglas, Grand Rapids Community College<br>
              Jung Choi, Georgia Institute of Technology</p>
            <p><strong>Additional Details</strong></p>
            <p>Publish Date: Mar 28, 2018<br>
              Web Version Last Updated: Jun 09, 2022<br>
              PDF Version Last Updated: Jun 25, 2020</p>`
        }
    ],
    adoptionHeader: 'Using an OpenStax resource in your classroom? Let us know!',
    adoptionDescription: `Help us continue to make high-quality educational
    materials accessible by letting us know you've adopted! Our future grant
    funding is based on educator adoptions and the number of students we impact.`,
    adoptionButtonText: 'Report your adoption'
};

function Overview() {
    const slug = 'science';
    const subjectData = usePageData(`pages/${slug}?type=pages.Subject`, false);

    if (!subjectData) {
        return null;
    }
    console.info('Subject Data', subjectData);
    const title = 'Science';
    const cats = Object.entries(subjectData.subjects[title].categories);
    const books = cats[1][1].books;

    return (
        <div className="overview">
            <div className="text-content">
                <h1>{data.subject} textbooks</h1>
                <div>{data.subhead}</div>
                <div>{data.description}</div>
            </div>
            <div className="book-viewer">
                {
                    Object.values(books).map((b) => <BookTile key={b.id} book={b} />)
                }
            </div>
        </div>
    );
}

function AboutTheBooks() {
    const items = data.aboutInfo.map(
        (d) => ({title: d.title, contentComponent: <RawHTML html={d.html} />})
    );

    return (
        <div className="about-the-books">
            <FAQSection heading={data.aboutHeader} items={items} />
        </div>
    );
}

function AdoptionBox() {
    return (
        <div className="adoption-box boxed">
            <h2>{data.adoptionHeader}</h2>
            <div>{data.adoptionDescription}</div>
            <a href="/adoption" className="btn primary">{data.adoptionButtonText}</a>
        </div>
    );
}

export default function Books() {
    return (
        <section className="books">
            <div className="boxed">
                <Overview />
                <AboutTheBooks />
                <a className="resource-link" href="#resources">Find Supplemental Resources</a>
                <AdoptionBox />
            </div>
        </section>
    );
}
