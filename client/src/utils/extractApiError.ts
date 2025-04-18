export const extractApiError = (
  err: any
): {
  message: string;
  statusCode?: number;
  error?: string;
} => {
  return (
    err?.data ?? {
      message: "An unknown error occurred.",
      statusCode: 500,
      error: "UnknownError",
    }
  );
};
