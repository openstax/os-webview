import pytest

from e2e_tests.ui.fixtures.ui import chrome_page_unlogged
from e2e_tests.ui.pages.home import HomeRex


@pytest.mark.asyncio
async def test_osweb_homepage_try_assignable_link(chrome_page_unlogged, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page_unlogged.goto(base_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    await chrome_page_unlogged.keyboard.press("Escape")

    # THEN: OpenStax Assignable page opens. Important! Technology menu item in CMS
    # can be changed without prior deployment
    await home.click_openstax_assignable_link_in_technology_menu()

    if "staging" not in chrome_page_unlogged.url:
        # THEN: Number of books available in assignables is 37 (as of Sept. 2026)
        assert await home.available_book_list.count() >= 37

    else:
        pytest.skip(
            "Staging environment. Skipping 'available books in assignable' test"
        )
