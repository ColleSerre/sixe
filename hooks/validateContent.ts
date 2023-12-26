// this function checks for innapropriate content, returns true if content is valid, false if not

import words from "profane-words";

const validateContent = (content: string) => {
  if (words.includes(content.toLowerCase())) {
    return false;
  }
  return true;
};

export default validateContent;
