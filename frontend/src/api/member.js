export async function postStep(step, data) {
  const url = `http://localhost:5000/register/step${step}`;

  console.log(`postStep: Mengirim data ke ${url}`, data);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  console.log(`postStep: Response dari ${url}`, result);

  if (!res.ok) {
    console.error(`postStep: Error dari ${url}`, result);
    throw new Error(result.error || result.message || "Error");
  }

  return result;
}
