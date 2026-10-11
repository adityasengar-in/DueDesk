import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

let cached = null;
function Dashboard() {
    
  const [data, setData] = useState(cached);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((d) => {
        cached = d;
        setData(d);
      });
  }, []);

  const [name, setName] = useState("");
  // 

  if (!data) return <p className="p-6">Loading...</p>;

  const saveBusinessName = async () => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ businessName: name }),
  });
  setData({ ...data, businessName: name });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Link to="/new-plan" className="bg-black text-white rounded px-3 py-2">
          + New Plan
        </Link>
      </div>
      {!data.businessName && (
    <div className="border rounded p-3 mb-6 flex gap-2">
        <input
        className="border rounded px-3 py-2 flex-1"
        placeholder="Your business name (shown in reminders)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
        <button
        className="bg-black text-white rounded px-3 py-2"
        onClick={() => name && saveBusinessName()}
        >
        Save
        </button>
    </div>
    )}
    {data.businessName && <p className="text-gray-500 mb-4">{data.businessName}</p>}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="border rounded p-3 text-center">
          <p className="text-sm text-gray-500">Collected</p>
          <p className="text-lg font-semibold">₹{data.collected}</p>
        </div>
        <div className="border rounded p-3 text-center">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-lg font-semibold">₹{data.pending}</p>
        </div>
        <div className="border rounded p-3 text-center">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-lg font-semibold text-red-600">{data.overdueCount}</p>
        </div>
      </div>

      <h2 className="font-medium mb-2">Members</h2>
      <div className="flex flex-col gap-2">
        {data.rows.map((row) => (
          <Link
            key={row.planId}
            to={`/plans/${row.planId}`}
            className="border rounded p-3 flex justify-between"
          >
            <div>
              <p className="font-medium">{row.memberName}</p>
              <p className="text-sm text-gray-500">
                ₹{row.amount} / {row.frequency}
                {row.status === "cancelled" && " · cancelled"}
              </p>
            </div>
            {row.nextInstallment && (
              <p className={row.nextInstallment.overdue ? "text-red-600" : "text-gray-600"}>
                {row.nextInstallment.overdue ? "Overdue · " : "Due "}
                {new Date(row.nextInstallment.dueDate).toDateString()}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;