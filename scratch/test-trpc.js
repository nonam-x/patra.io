async function run() {
  const url = "http://localhost:8000/trpc/auth.createUserWithEmailAndPassword";
  console.log("Querying", url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test-" + Date.now() + "@patra.io",
        password: "password123"
      })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
