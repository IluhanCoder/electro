import React, { useEffect } from 'react';
import { BrowserRouter, Routes, useLocation } from 'react-router-dom';
import routes from './routes';
import { toast, ToastContainer } from 'react-toastify';
import Header from './header';
import { observer } from 'mobx-react';
import authService from './auth/auth-service';
import authStore from './auth/auth-store';
import serviceErrorHandler from './service-error-handler';
function App() {
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if(token) {
      try {
        const {user} = await authService.verify();
        authStore.setUser(user);
      } catch (error: any) {
        if(error.status === 400) {
          toast.error(error.response.data.message);
          if(error.response.data.message.includes("Помилка авторизації")) {
            authService.logout();
          }
        }
        serviceErrorHandler(error);
      }
    }
  }

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <BrowserRouter>
      <div className='flex flex-col h-full w-full'>
        <Header/>
        <ToastContainer/>
        <div className='grow'>
          <Routes>
            {routes.map((route: React.ReactElement) => route)}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default observer(App);
