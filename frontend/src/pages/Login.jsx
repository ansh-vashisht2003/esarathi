import { api } from "../services/api";

const Login = () => {
  const handleLogin = async () => {
    await api.post("/auth/google-login", {
      name: "Ansh",
      email: "anshvashisht.2003@gmail.com",
      googleId: "google-id-demo"
    });
    alert("OTP Sent");
  };

  return <button onClick={handleLogin}>Login with Google</button>;
};

export default Login;
