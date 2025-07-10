import React from 'react';
import type {K12Data} from './k12-main';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import {useNavigate} from 'react-router-dom';
import './banner.scss';

const subjectLabel = 'Find your subject';

export default function Banner({data}: {data: K12Data}) {
    const bannerImgUrl = useOptimizedImage(
        data.bannerRightImage.meta.downloadUrl,
        800
    );
    const subjects = React.useMemo(
        () =>
            Object.entries(data.k12library).map(([key, value]) => ({
                html: key,
                value: value.link.replace(/^\/*/, '/') // ensure one leading slash
            })),
        [data]
    );
    const navigate = useNavigate();
    const navigateToSelection = React.useCallback<
        React.ChangeEventHandler<HTMLSelectElement>
    >(({currentTarget}) => navigate(currentTarget.value), [navigate]);

    return (
        <section className="banner">
            <div className="boxed">
                <div className="text-block">
                    <h1>{data.bannerHeadline}</h1>
                    <div>{data.bannerDescription}</div>
                    <div className="buttons">
                        <select
                            className="classic"
                            onChange={navigateToSelection}
                        >
                            <option>{subjectLabel}</option>
                            {subjects.map((s) => (
                                <RawHTML
                                    Tag="option"
                                    key={s.value}
                                    // @ts-expect-error value goes with option tag
                                    value={s.value}
                                    html={s.html}
                                />
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div
                className="right-bg clipped-image"
                style={{backgroundImage: `url(${bannerImgUrl});`}}
            ></div>
        </section>
    );
}
