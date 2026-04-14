import pytest
import asyncio

from e2e_tests.ui.pages.home import HomeRex


@pytest.mark.asyncio
async def test_subjects_philanthropic_support(chrome_page_unlogged, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page_unlogged.goto(base_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    await home.click_subjects_page_menu()

    await home.click_subjects_homepage_link()

    assert await home.philanthropic_support_section()

    # THEN: Philanthropic support section opens
    await home.click_our_impact_link()

    assert f"{base_url}/impact" == chrome_page_unlogged.url

    assert await home.give_today_link_is_visible()

    async with chrome_page_unlogged.expect_popup() as popup_info:
        await home.click_give_today_link()

    new_tab = await popup_info.value

    assert "riceconnect.rice.edu/donation/support-openstax-" in new_tab.url
