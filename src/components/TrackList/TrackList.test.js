// tests for the TrackList component using React Testing Library
import React from 'react';
import { render, screen } from '@testing-library/react';
import TrackList from './TrackList';

const sampleTracks = [
    { id: '1', name: 'Song One', artist: 'Artist A', album: 'Album A', uri: 'spotify:track:1' },
    { id: '2', name: 'Song Two', artist: 'Artist B', album: 'Album B', uri: 'spotify:track:2' },
    { id: '3', name: 'Song Three', artist: 'Artist C', album: 'Album C', uri: 'spotify:track:3' },
];

describe('TrackList', () => {
    test('renders one Track for each track passed in', () => {
        render(<TrackList tracks={sampleTracks} onAdd={jest.fn()} />);

        expect(screen.getAllByRole('heading')).toHaveLength(3);
        expect(screen.getByText('Song One')).toBeInTheDocument();
        expect(screen.getByText('Song Two')).toBeInTheDocument();
        expect(screen.getByText('Song Three')).toBeInTheDocument();
    });

    test('renders nothing when the track list is empty', () => {
        render(<TrackList tracks={[]} onAdd={jest.fn()} />);

        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
});
