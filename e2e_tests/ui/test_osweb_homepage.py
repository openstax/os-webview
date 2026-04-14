import pytest

from e2e_tests.ui.pages.home import HomeRex


@pytest.mark.asyncio
async def test_osweb_homepage_loads(chrome_page_unlogged, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page_unlogged.goto(base_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    # THEN: Openstax logo and osweb homepage sections are visible
    assert await home.main_menu_and_openstax_logo_is_visible()
    assert await home.osweb_homepage_content_sections()

    assert await home.upper_menu_options() > 0
