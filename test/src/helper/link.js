import test from 'ava';
import linkHelper from '~/helpers/link';

test('External Link Detection', async function (assert) {
    const externalLink = 'https://openstax.org';
    const internalLink = '/issues';

    var actual = linkHelper.isExternal(externalLink);
    var expected = true;

    assert.is(actual, expected,
        `isExternal() should return true for ${externalLink}.`);

    actual = linkHelper.isExternal(internalLink);
    expected = false;

    assert.is(actual, expected,
        `isExternal() should return false for ${internalLink}.`);
});

test('PDF Link Detection', async function (assert) {
    const internalPDFLink = 'physics.pdf';
    const externalPDFLink = 'https://openstax.org/physics.pdf';

    var actual = linkHelper.isPDF(internalPDFLink);
    var expected = true;

    assert.is(actual, expected,
        `isPDF() should return true for ${internalPDFLink}.`);

    actual = linkHelper.isPDF(externalPDFLink);
    expected = true;

    assert.is(actual, expected,
        `isPDF() should return true for ${externalPDFLink}.`);
});

test('Internal Link Click Detection', async function (assert) {
    var e = {
        target: {
            getAttribute() {
                return href;
            }
        }
    };

    var href = 'mailto:info@openstax.org';
    var actual = linkHelper.validUrlClick(e);
    var expected = false;

    assert.is(actual, expected,
        'validUrlClick() should return false for `mailto` links.');

    href = null;
    actual = linkHelper.validUrlClick(e);
    expected = false;

    assert.is(actual, expected,
        'validUrlClick() should return false if a target\'s href property is not a string.');

    href = '/issues';
    actual = linkHelper.validUrlClick(e);
    expected = e.target;

    assert.is(actual, expected,
        'validUrlClick() should return the event target for links with relative URLs.');

    href = 'https://openstax.org';
    actual = linkHelper.validUrlClick(e);
    expected = e.target;

    assert.is(actual, expected,
        'validUrlClick() should return the event target for links with absolute URLs.');
});
