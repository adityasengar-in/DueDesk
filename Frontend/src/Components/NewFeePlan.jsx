import { useState } from "react";
import { Link } from "react-router-dom";

const API = "import.meta.env.VITE_API_URL/api";

function NewFeePlan() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const memberRes = await fetch(`${API}/members`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, email }),
    });
    if (!memberRes.ok) return setError("Could not create member");
    const member = await memberRes.json();

    const planRes = await fetch(`${API}/feeplans`, {
      method: "POST",
      headers,
      body: JSON.stringify({ memberId: member._id, amount: Number(amount), frequency, startDate }),
    });
    if (!planRes.ok) return setError("Could not create fee plan");
    const plan = await planRes.json();
    setResult(plan);
  };

  return (
    <div className="max-w-md mx-auto p-6">
    <Link to="/dashboard" className="text-sm text-gray-500">← Back</Link>
      <h1 className="text-xl font-semibold mb-4">New Fee Plan</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Member name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Member email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Amount per cycle"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          className="border rounded px-3 py-2"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          className="border rounded px-3 py-2"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <button className="bg-black text-white rounded px-3 py-2" type="submit">
          Create Plan
        </button>
      </form>

      {error && <p className="text-red-600 mt-3">{error}</p>}

      {result && (
        <div className="mt-4 border rounded p-3">
          <p className="font-medium">Plan created</p>
          <p>Next due: {new Date(result.feePlan.nextDueDate).toDateString()}</p>
          <p>
            First installment: ₹{result.installment.amount} due{" "}
            {new Date(result.installment.dueDate).toDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default NewFeePlan;