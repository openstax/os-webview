import WrappedJsx from '~/controllers/jsx-wrapper';
import FeaturedResource from './featured-resources.jsx';

export default function (props, el) {
    return new WrappedJsx(
        FeaturedResource,
        props,
        el
    );
}
