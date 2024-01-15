import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "../../components/Themed.tsx";

import { GET } from "../../components/API";
import CandidateSwiper from "../../components/CandidateSwiper";

function CandidateList() {
  const params = useLocalSearchParams();
  const { id, save, reject, savedStatus } = params;

  const [candidates, setCandidates] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  useEffect(() => {
    // Define the API endpoint URL
    const endpoint = "candidates";
    // Define parameters
    const get_params = {
      groupIDs: [id],
      savedStatus,
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
  }, [id, savedStatus]);

  // Render an empty component if data is null
  if (candidates === null || candidates === undefined) {
    return (
      <View>
        <Text>Querying for candidates...</Text>
      </View>
    );
  }

  if (candidates.length === 0) {
    return <Text>No candidates found.</Text>;
  }

  return (
    <CandidateSwiper
      items={candidates}
      save={save}
      reject={reject}
      pageInfo={pageInfo}
    />
  );
}

export default CandidateList;
