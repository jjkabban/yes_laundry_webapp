type FrontEndErrorType = {
  pathName: string;
  page: string;
  message: string;
  type: string;
};

type FrontEndErrorsContextType = {
  setClientError: (data: FrontEndErrorType) => void;
};
