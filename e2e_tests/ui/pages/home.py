import pytest


class HomeRex:
    def __init__(self, page):
        self.page = page

    # openstax.org homepage

    async def main_menu_and_openstax_logo_is_visible(self):
        return await self.page.locator("div.menus.desktop > nav.nav").is_visible()

    async def osweb_homepage_content_sections(self):
        # Higher and K12 Education, and Learning Research sections of the openstax.org homepage
        return await self.page.locator(
            "section.content-block-section", has_text="Higher Education"
        ).is_visible()

    async def upper_menu_options(self):
        return await self.page.locator("nav[aria-label='Upper Menu'] li").count()

    async def click_interested_link(self):
        interested_locator = self.page.get_by_text("I'm interested!")
        await interested_locator.scroll_into_view_if_needed()
        await interested_locator.click()

    async def click_iam_dropdown_in_interested(self):
        # I am a... dropdown in Interested page
        iam_locator = self.page.get_by_role("combobox")
        await iam_locator.scroll_into_view_if_needed()
        await iam_locator.click()

    @property
    def iam_dropdown_list_item(self):
        return self.page.get_by_role("option", name="Administrator")

    @property
    def iam_form_page(self):
        return self.page.get_by_label("School name")

    async def open_technology_menu_item(self):
        tech_locator = self.page.get_by_role("button", name="Technology")
        await tech_locator.scroll_into_view_if_needed()
        await tech_locator.hover()

    async def click_openstax_assignable_link(self):
        ostax_locator = self.page.get_by_role("link", name="OpenStax Assignable")
        await ostax_locator.scroll_into_view_if_needed()
        await ostax_locator.click()

    async def available_book_list(self):
        return (
            await self.page.locator(".course-list").first.locator("div > div").count()
        )

    # Subjects homepage

    async def subjects_page_menu(self):
        return await self.page.get_by_role("button", name="Subjects").is_visible()

    async def click_subjects_page_menu(self):
        await self.page.get_by_role("button", name="Subjects").hover()

    async def click_subjects_homepage_link(self):
        await self.page.get_by_role("link", name="All").click()

    @property
    def language_selector_section(self):
        return self.page.locator("section.language-selector-section")

    @property
    def subjects_listing_section(self):
        return self.page.locator("section.subjects-listing")

    @property
    def about_openstax_section(self):
        return self.page.locator("section.about-openstax > div > h2")

    async def click_learn_about_openstax_link(self):
        await self.page.locator("a").get_by_text("Learn about OpenStax").click()

    @property
    def about_page(self):
        return self.page.locator("id=main")

    async def click_book_toc_link(self):
        await self.page.locator("div.option.toc-option").click()

    @property
    def book_toc_content(self):
        return self.page.locator("div.toc-slideout-contents > div > div")

    async def resources_tabs_are_visible(self):
        return await self.page.locator("div.tabs-and-extras").is_visible()

    async def click_instructor_resources_tab(self):
        await self.page.get_by_text("Instructor resources").click()

    async def click_student_resources_tab(self):
        await self.page.get_by_text("Student resources").click()

    @property
    def subjects_list(self):
        return self.page.locator("#ddId-Subjects > a")

    async def subjects_intro(self):
        return await self.page.locator("section.subject-intro").is_visible()

    async def subjects_title(self):
        return (
            await self.page.locator("section.subject-intro > div > h1").inner_text()
        ).lower()

    # Philanthropic support

    async def philanthropic_support_section(self):
        return await self.page.locator("section.philanthropic-support").is_visible()

    async def click_our_impact_link(self):
        await self.page.locator("a").get_by_text("Learn more about our impact").click()

    async def give_today_link_is_visible(self):
        return (
            await self.page.locator("#footer")
            .get_by_role("link", name="Give today")
            .is_visible()
        )

    async def click_give_today_link(self):
        await self.page.locator("#footer").get_by_role(
            "link", name="Give today"
        ).click()

    # Subjects page footer section

    async def footer_section(self):
        return await self.page.locator("#footer").is_visible()

    async def footer_section_help_is_visible(self):
        return await self.page.locator("div.column.col1").is_visible()

    async def footer_section_openstax_is_visible(self):
        return await self.page.locator("div.column.col2").is_visible()

    async def footer_section_policies_is_visible(self):
        return await self.page.locator("div.column.col3").is_visible()

    async def footer_section_bottom_is_visible(self):
        return await self.page.locator("div.bottom").is_visible()

    @property
    def footer_section_bottom(self):
        return self.page.locator("div.bottom")

    async def footer_section_license_link(self):
        return (
            await self.page.locator("div.copyrights")
            .get_by_role("link")
            .get_attribute("href")
        )

    # Book page navigation

    async def subject_listing_book_is_visible(self):
        return await self.page.locator("a").get_by_text("Astronomy").is_visible()

    async def click_subject_listing_book(self):
        await self.page.locator("a").get_by_text("Astronomy").click()

    async def click_book_selection(self):
        await self.page.locator("div").get_by_text("Astronomy 2e").click()

    async def buy_print_copy_button_is_visible(self):
        return await self.page.locator("a").get_by_text("Buy a print copy").is_visible()

    async def click_buy_print_copy_button(self):
        await self.page.locator("a").get_by_text("Buy a print copy").click()

    async def bookstore_box_is_visible(self):
        return await self.page.get_by_role("heading", name="Bookstore").is_visible()

    async def order_options_button_is_visible(self):
        return await self.page.locator("a").get_by_text("Order options").is_visible()

    async def order_options_href(self):
        return (
            await self.page.locator("a")
            .get_by_text("Order options")
            .get_attribute("href")
        )

    async def audiobook_link_is_visible(self):
        return await self.page.get_by_role("heading", name="Audiobook").is_visible()

    @property
    def audiobook_link_purchase_options(self):
        return self.page.get_by_role("link", name="Purchase options")

    # Higher Education and bookstore page

    async def click_higher_education_link(self):
        await self.page.get_by_role("link", name="Explore Higher Ed resources").click()

    async def click_campus_affordability_link(self):
        await self.page.get_by_role("link", name="Explore your options!").click()

    @property
    def higher_education_bookstore_order_access_code(self):
        return self.page.get_by_role("link", name="Order access codes")

    @property
    def higher_education_bookstore_view_print_options(self):
        return self.page.get_by_role("link", name="View print options")

    @property
    def obtain_access_codes_via_vitalsource(self):
        return self.page.get_by_role(
            "heading", name="Order through VitalSource-powered programs"
        )

    @property
    def obtain_access_codes_via_openstax(self):
        return self.page.get_by_role("heading", name="Order directly through OpenStax")

    @property
    def know_before_your_order_columns(self):
        return self.page.locator(
            "div.content-block-cards.card_style_rounded.has-columns"
        )

    @property
    def access_pdf(self):
        return self.page.get_by_role("link", name="Access PDF")

    @property
    def access_code_order_form(self):
        return self.page.get_by_role("link", name="order form")

    @property
    def try_assignable_today_link(self):
        return self.page.get_by_role("link", name="Try Assignable today!")

    @property
    def free_digital_library_subjects(self):
        return self.page.locator("div.content-block-cards a.cta-link")

    @property
    def search_technology_partners_link(self):
        return self.page.get_by_role("link", name="Search Technology Partners")

    # Clears blockers/overlays

    async def clear_all_blockers(self):
        await self.page.evaluate(
            """() => {
            document.querySelectorAll('div[class*="ClickBlocker"]').forEach(el => el.remove());
        }"""
        )
