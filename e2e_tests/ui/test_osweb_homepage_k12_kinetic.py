import pytest

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

    assert await home.k12_find_your_subject_dropdown.is_visible()

    await home.k12_find_your_subject_dropdown.click()

    # Note, that book count is 17 on staging, 19 on prod (as of April 6th, 2026)
    assert await home.k12_find_your_subject_dropdown_options.count() >= 17

    # THEN: Subject dropdown closes
    await home.k12_find_your_subject_dropdown.click()

    # THEN: Subject cards are visible and clickable
    await home.click_k12_find_your_subject_book_cards_science_menu()

    assert await home.k12_find_your_subject_book_card_astronomy_is_visible()


@pytest.mark.asyncio
async def test_osweb_homepage_kinetic_link(chrome_page, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page.goto(base_url)
    home = HomeRex(chrome_page)

    await chrome_page.keyboard.press("Escape")

    # THEN: Kinetic page opens
    await home.click_osweb_kinetic_link()

    assert await home.kinetic_page_sample_study_link_is_enabled()

    assert (
        "Kinetic is a research platform developed by the OpenStax"
        in await chrome_page.inner_text("body")
    )
