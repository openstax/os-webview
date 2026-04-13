import pytest

from e2e_tests.ui.pages.home import HomeRex

from playwright.async_api import TimeoutError
import sys


@pytest.mark.parametrize("book_slug", ["physics"])
@pytest.mark.asyncio
async def test_buy_print_copy_link(chrome_page_unlogged, base_url, book_slug):

    # GIVEN: Open osweb book details page

    # WHEN: The Home page is fully loaded
    details_books_url = f"{base_url}/details/books/{book_slug}"

    await chrome_page_unlogged.goto(details_books_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    # THEN: Buy print copy button exists and opens correct page
    assert await home.buy_print_copy_button_is_visible()

    async with chrome_page_unlogged.expect_popup() as popup_info:
        await home.click_buy_print_copy_button()

    new_tab = await popup_info.value
    new_tab_content = await new_tab.content()

    if "staging" in details_books_url:
        assert "amazon.com" in new_tab_content.lower()
    else:
        assert (
            "openstax" in new_tab_content.lower()
            and book_slug in new_tab_content.lower()
        )


@pytest.mark.parametrize("book_slug", ["statistics"])
@pytest.mark.asyncio
async def test_order_options_link(chrome_page_unlogged, base_url, book_slug):

    # GIVEN: Open osweb book details page

    # WHEN: The Home page is fully loaded
    details_books_url = f"{base_url}/details/books/{book_slug}"

    await chrome_page_unlogged.goto(details_books_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    # THEN: Order options button exists and opens correct page
    assert await home.bookstore_box_is_visible()
    assert await home.order_options_button_is_visible()

    assert "Kendall_Hunt" in await home.order_options_href()


@pytest.mark.parametrize("book_slug", ["algebra-and-trigonometry-2e"])
@pytest.mark.asyncio
async def test_toc_slideout(chrome_page_unlogged, base_url, book_slug):

    # GIVEN: Open osweb book details page

    # WHEN: The Home page is fully loaded
    details_books_url = f"{base_url}/details/books/{book_slug}"

    await chrome_page_unlogged.goto(details_books_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    await home.click_book_toc_link()

    book_toc_content = await home.book_toc_content.inner_text()

    # THEN: Book TOC slideout opens
    assert "Chapter" and "Index" in book_toc_content


@pytest.mark.parametrize("book_slug", ["chemistry"])
@pytest.mark.asyncio
async def test_resources_tabs(chrome_page_unlogged, base_url, book_slug):

    # GIVEN: Open osweb book details page

    # WHEN: The Home page is fully loaded
    details_books_url = f"{base_url}/details/books/{book_slug}"

    await chrome_page_unlogged.goto(details_books_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    # THEN: Resources tabs are visible and clickable
    assert await home.resources_tabs_are_visible()

    await home.click_instructor_resources_tab()

    assert "Instructor" in chrome_page_unlogged.url

    await home.click_student_resources_tab()

    assert "Student" in chrome_page_unlogged.url


@pytest.mark.parametrize("book_slug", ["anatomy-and-physiology-2e"])
@pytest.mark.asyncio
async def test_audiobook_link(chrome_page_unlogged, base_url, book_slug):

    # GIVEN: Open osweb book details page

    # WHEN: The Home page is fully loaded
    details_books_url = f"{base_url}/details/books/{book_slug}"

    await chrome_page_unlogged.goto(details_books_url)
    home = HomeRex(chrome_page_unlogged)

    await chrome_page_unlogged.keyboard.press("Escape")

    # THEN: Audiobook link is visible and clickable
    if "staging" not in chrome_page_unlogged.url:
        pytest.skip("Production books don't have audio link yet...")
    else:
        assert await home.audiobook_link_is_visible()

        assert await home.audiobook_link_purchase_options.is_enabled()
