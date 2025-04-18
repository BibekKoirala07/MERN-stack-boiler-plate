// store/features/auth/authApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type {
//   LoginRequest,
//   LoginResponse,
//   RegisterRequest,
//   RegisterResponse,
//   User,
//   DefaultResponse,
//   ResetPasswordRequest,
//   ForgotPasswordRequest,
// } from "./authTypes";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.query<any, { email: string; token: string }>({
      query: ({ email, token }) =>
        `/auth/verify-email?email=${email}&token=${token}`,
    }),
    resendVerificationEmail: builder.query<
      any,
      { email: string; token: string }
    >({
      query: ({ email, token }) =>
        `/auth/verify-email/resend/${email}/${token}`,
    }),
    forgotPasswordRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/forgot-password/request-email",
        method: "POST",
        body,
      }),
    }),
    resendForgotPasswordRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/forgot-password/resend-request-email",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<any, void>({
      query: () => "/user/profile",
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailQuery,
  useResendVerificationEmailQuery,
  useForgotPasswordRequestMutation,
  useResendForgotPasswordRequestMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
} = authApi;
