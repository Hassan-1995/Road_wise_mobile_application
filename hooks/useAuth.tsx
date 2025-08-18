// hooks/useAuth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
      setLoading(false);
    };
    checkAuth();
  }, []);

  return { loading, userToken, setUserToken };
};

export default useAuth;
