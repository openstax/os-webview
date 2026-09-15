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

    # THEN: K12 page opens and subject dropdown is clickable (Important! Some content items in CMS
    # can be changed without prior deployment)
    await home.click_osweb_k12_link()
    await chrome_page.wait_for_load_state("domcontentloaded")

    await home.k12_find_your_subject.wait_for(state="visible")
    assert await home.k12_find_your_subject.is_visible()

    await home.check_links_in_subject_options()

    # THEN: Subject cards are visible and clickable
    await chrome_page.keyboard.press("Escape")
    await home.click_k12_find_your_subject_book_cards_science_menu()
    await chrome_page.wait_for_load_state("domcontentloaded")

    await home.k12_find_your_subject_book_card_astronomy.wait_for(state="visible")
    assert await home.k12_find_your_subject_book_card_astronomy.is_visible()
