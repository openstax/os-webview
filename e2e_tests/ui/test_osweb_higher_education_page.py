import pytest
from e2e_tests.e2e.ui.pages.home import HomeRex


@pytest.mark.asyncio
async def test_osweb_higher_education_page(chrome_page, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url
    await chrome_page.goto(base_url)
    home = HomeRex(chrome_page)
    await chrome_page.keyboard.press("Escape")

    # WHEN: Navigate to Higher Education (HE) page (depends on envs)
    if "staging" in chrome_page.url:
        pytest.skip("Skipping test. Staging is missing Higher Education page")
    else:

        await home.click_higher_education_link()

        # THEN: HE page opens
        assert await home.try_assignable_today_link.is_visible()

        assert await home.free_digital_library_subjects.count() == 8

        assert await home.search_technology_partners_link.is_visible()

        assert (
            "affordable technology for higher education"
            in await chrome_page.inner_text("body")
        )


@pytest.mark.asyncio
async def test_osweb_higher_education_page_bookstore_link(chrome_page, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url
    await chrome_page.goto(base_url)
    home = HomeRex(chrome_page)
    await chrome_page.keyboard.press("Escape")

    # WHEN: Navigate to bookstore page (depends on envs)
    if "staging" in chrome_page.url:
        await chrome_page.goto(f"{base_url}/bookstore")
    else:
        await home.click_higher_education_link()
        await home.click_campus_affordability_link()

    # THEN: Bookstore page elements are visible/enabled in both staging and prod envs
    assert await home.higher_education_bookstore_order_access_code.is_visible()
    assert await home.higher_education_bookstore_view_print_options.first.is_visible()
    assert await home.obtain_access_codes_via_vitalsource.is_visible()
    assert await home.obtain_access_codes_via_openstax.is_visible()
    assert await home.know_before_your_order_columns.is_visible()
    assert await home.higher_education_bookstore_view_print_options.last.is_visible()
    assert await home.access_pdf.is_visible()

    # THEN: Access code order form opens in new tab
    async with chrome_page.expect_popup() as popup_info:
        await home.access_code_order_form.click()

    new_tab = await popup_info.value
    await new_tab.wait_for_load_state()

    assert "riceuniversity.tfaforms.net/47" in new_tab.url
    assert "Assignable Bookstore Order Form" in await new_tab.title()

    await new_tab.close()
