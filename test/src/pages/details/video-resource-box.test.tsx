import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import VideoResourceBoxes from '~/pages/details/common/resource-box/video-resource-box';
import {ResourceModel} from '~/pages/details/common/resource-box/resource-boxes';

describe('VideoResourceBox', () => {
    type ModelsType = Parameters<typeof VideoResourceBoxes>[0]['models'];

    it('renders non-video resource boxes', () => {
        const bm = [{heading: 'box-model-heading'}] as ResourceModel[];

        render(
            <VideoResourceBoxes
                models={[]}
                blogLinkModels={bm}
                referenceModels={bm}
            />
        );
        const videoTags = document.querySelectorAll('video');

        expect(videoTags.length).toBe(0);
        expect(screen.getAllByRole('heading')).toHaveLength(2);
    });
    it('renders videos and dialog', async () => {
        const models: ModelsType = [
            {
                heading: 'vm-heading',
                resourceHeading: 'res-head',
                resourceDescription: '<b>res-desc</b>',
                videoFile: 'video-file',
                videoTitle: 'video-title',
                resourceCategory: 'category'
            }
        ];
        const user = userEvent.setup();

        render(
            <VideoResourceBoxes
                models={models}
                blogLinkModels={[]}
                referenceModels={[]}
            />
        );
        const videoTags = document.querySelectorAll('video');

        expect(videoTags.length).toBe(1);
        await user.click(videoTags[0]);
        expect(
            document.querySelector('.aspect-16-by-9-container')
        ).toBeTruthy();
        screen.getByText('res-head');
    });
    it('renders dialog with resourceHeading as title when videoTitle is empty', async () => {
        const models: ModelsType = [
            {
                heading: 'vm-heading',
                resourceHeading: 'res-head',
                resourceDescription: '<b>res-desc</b>',
                videoFile: 'video-file',
                videoTitle: '',
                resourceCategory: 'category'
            }
        ];
        const user = userEvent.setup();

        render(
            <VideoResourceBoxes
                models={models}
                blogLinkModels={[]}
                referenceModels={[]}
            />
        );
        const videoTags = document.querySelectorAll('video');

        expect(videoTags.length).toBe(1);
        await user.click(videoTags[0]);
        expect(
            document.querySelector('.aspect-16-by-9-container')
        ).toBeTruthy();
        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(screen.getAllByText('res-head')).toHaveLength(2);
    });
});
