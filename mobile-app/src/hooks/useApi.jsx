import React from 'react';
import { useAppContext } from './useAppContext';

export const useApi = () => {
  const { ip, port } = useAppContext();

  const request =  (method, url, config) => {
    try {
      return fetch(`http://${ip}:${port}/${url}`, {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        ...config
      });
    } catch (e) {
      if (!e.response) {
        throw {
          data: null,
          error: {
            status: 500,
            name: 'UnknowError',
            message: e.message,
            details: e,
          },
        };
      } else {
        throw e.response.data;
      }
    }
  }

  return {
    request,
  }
};