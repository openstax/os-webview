import pytest
import asyncio

from e2e_tests.ui.pages.home import HomeRex


@pytest.mark.asyncio
async def test_subjects_footer(chrome_page_unlogged, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page_unlogged.goto(base_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    await home.click_subjects_page_menu()

    await home.click_subjects_homepage_link()

    # THEN: Footer section loads
    assert await home.footer_section()

    assert await home.footer_section_help_is_visible()
    assert await home.footer_section_openstax_is_visible()
    assert await home.footer_section_policies_is_visible()

    assert await home.footer_section_bottom_is_visible()

    assert (
        "Rice University" in await home.footer_section_bottom.inner_text()
        and "license" in await home.footer_section_bottom.inner_text()
    )

    assert "https://creativecommons.org" in await home.footer_section_license_link()
