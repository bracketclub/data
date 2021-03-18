#!/usr/bin/env node

"use strict";

const charset =
  "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*(){}[]=<>/,.";
const length = 32;

const generatePassword = () => {
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

process.stdout.write(generatePassword());
