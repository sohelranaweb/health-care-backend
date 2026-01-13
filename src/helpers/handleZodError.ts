import { ZodError } from "zod";

export const handleZodError = (err: ZodError<unknown>) => {
  const errorSources = err.issues.map((issue) => {
    const field = String(issue.path[issue.path.length - 1] || "unknown");
    const message =
      issue.code === "invalid_type"
        ? `${field[0].toUpperCase() + field.slice(1)} is required`
        : issue.message;
    return { field, message };
  });

  return {
    statusCode: 400,
    message: errorSources.map((e) => e.message).join(", "),
    errorSources,
  };
};
