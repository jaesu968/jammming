// tests for the Track component using React Testing Library
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Track from './Track';

// a sample track to render in each test
const sampleTrack = {
    id: '1',
    name: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    uri: 'spotify:track:1',
};

describe('Track', () => {
    test('renders the track name, artist, and album', () => {
        render(<Track track={sampleTrack} onAdd={jest.fn()} onRemove={jest.fn()} />);

        expect(screen.getByRole('heading', { name: 'Bohemian Rhapsody' })).toBeInTheDocument();
        expect(screen.getByText('Queen | A Night at the Opera')).toBeInTheDocument();
    });

    test('shows a "+" button and calls onAdd with the track when clicked', () => {
        const onAdd = jest.fn();
        render(<Track track={sampleTrack} onAdd={onAdd} onRemove={jest.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: '+' }));

        expect(onAdd).toHaveBeenCalledTimes(1);
        expect(onAdd).toHaveBeenCalledWith(sampleTrack);
    });

    test('shows a "-" button and calls onRemove when isRemoval is true', () => {
        const onRemove = jest.fn();
        render(<Track track={sampleTrack} onAdd={jest.fn()} onRemove={onRemove} isRemoval={true} />);

        fireEvent.click(screen.getByRole('button', { name: '-' }));

        expect(onRemove).toHaveBeenCalledTimes(1);
        expect(onRemove).toHaveBeenCalledWith(sampleTrack);
    });

    test('hides the action button when showAction is false', () => {
        render(<Track track={sampleTrack} onAdd={jest.fn()} onRemove={jest.fn()} showAction={false} />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
