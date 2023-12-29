import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

import { GET } from "../../../components/API";
import CandidateSwiper from "../../../components/CandidateSwiper";

function CandidateList() {
  const params = useLocalSearchParams();
  const { id } = params;

  const [candidates, setCandidates] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  useEffect(() => {
    // Define the API endpoint URL
    const endpoint = "candidates";
    // Define parameters
    const get_params = {
      groupIDs: [280],
      // groupIDs: [id],
      // Add any other parameters as needed
    };

    async function fetchData() {
      const response = await GET(endpoint, get_params);
      setCandidates(response.data.candidates);
      setPageInfo({
        pageNumber: response.data.pageNumber,
        numPerPage: response.data.numPerPage,
        totalMatches: response.data.totalMatches,
      });
    }
    fetchData();
  }, [id]);

  // Render an empty component if data is null
  if (candidates === null || candidates.length === 0) {
    return null; // or any other empty component you want to render
  }

  return <CandidateSwiper items={candidates} pageInfo={pageInfo} />;
}

export default CandidateList;