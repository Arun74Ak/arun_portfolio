// Central place for all API calls — change BASE_URL for production
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

/**
 * Submit the contact form.
 * @param {{ name: string, email: string, message: string }} data
 * @returns {Promise<{ success: boolean, message: string, id?: number }>}
 */
export async function submitContact(data) {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    // FastAPI validation errors come as { detail: [...] }
    const detail = json?.detail;
    if (Array.isArray(detail)) {
      const msgs = detail.map((e) => e.msg).join(", ");
      throw new Error(msgs);
    }
    throw new Error(json?.message || "Something went wrong. Please try again.");
  }

  return json;
}
