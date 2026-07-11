// tests for the Playlist component using React Testing Library
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Playlist from './Playlist';

const sampleTracks = [
    { id: '1', name: 'Song One', artist: 'Artist A', album: 'Album A', uri: 'spotify:track:1' },
    { id: '2', name: 'Song Two', artist: 'Artist B', album: 'Album B', uri: 'spotify:track:2' },
];

describe('Playlist', () => {
    test('renders the default playlist name and the playlist tracks', () => {
        render(
            <Playlist
                playlistTracks={sampleTracks}
                onNameChange={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
            />
        );

        expect(screen.getByDisplayValue('New Playlist')).toBeInTheDocument();
        expect(screen.getByText('Song One')).toBeInTheDocument();
        expect(screen.getByText('Song Two')).toBeInTheDocument();
    });

    test('calls onNameChange when the playlist is renamed', () => {
        const onNameChange = jest.fn();
        render(
            <Playlist
                playlistTracks={[]}
                onNameChange={onNameChange}
                onRemove={jest.fn()}
                onSave={jest.fn()}
            />
        );

        fireEvent.change(screen.getByDisplayValue('New Playlist'), {
            target: { value: 'My Jams' },
        });

        expect(onNameChange).toHaveBeenCalledWith('My Jams');
    });

    test('calls onSave when the save button is clicked', () => {
        const onSave = jest.fn();
        render(
            <Playlist
                playlistTracks={sampleTracks}
                onNameChange={jest.fn()}
                onRemove={jest.fn()}
                onSave={onSave}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'SAVE TO Spotify' }));

        expect(onSave).toHaveBeenCalledTimes(1);
    });

    test('renders playlist tracks with remove ("-") buttons', () => {
        render(
            <Playlist
                playlistTracks={sampleTracks}
                onNameChange={jest.fn()}
                onRemove={jest.fn()}
                onSave={jest.fn()}
            />
        );

        expect(screen.getAllByRole('button', { name: '-' })).toHaveLength(2);
    });
});
