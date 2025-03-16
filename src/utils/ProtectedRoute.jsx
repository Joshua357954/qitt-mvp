import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedAuth({ children }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => { 
    if (!user?.enrolled) {
      navigate('/auth');
    }
  }, [user?.enrolled, navigate]); 
 
  return user?.enrolled ? <>{children}</> : null;
}
