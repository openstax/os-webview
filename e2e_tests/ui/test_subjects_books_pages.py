import pytest
import asyncio

from e2e_tests.e2e.ui.pages.home import HomeRex


@pytest.mark.asyncio
async def test_subjects_books_pages_load(chrome_page_unlogged, base_url):
    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page_unlogged.goto(base_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    await home.click_subjects_page_menu()

    # THEN: Subjects list shows and subjects pages load
    scount = await home.subjects_list.count()

    for i in range(scount):
        item = home.subjects_list.nth(i)
        hrefs = await item.get_attribute("href")
        slink = f"{base_url}{hrefs}"

        slink_resp = await chrome_page_unlogged.goto(slink)

        assert slink_resp.status == 200

        try:
            assert await home.subjects_intro()

        except AssertionError:
            continue

        else:
            mhrefs = hrefs.replace("/subjects/", "")
            mod_hrefs = mhrefs.replace("-", " ")

            assert await home.subjects_title() in mod_hrefs


@pytest.mark.asyncio
async def test_book_title_links_to_books_detail_page(chrome_page_unlogged, base_url):

    # GIVEN: Playwright, chromium and the rex_base_url

    # WHEN: The Home page is fully loaded
    await chrome_page_unlogged.goto(f"{base_url}/subjects")
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    assert await home.subject_listing_book_is_visible()

    await home.click_subject_listing_book()

    await home.click_book_selection()

    # THEN: The page navigates to {base_url}/details/books/astronomy-2e
    assert "astronomy" in chrome_page_unlogged.url.lower()
