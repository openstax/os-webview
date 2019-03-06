import componentType from '~/helpers/controller/init-mixin';
import css from './institutional-partner-program.css';
import Banner from './sections/banner/banner';
import OverlappingQuote from './sections/overlapping-quote/overlapping-quote';
import About from './sections/about/about';
import Promoting from './sections/promoting/promoting';
import BigQuote from './sections/big-quote/big-quote';
import Speaking from './sections/speaking/speaking';
import Results from './sections/results/results';
import Participants from './sections/participants/participants';
import SmallQuote from './sections/small-quote/small-quote';
import SignUp from './sections/sign-up/sign-up';

const spec = {
    css,
    view: {
        classes: ['institutional-partner-program', 'page'],
        tag: 'main'
    },
    slug: 'pages/institutional-partner-program'
};

export default class extends componentType(spec) {

    onLoaded() {
        /* eslint camelcase: 0 */
        this.pageData = {
            section_1_heading: 'Institutional Partner Program',
            section_1_description: `
            Apply now for the 2019-2020 program! Applications are due <b>April 30, 2019</b>.`,
            section_1_link_text: 'Apply now',
            section_1_link: 'http://example.com/apply',
            quote: `Having to develop our strategic plan early on and having monthly
            conversations with our equally engaged collagues from other schools was
            very motivating and the jump start that carried us to new heights.`,
            quote_name: 'Kathy Labadorf',
            quote_title: 'Open Educational Resources, Information Literacy, and WGSS Librarian',
            quote_school: 'University of Connecticut',
            section_2_heading: 'About the program',
            section_2_description: `
            <p>Rice Univerity's OpenStax is one of the leading publishers of open
            educational resources (OER) in the world. With a library of over 30 free,
            high-quality, peer-reviewed textbooks, Openstax is breaking down the most
            common barriers to learning</p><p>That's why we created the Openstax
            Institutional Partner Program, which is designed to provide institutions
            with guidance to greatly increase the use of open educational resources
            on their campuses through a structured strategic plan and community of
            peers. The program teaches institutions the most effective strategies for
            encouraging faculty adoption of OER in general, not just of OpenStax.</p>
            <p>This program is for institutions ready to make an impact on campus by
            dedicating teh necessary time and resources to motivate faculty and
            utilize open educational resources to drive student success, retention,
            and completion.</p>
            <p>Download <a href="http://example.com/brochure">this brochure</a> for
            more details about the program.</p>`,
            section_2_image: 'http://via.placeholder.com/440x470/998866',
            section_2_image_alt: 'A view of Rice',
            section_3_heading: 'Promoting OER on your campus',
            section_3_description: `Institutions don't have to be in the Institutional
            Partnership Program to start encouraging the use of OER on campus. Below
            are a few tips to get started.`,
            section_3_wide_cards: [
                {
                    icon: 'http://via.placeholder.com/48/4488FF',
                    html: `<b>Create some goals</b> focusing on outcomes and put together
                    a plan to reach those OER goals`
                },
                {
                    icon: 'http://via.placeholder.com/48/4488FF',
                    html: `<b>Plan a series of events with faculty promoting OER on
                    your campus`
                },
                {
                    icon: 'http://via.placeholder.com/48/4488FF',
                    html: `<b>Follow up with faculty</b> attendees to see if they're
                    interested in piloting or adopting OER`
                }
            ],
            section_3_tall_cards: [
                {
                    html: `For more tips on how to get started, download our
                    <b>Summer Action Plan Checklist</b>.`,
                    link: 'http://example.com/download',
                    link_text: 'Download'
                },
                {
                    html: `Check out this <b>Open Oregon webinar</b> on effective
                    strategies to increase OER adoptions on your campus, hosted by
                    Nicole Finkbeiner, director of institutional relations at OpenStax.`,
                    link: 'http://example.com/download',
                    link_text: 'Download'
                }
            ],
            section_4_quote_text: `Our partnership with OpenStax fostered lifelong
            connections that benefit not only OER collaborations, but student success
            between institutions.`,
            section_4_quote_name: 'Brian Weston',
            section_4_quote_title: 'Director of Distance and Accelerated Learning',
            section_4_quote_school: 'College of the Canyons',
            section_5_heading: 'Speaking engagements & webinars',
            section_5_description: `
            <p>After five years of running the Institutional Partnership Program,
            Nicole Finkbeiner blah blah blah</p>
            Book Nicole for your next campus event by contacting
            <a href="mailto:something@rice.edu">institutionalpartners@openstax.org</a>`,
            section_5_image: 'http://via.placeholder.com/440x470/665533',
            section_5_image_alt: 'Nicole at lectern',
            section_6_heading: 'Big results',
            section_6_description: `Last year, institutions in the program, on average,
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
            aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. `,
            section_6_cards: [
                {
                    heading_number: '161',
                    heading_unit: '%',
                    description: 'Students use OpenStax textbooks'
                },
                {
                    heading_number: '17.4',
                    heading_unit: 'Million',
                    description: 'projected student savings this year'
                },
                {
                    heading_number: '150',
                    heading_unit: '%',
                    description: 'more students impacted by OER this year'
                },
                {
                    heading_number: '4.9',
                    heading_unit: 'Million',
                    description: 'in additional student savings'
                }
            ],
            section_7_heading: 'Program Participants',
            section_7_subheading: '2019-2020 Cohort',
            section_7_icons: [
                {
                    image: 'http://via.placeholder.com/180x64?text=school%20name',
                    image_alt_text: 'school name'
                },
                {
                    image: 'http://via.placeholder.com/180x64?text=school%20name',
                    image_alt_text: 'school name'
                },
                {
                    image: 'http://via.placeholder.com/120x110?text=school%20name',
                    image_alt_text: 'school name'
                },
                {
                    image: 'http://via.placeholder.com/180x64?text=school%20name',
                    image_alt_text: 'school name'
                },
                {
                    image: 'http://via.placeholder.com/180x64?text=school%20name',
                    image_alt_text: 'school name'
                },
                {
                    image: 'http://via.placeholder.com/180x64?text=school%20name',
                    image_alt_text: 'school name'
                },
                {
                    image: 'http://via.placeholder.com/180x64?text=school%20name',
                    image_alt_text: 'school name'
                }
            ],
            section_7_link_text: 'See established partners',
            section_7_link_target: '/partners',
            section_8_quote_text: `Our partnership with OpenStax fostered lifelong
            connections that benefit not only OER collaborations, but student success
            between institutions.`,
            section_8_quote_name: 'Brian Weston',
            section_8_quote_title: 'Director of Distance and Accelerated Learning',
            section_8_quote_school: 'College of the Canyons',
            section_9_heading: 'Sign up for updates',
            section_9_submit_url: 'http://example.com/formSubmit',
            section_9_form_prompt: 'Enter your email here.',
            section_9_button_text: 'Sign up',
            section_9_contact_html: `Have questions about the program? Please contact
            <br>
            <a href="mailto: institutionalpartners@openstax.org">institutionalpartners@openstax.org</a>`

        };
        this.onDataLoaded();
    }

    onDataLoaded() {
        const data = this.pageData;

        this.regions.self.attach(new Banner({
            model: {
                heading: data.section_1_heading,
                description: data.section_1_description,
                linkText: data.section_1_link_text,
                linkUrl: data.section_1_link
            }
        }));
        this.regions.self.append(new OverlappingQuote({
            model: {
                quote: data.quote,
                name: data.quote_name,
                title: data.quote_title,
                school: data.quote_school
            }
        }));
        this.regions.self.append(new About({
            model: {
                heading: data.section_2_heading,
                description: data.section_2_description,
                image: data.section_2_image,
                altText: data.section_2_image_alt
            }
        }));
        this.regions.self.append(new Promoting({
            model: {
                heading: data.section_3_heading,
                description: data.section_3_description,
                wideCards: data.section_3_wide_cards,
                tallCards: data.section_3_tall_cards.map(({html, link, link_text}) => (
                    {
                        html,
                        link,
                        linkText: link_text
                    }
                ))
            }
        }));
        this.regions.self.append(new BigQuote({
            model: {
                quote: data.section_4_quote_text,
                name: data.section_4_quote_name,
                title: data.section_4_quote_title,
                school: data.section_4_quote_school
            }
        }));
        this.regions.self.append(new Speaking({
            model: {
                heading: data.section_5_heading,
                description: data.section_5_description,
                image: data.section_5_image,
                altText: data.section_5_image_alt
            }
        }));
        this.regions.self.append(new Results({
            model: {
                heading: data.section_6_heading,
                description: data.section_6_description,
                cards: data.section_6_cards.map((c) => ({
                    headingNumber: c.heading_number,
                    headingUnit: c.heading_unit,
                    description: c.description
                }))
            }
        }));
        this.regions.self.append(new Participants({
            model: {
                heading: data.section_7_heading,
                subheading: data.section_7_subheading,
                icons: data.section_7_icons.map((i) => ({
                    image: i.image,
                    altText: i.image_alt_text
                })),
                linkText: data.section_7_link_text,
                linkTarget: data.section_7_link_target
            }
        }));
        this.regions.self.append(new SmallQuote({
            model: {
                quote: data.section_8_quote_text,
                name: data.section_8_quote_name,
                title: data.section_8_quote_title,
                school: data.section_8_quote_school
            }
        }));
        this.regions.self.append(new SignUp({
            model: {
                heading: data.section_9_heading,
                submitUrl: data.section_9_submit_url,
                formPrompt: data.section_9_form_prompt,
                buttonText: data.section_9_button_text,
                contactHtml: data.section_9_contact_html
            }
        }));
    }

}
