import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import {useNavigate} from 'react-router-dom';
import './banner.scss';

const subjectLabel = 'Find your subject';

export default function Banner({data}) {
    const bannerImgUrl = useOptimizedImage(data.bannerRightImage.meta.downloadUrl, 800);
    const subjects = React.useMemo(
        () => Reflect.ownKeys(data.k12library).map(
            (k) => ({
                html: k,
                value: data.k12library[k].link.replace(/^\/*/, '/') // ensure one leading slash
            })
        ),
        [data]
    );
    const navigate = useNavigate();
    const navigateToSelection = React.useCallback(
        ({target}) => navigate(target.value),
        [navigate]
    );

    return (
        <section className="banner">
            <div className="boxed">
                <div className="text-block">
                    <h1>{data.bannerHeadline}</h1>
                    <div>{data.bannerDescription}</div>
                    <div className="buttons">
                        <select className="classic" onChange={navigateToSelection}>
                            <option>{subjectLabel}</option>
                            {
                                subjects.map((s) =>
                                    <RawHTML Tag="option" key={s.value} value={s.value} html={s.html} />)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div
                className="right-bg clipped-image"
                style={`background-image: url(${bannerImgUrl});`}
            >
            </div>
        </section>
    );
}
