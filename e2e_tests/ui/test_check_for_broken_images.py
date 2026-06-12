import pytest


@pytest.mark.asyncio
async def test_check_for_broken_images(chrome_page_unlogged, base_url):
    # GIVEN: The (staging.)openstax.org homepage and pages

    osweb_pages = ["", "higher-education", "k12", "kinetic", "subjects", "assignable",
                   "partners", "about", "research", "institutional-partnership",
                   "openstax-ally-technology-partner-program", "interest", "impact", "foundation"]

    all_broken = {}

    # WHEN: The pages are fully loaded
    for osweb_page in osweb_pages:
        resp = await chrome_page_unlogged.goto(f"{base_url}/{osweb_page}", wait_until="domcontentloaded")
        await chrome_page_unlogged.wait_for_timeout(2000)

        if resp.status >= 400:
            print(f"Skipping {chrome_page_unlogged.url} — status {resp.status}")
            continue

        print(chrome_page_unlogged.url)

        # THEN: Every img element loads successfully
        images = chrome_page_unlogged.locator("img")
        count = await images.count()
        broken = []

        for i in range(count):

            img = images.nth(i)
            src = await img.get_attribute("src") or ""

            if not src or src.startswith("data:"):
                continue

            natural_width = await img.evaluate("el => el.naturalWidth")
            is_complete = await img.evaluate("el => el.complete")

            if is_complete and natural_width == 0:
                broken.append(src)

        if broken:
            all_broken[chrome_page_unlogged.url] = broken

    assert all_broken == {}, f"Broken images found:\n" + "\n".join(
        f"  {url}: {srcs}" for url, srcs in all_broken.items()
    )
