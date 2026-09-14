import pytest

from e2e_tests.ui.fixtures.ui import chrome_page
from e2e_tests.ui.pages.home import HomeRex


@pytest.mark.asyncio
async def test_osweb_homepage_k12_link(chrome_page, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page.goto(base_url)
    home = HomeRex(chrome_page)

    await chrome_page.keyboard.press("Escape")

    # THEN: K12 page opens and subject dropdown is clickable
    await home.click_osweb_k12_link()

    assert await home.k12_find_your_subject.is_visible()

    await home.check_links_in_subject_options()

    # THEN: Subject cards are visible and clickable
    await chrome_page.keyboard.press("Escape")
    await home.click_k12_find_your_subject_book_cards_science_menu()

    assert await home.k12_find_your_subject_book_card_astronomy_is_visible()


@pytest.mark.asyncio
async def test_osweb_homepage_higher_education_link(chrome_page, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page.goto(base_url)
    home = HomeRex(chrome_page)

    await chrome_page.keyboard.press("Escape")

    # THEN: Kinetic page opens
    await home.click_osweb_higher_ed_link()

    assert await home.higher_ed_page_content_is_visible()

    assert await home.higher_ed_page_innovation_section_is_visible()
