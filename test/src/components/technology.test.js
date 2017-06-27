import Technology from '~/pages/technology/technology';

describe('Technology', () => {
    const p = new Technology();

    it('creates', () => {
        expect(p).toBeTruthy();
    });

    it('populates from cms data', () => {
        p.pageData = {
          "intro_heading": "Technology",
          "intro_description": "<p>In education, one size rarely fits all. Thatâ€™s why weâ€™ve teamed up with our partners to offer a variety of low-cost digital learning tools integrated with OpenStax books. Now you can choose the tool thatâ€™s best for your course, at a price thatâ€™s best for your students.</p><br/>",
          "banner_cta": "LEARN MORE",
          "banner_cta_link": "",
          "select_tech_heading": "Discover the resources at your fingertips",
          "select_tech_step_1": "Choose your book",
          "select_tech_step_2": "View free instructor resources",
          "select_tech_step_3": "View technology options",
          "new_frontier_heading": "Discover a new frontier in education",
          "new_frontier_subheading": "Improve how your students learn with research-based technology â€” for only $10.",
          "new_frontier_description": "<p>OpenStax Tutor Beta gives college students easy-to-use online courseware and learning tools they need to complete their course the first time around. And itâ€™s all based on science. Available for College Physics, Biology, and Introduction to Sociology 2e.</p>",
          "new_frontier_cta_1": "Learn more",
          "new_frontier_cta_link_1": "https://oscms-dev.openstax.org/openstax-tutor",
          "new_frontier_cta_2": "Go to OpenStax Tutor",
          "new_frontier_cta_link_2": "https://tutor.openstax.org/dashboard"
        };

        p.onDataLoaded();
    });
});
