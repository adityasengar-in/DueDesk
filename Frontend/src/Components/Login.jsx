import { GoogleLogin } from "@react-oauth/google";

function Login() {
    const handleSuccess = async (credentialResponse) => {
        alert("Google OK, contacting server...");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });
            if (!res.ok) {
                alert("Server replied " + res.status);
                return;
            }
            const data = await res.json();
            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";
        } catch (err) {
            alert("Request failed: " + err.message);
        }
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={() => alert("Google login failed")} />;
}

export default Login;