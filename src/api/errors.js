export const getApiErrorStatus = (error) =>
  error?.response?.status ?? error?.status ?? null;

export const getApiValidationErrors = (error) => {
  const errors = error?.response?.data?.errors ?? error?.validationErrors ?? {};
  return errors && typeof errors === "object" ? errors : {};
};

export const getApiErrorMessage = (
  error,
  fallback = "Une erreur est survenue. Veuillez reessayer.",
) => {
  const data = error?.response?.data ?? error?.data ?? {};
  const validationErrors = data.errors ?? error?.validationErrors;

  if (validationErrors && typeof validationErrors === "object") {
    const firstError = Object.values(validationErrors)
      .flat()
      .find(Boolean);

    if (firstError) return String(firstError);
  }

  return (
    data.message ||
    error?.apiMessage ||
    error?.message ||
    fallback
  );
};
