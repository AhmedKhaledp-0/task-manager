import { useQuery } from "@tanstack/react-query";
export const Auth = "auth";

const useAuth = (options = {}) => {
  useQuery({
    queryKey: [Auth],
    queryFn: getUser);
};
export default useAuth;
