"use client";

import "react-toastify/dist/ReactToastify.css";

import { Bounce, ToastContainer } from "react-toastify";

const ToastProvider = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3200}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
      transition={Bounce}
    />
  );
};

export default ToastProvider;
