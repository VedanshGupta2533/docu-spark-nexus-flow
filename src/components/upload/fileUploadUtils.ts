
export const acceptedFileTypes = {
  image: ".jpg,.jpeg,.png,.gif,.bmp,.tiff,.tif",
  document: ".pdf,.doc,.docx,.txt,.rtf",
  spreadsheet: ".xlsx,.xls,.csv"
};

export const getAllAcceptedTypes = (): string => {
  return Object.values(acceptedFileTypes).join(",");
};
