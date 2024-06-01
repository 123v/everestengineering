import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react'; // Import act from react
import App from './App';
import '@testing-library/jest-dom/extend-expect'; // for extended matchers like toBeInTheDocument
import DeliveryCost from './DeliveryCost/DeliveryCost';

// Mock the DeliveryCost component to avoid rendering its full implementation
jest.mock('./DeliveryCost/DeliveryCost', () => {
	return jest.fn(() => <div>Mocked DeliveryCost Component</div>);
});

describe('App Component', () => {
	const setup = async (tab) => {
		await act(async () => {
			render(<App />);
		});

		if (tab) {
			await act(async () => {
				fireEvent.click(screen.getByText(tab));
			});
		}
	};

	test('renders the logo and title', async () => {
		await setup();
		expect(screen.getByAltText('')).toBeInTheDocument();
		expect(screen.getByText('Delivery Estimation App')).toBeInTheDocument();
	});

	test('renders the radio buttons for selecting tabs', async () => {
		await setup();
		expect(screen.getByText('Delivery Cost Estimation')).toBeInTheDocument();
		expect(screen.getByText('Delivery Time Estimation')).toBeInTheDocument();
	});

	test('initially renders the DeliveryCost component with the "cost" tab', async () => {
		await setup();
		expect(DeliveryCost).toHaveBeenCalledWith({ tab: 'cost' }, {});
	});

	test('switches to the "time" tab and renders the DeliveryCost component', async () => {
		await setup('Delivery Time Estimation');
		expect(DeliveryCost).toHaveBeenCalledWith({ tab: 'time' }, {});
	});
});
