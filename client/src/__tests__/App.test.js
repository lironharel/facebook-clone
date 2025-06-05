import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));
const axios = require('axios');
import Feed from '../components/Feed';
import App from '../App';


afterEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
});

test('renders signup and login when no token', () => {
  render(<App />);
  expect(screen.getByText('Facebook Clone')).toBeInTheDocument();
  expect(screen.getAllByText('Signup').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
});

test('feed fetches and displays posts', async () => {
  const posts = [{ _id: '1', author: { username: 'bob' }, content: 'hi' }];
  axios.get.mockResolvedValue({ data: posts });
  render(<Feed token="abc" />);
  await waitFor(() => expect(screen.getByText('bob: hi')).toBeInTheDocument());
});
