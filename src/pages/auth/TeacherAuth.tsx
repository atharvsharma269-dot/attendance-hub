const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("HANDLE SUBMIT TRIGGERED");
  setIsLoading(true);

  try {
    const res = await login(registrationNumber, password);
    console.log("API RESPONSE:", res);

    localStorage.setItem("token", res.token);
    navigate("/teacher");
  } catch (error) {
    console.error("Teacher login failed:", error);
  } finally {
    setIsLoading(false);
  }
};
