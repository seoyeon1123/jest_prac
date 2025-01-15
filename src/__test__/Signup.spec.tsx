//비밀번호와 비밀번호 확인의 값이 다른 경우, 에러메시지가 나타나는지
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import SignupPage from '../pages/SignupPage';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe('회원가입 테스트', () => {
  beforeEach(() => {
    const routes = [
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/signup'],
      initialIndex: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });
  test('비밀번호와 비밀번호 확인 값이 일치하지 않으면 에러메시지가 표시된다.', async () => {
    //given - 회원가입 페이지가 그려짐

    //현재 SignupPage에서 react-route-domd이랑 react-query를 쓰고 있는데, 실제 페이지 라우팅을 설정하는 것처럼 provider들로 다 감싸줘야 한다.
    //when - 비밀번호와 비밀번호 확인값이 일치하지 않음
    //이벤트를 발생시켜서 비밀번호 인풋고 비밀번호 확인 인풋에 값을 넣어줄 수 있음

    const passwordInput = screen.getByLabelText('비밀번호');
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');

    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'wrongPassword' },
    });

    //then - 에러메시지가 표시됨

    const errorMessage = await screen.findByTestId('error-message');
    expect(errorMessage);
  });

  test('이메일을 입력하고, 비밀번호와 비밀번호 확인값이 일치하면 회원가입 버튼이 활성화 된다!', () => {
    //given -> 회원가입 페이지가 그려짐
    const signupButton = screen.getByRole('button', { name: '회원가입' });
    expect(signupButton).toBeDisabled();

    //when -> 이메일 입력, 비밀번호, 비밀번호 확인 일치
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');

    fireEvent.change(passwordInput, { target: { value: '비밀번호' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '비밀번호' } });
    fireEvent.change(emailInput, { target: { value: 'lsy_0906@naver.com' } });

    //then -> 회원가입 버튼 활성화

    expect(signupButton).toBeEnabled();
  });
});
