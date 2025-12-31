const GoogleButton = () => {
  const handleGoogleLogin = () => {
    window.location.href =
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="
        w-full flex items-center justify-center gap-3
        bg-white border rounded-lg py-2.5
        hover:bg-gray-100 transition
      "
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
};

export default GoogleButton;
