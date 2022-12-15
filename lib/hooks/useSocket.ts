// hooks/useSocket.js
import { useEffect, useRef } from "react";

const useSocket = () => {
  const socketCreated = useRef(false)
  useEffect(() =>{
    if (!socketCreated.current) {
      const socketInitializer = async () => {
        await fetch ('/api/stack')
      }
      try {
        socketInitializer()
        socketCreated.current = true
      } catch (error) {
        console.log(error)
      }
    }
  }, []);
};

export default useSocket