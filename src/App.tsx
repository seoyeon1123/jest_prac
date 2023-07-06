import normalize from "emotion-normalize";
import { css, Global } from "@emotion/react";
import { PageLayout } from "pages/PageLayout";
import { router } from "pages/Routes";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <Global
        styles={css`
          ${normalize}
          h1, h6, input {
            margin: 0;
          }

          button,
          input {
            background: none;
            border: none;
            outline: none;
          }
        `}
      />
      <PageLayout>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <RouterProvider router={router} />
          </RecoilRoot>
        </QueryClientProvider>
      </PageLayout>
    </>
  );
}
