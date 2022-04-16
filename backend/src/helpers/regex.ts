/**
 * Check alphabetics characters from A to Z in Uppercase
 */ 
export const REGEX_LETTERS_UPPER_CASE = /^[A-Z]+$/

/** 
 * Check alphabetics characters and spaces "A-Z ' '"
 */
export const REGEX_LETTERS_AND_SPACE_UPPER_CASE = /^[A-Z ]+$/

/** 
 * Check alphanumerics characters A - Z, 0 - 9 and -
 */ 
export const REGEX_LETTERS_NUMBERS_AND_DASH_IGNORE_CASE = /^[a-z0-9\-]+$/i

export const REGEX_EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i