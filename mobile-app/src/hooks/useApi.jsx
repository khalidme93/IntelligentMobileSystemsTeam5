import React from 'react';
import { useAppContext } from './useAppContext';

export const useApi = () => {
  const { ip, port } = useAppContext();

  //Function used for sending API requests.
  const request = async (method, url, config) => {
    try {
      return await fetch(`http://${ip}:${port}/${url}`, {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        ...config
      }).then(res => res.json());
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