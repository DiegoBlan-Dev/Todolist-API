import type { ZodError } from "zod";

export function formatZodError(error: ZodError) {
  const formatedErrors = error.issues.map((error) => {
    return {
      message: error.message,
      path: error.path.join("-"),
    };
  });

  return formatedErrors;
}
