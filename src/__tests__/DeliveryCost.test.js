import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeliveryCost from '../DeliveryCost/DeliveryCost';
import { act } from 'react';
import { deliveryCostPackage, deliveryTimePackages } from "../DeliveryCost/mockData";

describe('DeliveryCost Component', () => {
    const setup = (tab) => {
        act(() => {
            render(<DeliveryCost tab={tab} />);
        });
    };

    test('renders correctly with initial state for cost tab', () => {
        setup('cost');
        expect(screen.getByPlaceholderText('Base Delivery Cost')).toHaveValue(100);
        expect(screen.getByPlaceholderText('No of Packages')).toHaveValue(3);
        expect(screen.getByText('Calculate Cost')).toBeInTheDocument();
    });

    test('renders correctly with initial state for time tab', () => {
        setup('time');
        expect(screen.getByPlaceholderText('Base Delivery Cost')).toHaveValue(100);
        expect(screen.getByPlaceholderText('No of Packages')).toHaveValue(5);
        expect(screen.getByText('Calculate Time')).toBeInTheDocument();
    });

    test('handles input changes and calculates cost', () => {
        setup('cost');

        const weightInput = screen.getAllByPlaceholderText('Weight')[0];
        const distanceInput = screen.getAllByPlaceholderText('Distance')[0];

        fireEvent.change(weightInput, { target: { value: '100' } });
        fireEvent.change(distanceInput, { target: { value: '100' } });

        expect(weightInput.value).toBe('100');
        expect(distanceInput.value).toBe('100');

        fireEvent.click(screen.getByText('Calculate Cost'));

    });

    test('handles input changes and calculates time', () => {
        setup('time');

        const weightInput = screen.getAllByPlaceholderText('Weight')[0];
        const distanceInput = screen.getAllByPlaceholderText('Distance')[0];

        fireEvent.change(weightInput, { target: { value: '100' } });
        fireEvent.change(distanceInput, { target: { value: '100' } });

        expect(weightInput.value).toBe('100');
        expect(distanceInput.value).toBe('100');

        fireEvent.click(screen.getByText('Calculate Time'));

    });
});
