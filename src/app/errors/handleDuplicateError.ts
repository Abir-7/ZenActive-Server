const handleDuplicateError = (err: any) => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errors = [
    {
      path: "",
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: `Invalid: ${extractedMessage} is already exists`,
    errors,
  };
};

export default handleDuplicateError;
