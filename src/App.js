import React, { useState, useEffect } from "react";

import "./App.css"; // Import the CSS file

import axios from "axios";

const App = () => {
  const [caseNumber, setSearchQuery] = useState("")
  const [caseType, setSelectedCaseType] = useState("");
  const [caseYear, setSelectedCaseYear] = useState("");
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const fetchCaseData = async () => {
    try {
      let apiUrl = `http://localhost:8081/caseSearch/${caseNumber}`;
      
      // Check if caseType and caseYear are provided
      if (caseType && caseYear) {
        apiUrl = `http://localhost:8081/caseSearch?caseNumber=${caseNumber}&caseType=${caseType}&caseYear=${caseYear}`;
      }
  
      const response = await axios.get(apiUrl);
  
      if (!response.data || Object.keys(response.data).length === 0) {
        setErrorMessage("No data found. Please enter valid details.");
        setCaseData(null);
      } else if (response.data.error && response.data.error.code === 11000) {
        // Check if there's a duplicate key error
        setErrorMessage("Duplicate data found for the case number.");
        setCaseData(null);
      } else {
        setCaseData(response.data);
        setErrorMessage("");
      }
  
      setIsLoading(false);
  
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
  
      setErrorMessage("Duplicate data found for the case number.Please select case type and year");
  
      setIsLoading(false);
      setCaseData(null);
    }
  };
  
  const handleSearch = () => {
    if (!caseNumber) {
      setErrorMessage(
        "Please fill in all three fields: Case Number, Case Type, and Case Year" 
      );
      setCaseData(null);
     } else {
      setIsLoading(true);

      fetchCaseData();
    }
  };

  const currentYear = new Date().getFullYear();

  const years = [];

  for (let i = 1960; i <= currentYear; i++) {
    years.push(i);
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty string if dateString is null or undefined
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formattedDate;
  };

  return (
    <>
      <div className="container main-container">
        <nav
          className="navbar"
          style={{
            backgroundColor: "#B8621B",
            borderTopLeftRadius: "30px",
            borderTopRightRadius: "30px",
          }}
        >
          <div
            className="container-fluid d-flex 
justify-content-center"
          >
            <a className="navbar-brand text-white" href="#">
              Case Search
            </a>
          </div>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <div
              className="card"
              style={{
                backgroundColor: "#F6BA6F",
                padding: "25px",
                borderRadius: "0px 0px 30px 30px",
              }}
            >
              <div className="row">
                <div className="col-3">
                  <select
                    value={caseType}
                    onChange={(e) => setSelectedCaseType(e.target.value)}
                  >
                    <option
                      value=""
                      style={{ color: "gray", fontSize: "25px" }}
                    >
                      Select Case Type
                    </option>
                    <option value="Civil">Civil</option>

                    <option value="Criminal">Criminal</option>

                    {/* Add more options as needed */}
                  </select>
                </div>

                <div className="col-3">
                  <select
                    value={caseYear}
                    onChange={(e) => setSelectedCaseYear(e.target.value)}
                  >
                    <option value="">Select Case Year</option>

                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-3">
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Case Number"
                  />
                </div>

                <div className="col-3">
                  <button onClick={handleSearch}> Search </button>
                </div>

                {errorMessage && (
                  <div
                    className="row 
mt-2"
                  >
                    <div className="col">
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading && (
            <div
              className="row 
mt-2"
            >
              <div className="col">
                <p>Loading...</p>
              </div>
            </div>
          )}

          {caseData && (
            <div
              className="row mt-2 
"
            >
              <div className="col-6 card-1">
                <div className="entity-card">
                  <h5 className="" style={{ color: "#5f5f5f" }}>
                    e-Filing No:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.e_filing_number}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    e-Filing Date:{" "}
                    <span style={{ color: "black" }}>
                      {formatDate(caseData.e_filing_date)}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    CNR Number:{" "}
                    <span style={{ color: "black" }}>{caseData.cnrNumber}</span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Case Status:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.caseStatus}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Act / Section:{" "}
                    <span style={{ color: "black" }}>{caseData.section}</span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Petitioner Name:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.petitionerName}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Petitioner Advocate Name:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.petitionerAdvocateName}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Respondent Name:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.respondentName}
                    </span>
                  </h5>
                  <h5 className="" style={{ color: "#5f5f5f" }}>
                    Respondent Advocate Name:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.respondentAdvocateName}
                    </span>
                  </h5>
                </div>
              </div>

              <div className="col-6 card-2">
                <div className="entity-card">
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Previous Hearing date:{" "}
                    <span style={{ color: "black" }}>
                      {formatDate(caseData.previousHearingDate)}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Previous Hearing Description:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.previousHearingDescription}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Next hearing date:{" "}
                    <span style={{ color: "black" }}>
                      {formatDate(caseData.nextHearingDate)}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Judgement date:{" "}
                    <span style={{ color: "black" }}>
                      {formatDate(caseData.judgementDate)}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Judge Name:{" "}
                    <span style={{ color: "black" }}>{caseData.judgeName}</span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    FIR Year:{" "}
                    <span style={{ color: "black" }}>{caseData.firYear}</span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Chargesheet No.:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.chargeSheetNumber}
                    </span>
                  </h5>
                  <h5 className="mt-3" style={{ color: "#5f5f5f" }}>
                    Police Station Name:{" "}
                    <span style={{ color: "black" }}>
                      {caseData.policeStationName}
                    </span>
                  </h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;