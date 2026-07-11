// tests for the SearchBar component using React Testing Library
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
    test('disables the search button when the input is empty', () => {
        render(<SearchBar onSearch={jest.fn()} />);

        expect(screen.getByRole('button', { name: 'SEARCH' })).toBeDisabled();
    });

    test('enables the search button once a term is typed', () => {
        render(<SearchBar onSearch={jest.fn()} />);

        fireEvent.change(screen.getByPlaceholderText('Enter Artist, Song, or Album'), {
            target: { value: 'Hey Jude' },
        });

        expect(screen.getByRole('button', { name: 'SEARCH' })).toBeEnabled();
    });

    test('calls onSearch with the typed term when the button is clicked', async () => {
        const onSearch = jest.fn().mockResolvedValue();
        render(<SearchBar onSearch={onSearch} />);

        fireEvent.change(screen.getByPlaceholderText('Enter Artist, Song, or Album'), {
            target: { value: 'Hey Jude' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'SEARCH' }));

        expect(onSearch).toHaveBeenCalledWith('Hey Jude');
        // after the search resolves, the button should return to its idle state
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'SEARCH' })).toBeEnabled();
        });
    });

    test('triggers a search when the Enter key is pressed', async () => {
        const onSearch = jest.fn().mockResolvedValue();
        render(<SearchBar onSearch={onSearch} />);

        const input = screen.getByPlaceholderText('Enter Artist, Song, or Album');
        fireEvent.change(input, { target: { value: 'Yesterday' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

        expect(onSearch).toHaveBeenCalledWith('Yesterday');
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'SEARCH' })).toBeEnabled();
        });
    });

    test('does not call onSearch when the term is only whitespace', () => {
        const onSearch = jest.fn();
        render(<SearchBar onSearch={onSearch} />);

        const input = screen.getByPlaceholderText('Enter Artist, Song, or Album');
        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

        expect(onSearch).not.toHaveBeenCalled();
    });
});
