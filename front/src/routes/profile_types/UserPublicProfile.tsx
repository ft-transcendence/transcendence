import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  let params = useParams();

  useEffect(() => {
    const isUser = async () => {
      const result = await getUser
    };

    fetchData();
  }, []);

  return <h2>Profile {params.userName}</h2>;
}
