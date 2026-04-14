import pytest
import pytest_asyncio

import os

from playwright.async_api import async_playwright


@pytest_asyncio.fixture(scope="session")
async def login_to_rex(tmp_path_factory, base_url, rex_user, rex_password):
    """
    Logs in to REX and creates a json file in a secure temp directory.
    The path is yielded so tests can use it to load state.
    """

    # Creates a temp directory
    temp_dir = tmp_path_factory.mktemp("rex_auth")
    state_path = temp_dir / "login_state.json"

    async with async_playwright() as playwright:
        browser_obj = playwright.chromium
        ch_browser = await browser_obj.launch(
            headless=True, slow_mo=900, timeout=120000
        )
        context = await ch_browser.new_context()
        page = await context.new_page()

        await page.goto(base_url)
        await page.keyboard.press("Escape")
        await page.click("a[href*='accounts/login']")
        await page.fill("#login_form_email", rex_user)
        await page.fill("#login_form_password", rex_password)
        await page.click("input.primary")

        await page.wait_for_load_state("networkidle")

        # Saves to that secure temp path
        await context.storage_state(path=str(state_path))

        yield str(state_path)

        await ch_browser.close()


@pytest_asyncio.fixture(scope="session")
async def chrome_page(login_to_rex):
    """Logged into rex using the path yielded by login_to_rex"""
    async with async_playwright() as playwright:
        browser_obj = playwright.chromium
        ch_browser = await browser_obj.launch(
            headless=True, slow_mo=900, timeout=120000
        )

        # Check that the file exists at the secure temp path
        if os.path.exists(login_to_rex) and os.path.getsize(login_to_rex) > 4:
            # Pass the full path string to storage_state
            context = await ch_browser.new_context(storage_state=login_to_rex)
            page = await context.new_page()

            yield page
        else:
            pytest.exit(
                f"Stopping run: auth file not found at {login_to_rex}"
            )

        await ch_browser.close()


@pytest_asyncio.fixture(scope="session")
async def chrome_page_unlogged():
    """Not logged into rex"""
    async with async_playwright() as playwright:
        browser_obj = playwright.chromium
        if browser_obj:
            ch_browser = await browser_obj.launch(
                headless=True, slow_mo=900, timeout=120000
            )
            context = await ch_browser.new_context()
            page = await context.new_page()
            yield page

            await ch_browser.close()


@pytest.fixture(scope="session")
def rex_user(pytestconfig):
    """Return a rex username from CLI or ini config"""
    rex_user = pytestconfig.getoption("rex_user") or pytestconfig.getini("rex_user")
    if rex_user is not None:
        return rex_user


@pytest.fixture(scope="session")
def rex_password(pytestconfig):
    """Return a rex password from CLI or ini config"""
    rex_password = pytestconfig.getoption("rex_password") or pytestconfig.getini("rex_password")
    if rex_password is not None:
        return rex_password
