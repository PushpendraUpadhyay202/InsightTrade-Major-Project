import React, { useEffect } from "react"; 
import { Route, Routes, useLocation } from "react-router-dom";
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./Watchlist";
import Profile from "./Profile"; 
import { GeneralContextProvider } from "./GeneralContext";
import TopBar from "./TopBar";

const Dashboard = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const idFromUrl = queryParams.get("userId");
    const nameFromUrl = queryParams.get("userName");

    if (idFromUrl) {
      localStorage.setItem("userId", idFromUrl);
      localStorage.setItem("loggedInUser", nameFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="dashboard-wrapper" style={styles.wrapper}>
      {/* High-Class Fixed Navigation */}
      <TopBar /> 
      
      <div className="dashboard-container" style={styles.container}>
        <GeneralContextProvider>
          {/* Sidebar with Glassmorphism properties */}
          <aside style={styles.sidebar}>
            <WatchList />
          </aside>
        </GeneralContextProvider>
        
        {/* Main Viewport with Kinetic Entry Animation */}
        <main 
          key={location.pathname} // Triggers animation on route change
          className="content animate-entry" 
          style={styles.mainContent}
        >
          <div style={styles.scrollPadding}>
            <Routes>
              <Route exact path="/" element={<Summary />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/holdings" element={<Holdings />} />
              <Route path="/positions" element={<Positions />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { 
    height: "100vh", 
    display: "flex", 
    flexDirection: "column", 
    overflow: "hidden",
    background: "var(--bg-main)", // Uses the textured background from index.css
  },
  container: { 
    display: "flex", 
    flex: 1, 
    marginTop: "60px", 
    overflow: "hidden",
    position: "relative"
  },
  sidebar: { 
    width: "380px", // Wider sidebar for a more spacious, premium look
    borderRight: "1px solid rgba(0, 0, 0, 0.04)", 
    backgroundColor: "rgba(255, 255, 255, 0.6)", 
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    zIndex: 10,
    transition: "all 0.4s ease"
  },
  mainContent: { 
    flex: 1, 
    overflowY: "auto", 
    background: "transparent", // Lets the textured body background show through
    scrollBehavior: "smooth",
    perspective: "1000px", // Enables 3D transition effects for children
  },
  scrollPadding: { 
    padding: "40px 60px", // Dramatic spacing for high-class aesthetic
    maxWidth: "1600px", // Limits content width for better readability on ultrawide monitors
    margin: "0 auto"
  }
};

export default Dashboard;