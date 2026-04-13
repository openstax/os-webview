import pytest


@pytest.mark.asyncio
async def test_login_to_rex(login_to_rex):

    # GIVEN: REX launches
    # WHEN:  User logs in

    # THEN: Storage state with login information for future login reuse is created (login_state.json)
    origins = login_to_rex["origins"]

    # THEN: Asserts that saved session state is valid and not empty
    assert origins
    assert all("origin" in entry for entry in origins)

    print(f"Logged in to: {[d['origin'] for d in origins][0]}")
