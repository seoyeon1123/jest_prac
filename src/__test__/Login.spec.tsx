import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import * as nock from 'nock';
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe('로그인테스트', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('로그인에 실패하면 에러메세지가 나타난다', async () => {
    const routes = [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/login'],
      initialIndex: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    nock('https://inflearn.byeongjinkang.com')
      .post('/user/login', {
        username: 'wrong@email.com',
        password: 'wrongPassword',
      })
      .reply(400, { msg: 'NO_SUCH_USER' });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');

    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });

    const loginButton = screen.getByRole('button', { name: '로그인' });
    fireEvent.click(loginButton);

    const { result } = renderHook(() => useLogin(), { wrapper });

    await waitFor(() => result.current.isError);
  });
});
