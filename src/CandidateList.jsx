import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";

import { GET } from "./API";
import CandidateSwiper from "./CandidateSwiper";

function CandidateList() {
  const route = useRoute();
  const { groupId } = route.params;

  const [candidates, setCandidates] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  useEffect(() => {
    // Define the API endpoint URL
    const endpoint = "candidates";
    // Define parameters
    const params = {
      // groupIDs: [280],
      groupIDs: [groupId],
      // Add any other parameters as needed
    };

    async function fetchData() {
      const response = await GET(endpoint, params);
      setCandidates(response.data.candidates);
      setPageInfo({
        pageNumber: response.data.pageNumber,
        numPerPage: response.data.numPerPage,
        totalMatches: response.data.totalMatches,
      });
    }
    fetchData();
  }, [groupId]);

  // Render an empty component if data is null
  if (candidates === null || candidates.length === 0) {
    return null; // or any other empty component you want to render
  }

  return <CandidateSwiper items={candidates} pageInfo={pageInfo} />;
}

export default CandidateList;
