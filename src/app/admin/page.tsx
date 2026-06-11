"use client";
import { useState } from "react";
import Link from "next/link";
import { careers, careerCategories } from "@/data/careers";
import { typeBadgeClass, typeLabel } from "@/lib/utils";
import { Lock, Search, ExternalLink } from "lucide-react";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "careergps-admin-2026";

export default function AdminPage() {
  const [entered, setEntered] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const handleAuth = () => {
    if (entered === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setError("Incorrect password");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm w-full shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-slate-600" />
            <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
          </div>
          <input
            type="password"
            placeholder="Enter admin password"
            value={entered}
            onChange={(e) => setEntered(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            onClick={handleAuth}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Access Admin
          </button>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Default: <code>careergps-admin-2026</code> (set NEXT_PUBLIC_ADMIN_PASSWORD to change)
          </p>
        </div>
      </div>
    );
  }

  const filtered = careers.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.type === filter || c.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">{careers.length} careers in database</p>
          </div>
          <div className="flex gap-3 text-sm">
            {["Technology", "Finance", "Design", "Marketing", "Healthcare", "Education", "Social Impact", "Operations"].map((cat) => (
              <span key={cat} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600">
                {cat}: {careers.filter((c) => c.category === cat).length}
              </span>
            )).slice(0, 4)}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Careers", value: careers.length, color: "blue" },
            { label: "Emerging", value: careers.filter((c) => c.type === "emerging").length, color: "emerald" },
            { label: "Niche", value: careers.filter((c) => c.type === "niche").length, color: "orange" },
            { label: "Unconventional", value: careers.filter((c) => c.type === "unconventional").length, color: "purple" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search careers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none"
          >
            <option value="all">All Types</option>
            <option value="conventional">Conventional</option>
            <option value="unconventional">Unconventional</option>
            <option value="emerging">Emerging</option>
            <option value="niche">Niche</option>
            {careerCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-sm text-slate-500">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Entry Salary</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Timeline</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Demand</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((career, i) => (
                <tr key={career.id} className={`border-b border-slate-100 hover:bg-slate-50 ${i % 2 === 0 ? "" : "bg-slate-50/40"}`}>
                  <td className="px-4 py-3 font-medium text-slate-900">{career.title}</td>
                  <td className="px-4 py-3 text-slate-500">{career.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadgeClass(career.type)}`}>
                      {typeLabel(career.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{career.salaryRangeEntry}</td>
                  <td className="px-4 py-3 text-slate-500">{career.timelineMonths}mo</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${career.demandScore * 10}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{career.demandScore}/10</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/careers/${career.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>MVP Note:</strong> This admin panel shows the career database. To add/edit careers in this MVP, edit the data files at <code>src/data/careers-part*.ts</code>. Full CRUD admin with database is planned for v2.
        </div>
      </div>
    </div>
  );
}
