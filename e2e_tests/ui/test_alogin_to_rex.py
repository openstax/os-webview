import json
import os
import pytest


@pytest.mark.asyncio
async def test_login_to_rex(login_to_rex):
    # GIVEN: login_to_rex has run

    # THEN: The file should exist
    assert os.path.exists(login_to_rex)

    # THEN: It contains the login data
    with open(login_to_rex, 'r') as f:
        state_data = json.load(f)

    assert "origins" in state_data
    assert len(state_data["origins"]) > 0
