/* eslint-disable max-len, camelcase */
export default {
    id: 351,
    meta: {
        slug: 'partners',
        seo_title: 'OpenStax Tech Scout',
        search_description: '',
        type: 'pages.PartnersPage',
        detail_url: 'https://dev.openstax.org/apps/cms/api/v2/pages/351/',
        html_url: 'https://dev.openstax.org/partners/',
        show_in_menus: false,
        first_published_at: '2019-12-13T10:13:00.188632-06:00',
        alias_of: null,
        parent: {
            id: 29,
            meta: {
                type: 'pages.HomePage',
                detail_url:
                    'https://dev.openstax.org/apps/cms/api/v2/pages/29/',
                html_url: 'https://dev.openstax.org/'
            },
            title: 'Openstax Homepage'
        },
        locale: 'en'
    },
    title: 'OpenStax Tech Scout',
    heading: 'OpenStax Tech Scout',
    description:
        '<p data-block-key="zae2b">With our tool, you can search the specifics of all of our technology partners to find the best option for your course.<br/>Based on the <a href="http://coursewareincontext.org/">CWiC Framework</a>, licensed under a CC BY 4.0 International license<br/>See also our <a href="/general/openstax-ally-technology-partner-program">Technology Partnerships</a>!</p><p data-block-key="y052r">And an <a id="116" linktype="page">internal link</a>!</p>',
    partner_landing_page_link: 'Visit partner website',
    partner_request_info_link: 'Request Info!',
    partner_full_partner_heading: 'Full Partners!',
    partner_full_partner_description:
        'This is what Full Partner means....blah blah this is really in the CMS',
    partner_ally_heading: 'Just Allies',
    partner_ally_description:
        "Don't use this header or description in production.",
    category_mapping: {
        'Integrated with OpenStax': 'integrated',
        Cost: 'affordability_',
        'App Available': 'app_',
        Adaptivity: 'adaptivity_',
        'Assignment Management': 'assignment_',
        'Feedback to students and instructors': 'feedback_',
        Grading: 'grading_',
        Interactivity: 'interactivity_',
        'LMS integration': 'LMS_',
        'Instructional Level': 'instructional_level_'
    },
    field_name_mapping: {
        'Cost per semester': 'affordability_cost',
        Integrated: 'integrated',
        'App Available': 'app_available',
        'Adaptive presentation of content based on learner goals':
            'adaptivity_adaptive_presentation',
        'Ability to offer variation in level of content and/or depth of coverage':
            'adaptivity_breadth_and_depth',
        'Customized learning paths based on student input':
            'adaptivity_customized_path',
        'Ability for instructor to control adaptivity and personalization':
            'adaptivity_instructor_control',
        'System generates multiple versions of quantitative questions':
            'adaptivity_quantitative_randomization',
        'Ability for students to upload outside resources':
            'assigment_outside_resources',
        'Ability to edit assignments': 'assignment_editing',
        'Ability to include multimedia content in assignments or assessments':
            'assignment_multimedia',
        'Offers pre-tests that give students feedback': 'assignment_pretest',
        'Ability to construct scientific structures (e.g., molecular drawing tools)':
            'assignment_scientific_structures',
        'Ability to generate, administer, and proctor summative assessments':
            'assignment_summative_assessments',
        'Early warning system for instructors identifying students with performance issues':
            'feedback_early_warning',
        'Students receive feedback on knowledge gaps':
            'feedback_knowledge_gaps',
        'Feedback Learner Progress Tasks': 'feedback_learner_progress_tasks',
        'Multiple-step feedback for students': 'feedback_multipart',
        "Ability to measure student's level of understanding":
            'feedback_understanding',
        'Ability to change or add scores in gradebook': 'grading_change_scores',
        'Analytics on both class-level and student-level competencies':
            'grading_class_and_student_level',
        'Ability for students to work and be graded as a group':
            'grading_group_work',
        'Grading Learning Portfolio': 'grading_learning_portfolio',
        'Ability to add scores using standards- or rubric-based grading':
            'grading_rubric_based',
        'Ability to adjust grading tolerances; e.g., significant figure adjustments':
            'grading_tolerances_sig_fig',
        'Ability for students to annotate content': 'interactivity_annotate',
        'Built-in assessments that prompt students to apply knowledge from previous assignments':
            'interactivity_previous_knowledge',
        'Simulations that allow students to predict outcomes and analyze data':
            'interactivity_simulations',
        'Sends grade information to my LMS': 'LMS_sends_grades',
        'Single sign-on (Lets students log in with their college account information)':
            'LMS_SSO',
        'Accessibility WCAG': 'accessibility_WCAG',
        'Gives analytics back to my LMS': 'LMS_analytics',
        'Supports K12': 'instructional_level_k12'
    },
    partner_type_choices: [
        'Content customization',
        'Online homework',
        'Adaptive Courseware',
        'Clicker/classroom engagement',
        'E-Reader',
        'Simulations',
        'Labs and lab manuals'
    ]
};
