import { GoogleLogin } from "@react-oauth/google";

function Login() {
    const handleSuccess = async (credentialResponse) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: credentialResponse.credential }),
        });
        const data = await res.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard"; // placeholder route for now
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login failed")} />;
}

export default Login;