 import { useState } from "react";
 import Papa from "papaparse";
import * as XLSX from "xlsx";
import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [reportType, setReportType] = useState("");

const [businessData, setBusinessData] = useState(() => {
  const savedEmail = localStorage.getItem("loggedInEmail");

  if (!savedEmail) {
    return [];
  }

  const savedData = localStorage.getItem(
    `businessData_${savedEmail}`
  );

  return savedData ? JSON.parse(savedData) : [];
});
const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".csv")) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setBusinessData(results.data);

if (loggedInEmail) {
  localStorage.setItem(
    `businessData_${loggedInEmail}`,
    JSON.stringify(results.data)
  );
}

alert("CSV data imported successfully!");

if (loggedInEmail) {
  localStorage.setItem(
    `businessData_${loggedInEmail}`,
    JSON.stringify(results.data)
  );
}

alert("CSV data imported successfully!");
      },
      error: () => {
        alert("Could not read the CSV file.");
      },
    });

    return;
  }

  if (
    fileName.endsWith(".xlsx") ||
    fileName.endsWith(".xls")
  ) {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);

        const workbook = XLSX.read(data, {
          type: "array",
        });

        const firstSheet =
          workbook.Sheets[workbook.SheetNames[0]];

        const jsonData =
          XLSX.utils.sheet_to_json(firstSheet);

        setBusinessData(jsonData);

if (loggedInEmail) {
  localStorage.setItem(
    `businessData_${loggedInEmail}`,
    JSON.stringify(jsonData)
  );
}

alert("Excel data imported successfully!");
      } catch (error) {
        alert("Could not read the Excel file.");
      }
    };

    reader.readAsArrayBuffer(file);
    return;
  }

  alert("Please upload a CSV or Excel file.");
};
const revenueData = {
  labels: businessData.map((item, index) =>
    item.Date || item.date || `Data ${index + 1}`
  ),

  datasets: [
    {
      label: "Revenue",
      data: businessData.map((item) =>
        Number(item.Revenue || item.revenue || 0)
      ),
      borderColor: "#4F46E5",
backgroundColor: "rgba(79, 70, 229, 0.15)",
      borderWidth: 3,
      tension: 0.4,
    },
  ],
};
    const salesData = {
  labels: businessData.map((item, index) =>
    item.Date || item.date || `Data ${index + 1}`
  ),

  datasets: [
    {
      label: "Sales",
      data: businessData.map((item) =>
        Number(
          item.Sales ||
          item.sales ||
          item.Orders ||
          item.orders ||
          0
        )
      ),
      backgroundColor: "#10B981",
borderColor: "#10B981",
      borderRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

  const handleLogin = (e) => {
  e.preventDefault();

  const email = e.target.elements[0].value.trim().toLowerCase();

  localStorage.setItem("loggedInEmail", email);

  const savedData = localStorage.getItem(
    `businessData_${email}`
  );

  setBusinessData(
    savedData ? JSON.parse(savedData) : []
  );

  setLoggedInEmail(email);
  setShowLogin(false);
};

  if (showLogin) {
    return (
      <div className="login-page">
        <div className="login-container">

          <div className="login-left">
            <div className="logo">📈 Insight</div>

            <div className="left-content">
              <h1>
                Turn your data
                <br />
                into decisions.
              </h1>

              <p>
                Analyze your business performance, monitor KPIs
                and discover valuable insights from your data.
              </p>
            </div>

            <div className="analytics-box">
              <div className="analytics-bar bar1"></div>
              <div className="analytics-bar bar2"></div>
              <div className="analytics-bar bar3"></div>
              <div className="analytics-bar bar4"></div>
              <div className="analytics-bar bar5"></div>
            </div>
          </div>

          <div className="login-right">
            <h2>Welcome back 👋</h2>

            <p className="login-subtitle">
              Sign in to access your analytics dashboard.
            </p>

            <form className="login-form" onSubmit={handleLogin}>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="password-section">

                <div className="password-header">
                  <label>Password</label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => alert("Password reset option")}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="password-input">

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>

                </div>
              </div>

              <div className="remember-row">
                <label className="remember-label">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>

                </label>
              </div>

              <button
                className="login-button"
                type="submit"
              >
                Sign In →
              </button>

            </form>

            <p className="demo-text">
              Demo login • No account required
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      
<aside className="sidebar">

  {/* LOGO */}
  <div className="sidebar-logo">
    <span>📈</span>
    <h2>Insight</h2>
  </div>

  {/* NAVIGATION */}
  <nav className="sidebar-nav">

    {/* DASHBOARD */}
    <button
      className={activePage === "Dashboard" ? "active" : ""}
      onClick={() => setActivePage("Dashboard")}
    >
      🏠 Dashboard
    </button>

    {/* ANALYTICS */}
    <button
      className={activePage === "Analytics" ? "active" : ""}
      onClick={() => setActivePage("Analytics")}
    >
      📊 Analytics
    </button>

    {/* KPI MONITORING */}
    <button
      className={activePage === "KPI Monitoring" ? "active" : ""}
      onClick={() => setActivePage("KPI Monitoring")}
    >
      🎯 KPI Monitoring
    </button>

    {/* DATA IMPORT */}
    <button
      className={activePage === "Data Import" ? "active" : ""}
      onClick={() => setActivePage("Data Import")}
    >
      📁 Data Import
    </button>

    {/* REPORTS */}
    <button
      className={activePage === "Reports" ? "active" : ""}
      onClick={() => setActivePage("Reports")}
    >
      📄 Reports
    </button>

  </nav>

  {/* BOTTOM MENU */}
   {/* BOTTOM MENU */}
<div className="sidebar-bottom">

  {/* SETTINGS */}
  <button
    className={activePage === "Settings" ? "active" : ""}
    onClick={() => setActivePage("Settings")}
  >
    ⚙️ Settings
  </button>

  {/* LOGOUT */}
  <button
    onClick={() => {
      setBusinessData([]);
      setLoggedInEmail("");
      setShowLogin(true);
      setActivePage("Dashboard");
    }}
  >
    ↪️ Logout
  </button>

</div>
</aside>
   
         

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* DASHBOARD */}
        {activePage === "Dashboard" && (
          <>
            <header className="dashboard-header">
              <h1>Business Dashboard</h1>

              <p>
                Monitor your business performance and key metrics.
              </p>
            </header>

            <section className="kpi-grid">

              <div className="kpi-card">
                <span>💰</span>
                <h3>Total Revenue</h3>
                <h2>₹{businessData.reduce(
    (total, item) => total + Number(item.Revenue || item.revenue || 0),
    0
  ).toLocaleString("en-IN")}
</h2>
                <p>+12.5% this month</p>
              </div>

              <div className="kpi-card">
                <span>🛒</span>
                <h3>Total Sales</h3>
                <h2>{businessData.length}</h2>
                <p>+8.2% this month</p>
              </div>

              <div className="kpi-card">
                <span>👥</span>
                <h3>Customers</h3>
                <h2>{new Set(
    businessData.map(
      (item) => item.Customer || item.customer
    )
  ).size}</h2>
                <p>+5.4% this month</p>
              </div>

              <div className="kpi-card">
                <span>📦</span>
                <h3>Orders</h3>
                <h2>{businessData.reduce(
    (total, item) => total + Number(item.Orders || item.orders || 0),
    0
  )}</h2>
                <p>+10.1% this month</p>
              </div>

            </section>
{/* CHARTS */}
<section className="charts-grid">

  {/* REVENUE CHART */}
  <div className="chart-card">

    <div className="chart-header">
      <div>
        <h2>Revenue Overview</h2>
        <p>Monthly revenue performance</p>
      </div>

      <select>
        <option>Last 7 months</option>
        <option>Last 6 months</option>
        <option>This year</option>
      </select>
    </div>

    <div className="chart-container">
      <Line
        data={revenueData}
        options={chartOptions}
      />
    </div>

  </div>

  {/* SALES CHART */}
  <div className="chart-card">

    <div className="chart-header">
      <div>
        <h2>Sales Performance</h2>
        <p>Monthly sales</p>
      </div>
    </div>

    <div className="chart-container">
      <Bar
        data={salesData}
        options={chartOptions}
      />
    </div>

  </div>

</section>
            <section className="welcome-card">

              <h2>Business Overview</h2>

              <p>
                Welcome to Insight. Here you can analyze your
                business data, monitor important KPIs, import data
                from different sources and generate reports.
              </p>

            </section>
          </>
        )}

        {/* ANALYTICS */}
        {activePage === "Analytics" && (
          <section className="page-section">

            <h1>Analytics</h1>

            <p>
              Analyze your business performance and sales trends.
            </p>

            <div className="analytics-content">

              <div className="info-card">
                <h3>Sales Performance</h3>
                <h2>
  {businessData.reduce(
    (total, item) =>
      total +
      Number(
        item.Sales ||
        item.sales ||
        item.Orders ||
        item.orders ||
        0
      ),
    0
  ).toLocaleString("en-IN")}
</h2>
                <p>Total sales this month</p>
              </div>

              <div className="info-card">
                <h3>Revenue Growth</h3>
                <h2>12.5%</h2>
                <p>Growth compared to last month</p>
              </div>

              <div className="info-card">
                <h3>Customer Growth</h3>
                <h2>5.4%</h2>
                <p>New customer growth</p>
              </div>

            </div>

          </section>
        )}

        {/* KPI MONITORING */}
        {activePage === "KPI Monitoring" && (
          <section className="page-section">

            <h1>KPI Monitoring</h1>

            <p>
              Monitor your important business indicators.
            </p>

            <div className="analytics-content">

               <div className="info-card">
  <h3>Total Revenue</h3>

  <h2>
    ₹{businessData.reduce(
      (total, item) =>
        total +
        Number(item.Revenue || item.revenue || 0),
      0
    ).toLocaleString("en-IN")}
  </h2>

  <p>Total revenue from imported data</p>
</div>

  <div className="info-card">
  <h3>Total Sales</h3>

   <h2>
  {businessData.reduce(
    (total, item) =>
      total + Number(item.Orders || item.orders || 0),
    0
  ).toLocaleString("en-IN")}
</h2>

  <p>Total sales from imported data</p>
</div>

              <div className="info-card">
                <h3>Customer Retention</h3>
                <h2>92%</h2>
                <p>Customer retention rate</p>
              </div>

            </div>

          </section>
        )}
{/* SETTINGS */}
{activePage === "Settings" && (
  <section className="page-section">

    <h1>Settings</h1>

    <p>
      Manage your dashboard and data preferences.
    </p>

    <div className="analytics-content">

      <div className="info-card">
        <h3>📊 Dashboard</h3>
        <p>Manage your dashboard preferences.</p>

        <button
          className="primary-button"
          onClick={() => setActivePage("Dashboard")}
        >
          Go to Dashboard
        </button>
      </div>

      <div className="info-card">
        <h3>📁 Data</h3>
        <p>Clear your imported business data.</p>

        <button
          className="primary-button"
          onClick={() => {
            if (window.confirm("Are you sure you want to clear all imported data?")) {
              setBusinessData([]);
              alert("Imported data cleared.");
            }
          }}
        >
          Clear Data
        </button>
      </div>

      <div className="info-card">
        <h3>👤 Account</h3>
        <p>Logged in as:</p>

        <h3>{loggedInEmail || "User"}</h3>
      </div>

    </div>

  </section>
)}
        {/* DATA IMPORT */}
        {activePage === "Data Import" && (
          <section className="page-section">

            <h1>Data Import</h1>

            <p>
              Import your business data from different sources.
            </p>

            <div className="import-card">

              <h2>Upload Data</h2>

              <p>
                Select a CSV or Excel file to import your data.
              </p>

              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
        

        

            </div>
            

            {/* IMPORTED DATA */}
            {businessData.length > 0 && (
              <div className="info-card" style={{ marginTop: "25px" }}>

                <h2>Imported Data</h2>

                <p>
                  {businessData.length} records imported successfully.
                </p>

                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(businessData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {businessData.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {Object.keys(businessData[0]).map((key) => (
                            <td key={key}>{row[key]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </section>
        )}


        

        {/* REPORTS */}
{activePage === "Reports" && (
  <section className="page-section">

    <h1>Reports</h1>

    <p>
      View reports based on your imported business data.
    </p>

    <div className="analytics-content">

      {/* SALES REPORT */}
      <div className="info-card">
        <h3>Sales Report</h3>

        <h2>
          {businessData.reduce(
            (total, item) =>
              total +
              Number(
                item.Sales ||
                item.sales ||
                item.Orders ||
                item.orders ||
                0
              ),
            0
          ).toLocaleString("en-IN")}
        </h2>

        <p>Total sales from imported data</p>

        <button
          className="primary-button"
          onClick={() => setReportType("Sales")}
        >
          View Report
        </button>
      </div>

      {/* REVENUE REPORT */}
      <div className="info-card">
  <h3>Revenue Report</h3>

  <h2>
    ₹
    {businessData
      .reduce(
        (total, item) =>
          total +
          Number(
            item.Revenue ||
            item.revenue ||
            0
          ),
        0
      )
      .toLocaleString("en-IN")}
  </h2>

  <p>Total revenue from imported data</p>

  {/* View Report Button */}
  <button
    className="primary-button"
    onClick={() => setReportType("Revenue")}
  >
    View Report
  </button>

  {/* Export Report Button */}
  <button
    className="primary-button"
    onClick={() => {
      const revenue = businessData.reduce(
        (total, item) =>
          total +
          Number(
            item.Revenue ||
            item.revenue ||
            0
          ),
        0
      );

      const content = `Revenue Report

Total Revenue: ₹${revenue.toLocaleString("en-IN")}`;

      const blob = new Blob([content], {
        type: "text/plain",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "revenue-report.txt";
      link.click();

      URL.revokeObjectURL(url);
    }}
  >
    Export Report
  </button>
</div>
  
       {/* CUSTOMER REPORT */}
<div className="info-card">
  <h3>Customer Report</h3>

  <h2>
    {new Set(
      businessData
        .map(
          (item) =>
            item.Customer ||
            item.customer
        )
        .filter(Boolean)
    ).size}
  </h2>

  <p>Total unique customers</p>

  {/* VIEW REPORT */}
  <button
    className="primary-button"
    onClick={() => setReportType("Customer")}
  >
    View Report
  </button>

  {/* EXPORT REPORT */}
  <button
    className="primary-button"
    onClick={() => {
      const customers = new Set(
        businessData
          .map(
            (item) =>
              item.Customer ||
              item.customer
          )
          .filter(Boolean)
      ).size;

      const content = `Customer Report

Total Customers: ${customers}`;

      const blob = new Blob([content], {
        type: "text/plain",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "customer-report.txt";
      link.click();

      URL.revokeObjectURL(url);
    }}
  >
    Export Report
  </button>
</div>

</div>

    {/* SELECTED REPORT */}
    {reportType && (
      <div
        className="info-card"
        style={{ marginTop: "25px" }}
      >

        <h2>{reportType} Report</h2>

        <p>
          Detailed {reportType.toLowerCase()} information
          from your imported data.
        </p>

        {reportType === "Sales" && (
          <h3>
            Total Sales:{" "}
            {businessData.reduce(
              (total, item) =>
                total +
                Number(
                  item.Sales ||
                  item.sales ||
                  item.Orders ||
                  item.orders ||
                  0
                ),
              0
            ).toLocaleString("en-IN")}
          </h3>
        )}

        {reportType === "Revenue" && (
          <h3>
            Total Revenue: ₹
            {businessData.reduce(
              (total, item) =>
                total +
                Number(
                  item.Revenue ||
                  item.revenue ||
                  0
                ),
              0
            ).toLocaleString("en-IN")}
          </h3>
        )}

        {reportType === "Customer" && (
          <h3>
            Total Customers:{" "}
            {new Set(
              businessData
                .map(
                  (item) =>
                    item.Customer ||
                    item.customer
                )
                .filter(Boolean)
            ).size}
          </h3>
        )}

        <button
          className="primary-button"
          onClick={() => setReportType("")}
        >
          Close Report
        </button>

      </div>
    )}

  </section>
)}

</main>
 </div>
);
}
export default App;