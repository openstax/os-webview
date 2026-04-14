import os

import pytest


# Import fixtures
pytest_plugins = "e2e_tests.ui.fixtures.ui"


def pytest_addoption(parser):
    parser.addini("rex_user", help="rex user")
    parser.addoption(
        "--rex_user",
        metavar="tag",
        default=os.getenv("REX_USER", None),
        help="rex user",
    )
    parser.addini("rex_password", help="rex password")
    parser.addoption(
        "--rex_password",
        metavar="tag",
        default=os.getenv("REX_PASSWORD", None),
        help="rex password",
    )


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """
    Override browser context arguments to set a large viewport size
    """
    return {
        **browser_context_args,
        "viewport": {
            "width": 1920,
            "height": 1080,
        },
        "device_scale_factor": 1,
    }
