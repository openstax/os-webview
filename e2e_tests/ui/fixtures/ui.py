import requests

import pytest
import pytest_asyncio

from pathlib import Path
import os

from playwright.async_api import async_playwright


@pytest_asyncio.fixture
async def login_to_rex(base_url, rex_user, rex_password):
    """Logs in to REX and creates a json file with saved authenticated state of a browser context
    which can be loaded into new contexts"""
    async with async_playwright() as playwright:
        browser_obj = playwright.chromium
        if browser_obj:
            ch_browser = await browser_obj.launch(
                headless=True, slow_mo=1800, timeout=120000
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

            yield await context.storage_state(path="login_state.json")

            await ch_browser.close()


@pytest_asyncio.fixture
async def chrome_page():
    """Logged into rex using login_state.json created in login_to_rex"""
    async with async_playwright() as playwright:
        browser_obj = playwright.chromium
        if browser_obj:
            ch_browser = await browser_obj.launch(
                headless=True, slow_mo=1800, timeout=120000
            )
            file_name = "login_state.json"
            root_dir = Path(".")
            json_file_path = root_dir / file_name

            # Checks that login_state.json exists and is not empty
            if os.path.exists(json_file_path) and os.path.getsize(json_file_path) > 4:

                context = await ch_browser.new_context(storage_state="login_state.json")
                page = await context.new_page()

                yield page

            else:
                pytest.exit(
                    "Stopping run as no login_state.json file exists or is empty"
                )

            await ch_browser.close()


@pytest_asyncio.fixture
async def chrome_page_unlogged():
    """Not logged into rex"""
    async with async_playwright() as playwright:
        browser_obj = playwright.chromium
        if browser_obj:
            ch_browser = await browser_obj.launch(
                headless=True, slow_mo=1800, timeout=120000
            )
            context = await ch_browser.new_context()
            page = await context.new_page()
            yield page

            await ch_browser.close()


@pytest.fixture
def rex_user(request):
    """Return a rex username"""
    config = request.config
    rex_user = config.getoption("rex_user") or config.getini("rex_user")
    if rex_user is not None:
        return rex_user


@pytest.fixture
def rex_password(request):
    """Return a rex password"""
    config = request.config
    rex_password = config.getoption("rex_password") or config.getini("rex_password")
    if rex_password is not None:
        return rex_password
