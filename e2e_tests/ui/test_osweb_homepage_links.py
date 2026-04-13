import pytest

from e2e_tests.e2e.ui.fixtures.ui import chrome_page_unlogged
from e2e_tests.e2e.ui.pages.home import HomeRex


@pytest.mark.asyncio
async def test_osweb_homepage_interested_link(chrome_page_unlogged, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page_unlogged.goto(base_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    await chrome_page_unlogged.keyboard.press("Escape")

    # THEN: I'm interested page opens
    await home.click_interested_link()

    assert "interest" in chrome_page_unlogged.url

    await home.click_iam_dropdown_in_interested()

    assert await home.iam_dropdown_list_item.is_visible()

    await home.iam_dropdown_list_item.click()

    assert await home.iam_form_page.is_visible()


@pytest.mark.asyncio
async def test_osweb_homepage_try_assignable_link(chrome_page_unlogged, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page_unlogged.goto(base_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    await chrome_page_unlogged.keyboard.press("Escape")

    # THEN: OpenStax Assignable page opens
    await home.open_technology_menu_item()
    await home.click_openstax_assignable_link()

    assert "assignable" in chrome_page_unlogged.url

    if "staging" not in chrome_page_unlogged.url:
        # THEN: Number of books available in assignables is 31 (as of Feb. 2026)
        assert await home.available_book_list() >= 31

    else:
        pytest.skip(
            "Staging environment. Skipping 'available books in assignable' test"
        )
