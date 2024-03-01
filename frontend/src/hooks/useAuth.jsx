import React, { useEffect, useState } from 'react'
import { Global } from '../helpers/Global';

const useAuth = () => {
  const [auth, setAuth] = useState({});
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    userAuth();
  }, [])

  const userAuth = async() => {

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if(!token && !user) {
      setIsLoading(false);
      return false;
    }

    const userObj = JSON.parse(user);
    const userId = userObj.id;
    const request = await fetch(Global.url + "profile/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const datos =  await request.json();

    setAuth(datos.user);
    setIsLoading(true);
  }

  return {auth, setAuth, isLoading}
}

export default useAuth