import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API = "import.meta.env.VITE_API_URL/api";

const cache = {};

function PlanDetail() {
  const { id } = useParams();
  const [data, setData] = useState(cache[id] || null);
  const [newAmount, setNewAmount] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

const load = () => {
  fetch(`${API}/feeplans/${id}`, { headers })
    .then((res) => res.json())
    .then((d) => {
      cache[id] = d;
      setData(d);
    });
};

  useEffect(load, [id]);

  const markPaid = async (installmentId) => {
    await fetch(`${API}/installments/${installmentId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "paid" }),
    });
    load();
  };

  const updatePlan = async (body) => {
    await fetch(`${API}/feeplans/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    setNewAmount("");
    load();
  };

  if (!data) return <p className="p-6">Loading...</p>;

  const { feePlan, installments } = data;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/dashboard" className="text-sm text-gray-500">← Back</Link>

      <h1 className="text-xl font-semibold mt-2">{feePlan.memberId.name}</h1>
      <p className="text-gray-500 mb-4">
        ₹{feePlan.amount} / {feePlan.frequency} · {feePlan.status}
      </p>

      {feePlan.status === "active" && (
        <div className="flex gap-2 mb-6">
          <input
            className="border rounded px-3 py-2 flex-1"
            type="number"
            placeholder="New amount for future cycles"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <button
            className="bg-black text-white rounded px-3 py-2"
            onClick={() => newAmount && updatePlan({ amount: Number(newAmount) })}
          >
            Update price
          </button>
          <button
            className="border border-red-600 text-red-600 rounded px-3 py-2"
            onClick={() => updatePlan({ status: "cancelled" })}
          >
            Cancel plan
          </button>
        </div>
      )}

      <h2 className="font-medium mb-2">Installments</h2>
      <div className="flex flex-col gap-2">
        {installments.map((i) => {
          const overdue = i.status === "pending" && new Date(i.dueDate) < new Date();
          return (
            <div key={i._id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">₹{i.amount}</p>
                <p className="text-sm text-gray-500">
                  Due {new Date(i.dueDate).toDateString()}
                </p>
              </div>
              {i.status === "paid" ? (
                <p className="text-green-600">Paid {new Date(i.paidAt).toDateString()}</p>
              ) : (
                <div className="flex items-center gap-3">
                  <p className={overdue ? "text-red-600" : "text-gray-600"}>
                    {overdue ? "Overdue" : "Pending"}
                  </p>
                  <button
                    className="bg-black text-white rounded px-3 py-1"
                    onClick={() => markPaid(i._id)}
                  >
                    Mark paid
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlanDetail;