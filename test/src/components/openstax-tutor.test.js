import Tutor from '~/pages/openstax-tutor/openstax-tutor';
import {clickElement} from '../../test-utils';

describe('Tutor', () => {
    const p = new Tutor();

    it('creates', () => {
        expect(p).toBeTruthy();
    });

    it('substitutes in data', () => {
        p.pageData = {
          "title": "About OpenStax Tutor",
          "section_1_heading": "Discover a new frontier in education.",
          "section_1_subheading": "Improve how your students learn with research-based technology â€” for only $10.",
          "section_1_paragraph": "<p>OpenStax Tutor Beta gives college students the easy-to-use online courseware and learning tools they need to complete their course the first time around. And itâ€™s all based on science. Available for College Physics, Biology, and Introduction to Sociology 2e.<br/></p>",
          "section_1_cta_link": "https://openstax.org",
          "section_1_cta_text": "Learn More",
          "section_2_heading": "High tech. Low cost. Improved learning.",
          "section_2_subheading": "How does OpenStax Tutor Beta work?",
          "section_2_paragraph": "<p>Wish you could work with every student, individually? With OpenStax Tutor Beta, youâ€™re getting warmer. This low-cost, easy-to-use, professionally written, peer-reviewed, and research-based tool is designed to help students learn and retain information. OpenStax Tutor Beta uses OpenStax textbooks to deliver high-quality content, simulations and videos, spaced practice, and immediate feedback.<br/></p>",
          "section_3_heading": "See what your students will see",
          "section_3_paragraph": "<p>Check out these short, helpful videos to understand what your students will see in terms of your questions, reading assignments, and homework in OpenStax Tutor Beta. Get a peek at our analytics and dashboard, too.<br/></p>",
          "marketing_videos": [{
            "video_url": "https://www.youtube.com/playlist?list=PLCF-Lie6gOOT80i2k-gn6b8aR3TpY7kCA",
            "video_blurb": "Instructor Guide to OpenStax Tutor"
          }, {
            "video_url": "https://www.youtube.com/playlist?list=PLCF-Lie6gOOT_UHrZ348jgNI6VMUWy1l-",
            "video_blurb": "Instructor Guide to OpenStax Concept Coach"
          }],
          "resource_availability": [{
            "name": "Low cost",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Easy to build assignments",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Personalized questions",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Open ended responses",
            "available": false,
            "alternate_text": "OpenStax Tutor Beta uses two-step questions"
          }, {
            "name": "Integrated digital textbook",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Permanent access to textbook content",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Video",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Algorithmic question generation",
            "available": false,
            "alternate_text": "Available for for College Physics"
          }, {
            "name": "Ability to add own questions",
            "available": false,
            "alternate_text": ""
          }, {
            "name": "Full LMS Integration",
            "available": false,
            "alternate_text": "Coming fall 2018"
          }, {
            "name": "Tutorials",
            "available": false,
            "alternate_text": "Available for for College Physics"
          }, {
            "name": "Student performance forecast",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Spaced practice review questions",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Ability to exclude questions",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Student performance analytics",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Available for college courses",
            "available": true,
            "alternate_text": ""
          }, {
            "name": "Available for high school courses",
            "available": false,
            "alternate_text": ""
          }],
          "section_4_heading": "Our current stake and future plans",
          "section_4_book_heading": "OpenStax Tutor Beta will be available this fall in College Physics, Biology, and Introduction to Sociology 2e.",
          "marketing_books": [{
            "slug": "books/biology",
            "id": 33,
            "cover_url": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/documents/biology.svg",
            "title": "Biology"
          }, {
            "slug": "books/college-physics",
            "id": 31,
            "cover_url": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/documents/physics.svg",
            "title": "College Physics"
          }, {
            "slug": "books/introduction-sociology-2e",
            "id": 32,
            "cover_url": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/documents/sociology_2e.svg",
            "title": "Introduction to Sociology 2e"
          }],
          "section_5_heading": "$10 goes a lot farther than it used to.",
          "section_5_paragraph": "<p>Generous grants from the Bill &amp; Melinda Gates Foundation, the Laura and John Arnold Foundation, and the Maxfield Foundation allowed us to create OpenStax Tutor Beta. And since OpenStax Tutor Beta technology is so easy to use, we donâ€™t need salespeople. We keep our costs low and provide OpenStax Tutor Beta for $10 per student, per course, allowing us to support the tool and make research-backed improvements.</p>",
          "faqs": [{
            "value": {
              "slug": "how-much-time-to-setup",
              "question": "<p>How much time does it take to set up OpenStax Tutor?</p>",
              "answer": "<p>10 minutes.</p>",
              "document": null
            },
            "type": "faq"
          }, {
            "value": {
              "slug": "does-it-work-with-my-lms",
              "question": "<p>Does it work with my LMS?</p>",
              "answer": "<p>Yes.</p>",
              "document": null
            },
            "type": "faq"
          }],
          "section_7_heading": "Pioneer a new way of teaching and learning",
          "section_7_subheading": "Learn more about how your students can learn more.",
          "section_7_cta_text_1": "Get Started",
          "section_7_cta_link_1": "https://tutor.openstax.org/dashboard",
          "section_7_cta_blurb_1": "to take a tour of OpenStax Tutor and view your preview course.",
          "section_7_cta_text_2": "Sign Up",
          "section_7_cta_link_2": "https://openstax.org",
          "section_7_cta_blurb_2": "for a free OpenStax Tutor webinar to answer all your questions.",
          "slug": "tutor-marketing",
          "seo_title": "",
          "search_description": ""
        };

        p.onDataLoaded();
    });

    it('increments and decrements video index', () => {
        const wsg = p.model.whatStudentsGet;

        p.incrementVideoIndex();
        p.decrementVideoIndex();
    });

    it('accepts thumbnail click', () => {
        const link = p.el.querySelector('.thumbnails > div');

        clickElement(link);
    });
});
