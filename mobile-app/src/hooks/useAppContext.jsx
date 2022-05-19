import React, { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext({
  ip: '',
  setIp: () => {},
  port: '',
  setPort: () => {},
});

const useAppContext = () => useContext(AppContext);

export {
  AppContext,
  useAppContext,
};