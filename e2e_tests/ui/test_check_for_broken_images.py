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
        url = f"{base_url}/{osweb_page}"
        resp = await chrome_page_unlogged.goto(url, wait_until="load")

        # For cases like network error or crash
        if resp is None:
            pytest.fail(f"Navigation failed (no response) for {url}")

        if resp.status >= 400:
            print(f"Skipping {chrome_page_unlogged.url} — status {resp.status}")
            continue

        print(f"Checking {chrome_page_unlogged.url}")

        # To allow lazy images to load
        await chrome_page_unlogged.wait_for_timeout(2000)

        # THEN: Every img element loads successfully
        broken = await chrome_page_unlogged.evaluate(
            """() => {
                const pageUrl = window.location.href;
                return Array.from(document.images)
                    .map(img => ({
                        src: img.currentSrc || img.src,
                        complete: img.complete,
                        naturalWidth: img.naturalWidth,
                    }))
                    .filter(i =>
                        i.src &&
                        !i.src.startsWith('data:') &&
                        // filters out images whose src resolves to the page URL itself
                        i.src !== pageUrl &&
                        i.complete &&
                        i.naturalWidth === 0
                    )
                    .map(i => i.src);
            }"""
        )

        if broken:
            all_broken[chrome_page_unlogged.url] = broken

    assert all_broken == {}, (
        "Broken images found:\n"
        + "\n".join(f"  {url}: {srcs}" for url, srcs in all_broken.items())
    )
