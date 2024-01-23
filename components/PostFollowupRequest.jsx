import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ActivityIndicator } from "react-native";
import { JsonForms } from "@jsonforms/react";
import { Button, Text, View, RNPickerSelect } from "./Themed.tsx";
import { RNCells, RNRenderers } from "./renderers/index.ts";

import { GET, POST } from "./utils/API";

function PostFollowupRequest({ sourceId = null }) {
  const [followupRequestData, setFollowupRequestData] = useState({});
  const [telescopeList, setTelescopeList] = useState(null);
  const [instrumentList, setInstrumentList] = useState(null);
  const [groupList, setGroupList] = useState(null);
  const [allocationList, setAllocationList] = useState(null);
  const [instrumentForms, setInstrumentForms] = useState(null);
  const [selectedAllocationId, setSelectedAllocationId] = useState(null);

  const [filteredAllocationList, setFilteredAllocationList] = useState([]);
  const [settingFilteredList, setSettingFilteredList] = useState(false);
  const [requestType, setRequestType] = useState("triggered");

  useEffect(() => {
    const endpoint = `telescope`;
    async function fetchTelescopeList() {
      const response = await GET(endpoint, {});
      setTelescopeList(response.data);
    }

    fetchTelescopeList();
  }, []);

  useEffect(() => {
    const endpoint = `instrument`;
    async function fetchInstrumentList() {
      const response = await GET(endpoint, {});
      setInstrumentList(response.data);
    }

    fetchInstrumentList();
  }, []);

  useEffect(() => {
    const endpoint = `groups`;
    async function fetchGroupList() {
      const response = await GET(endpoint, {});
      setGroupList(response.data.all_groups);
    }

    fetchGroupList();
  }, []);

  useEffect(() => {
    const endpoint = `allocation`;
    // Define parameters
    const get_params = {
      apiType: "api_classname",
    };

    async function fetchAllocationList() {
      const response = await GET(endpoint, get_params);
      setAllocationList(response.data);
    }

    fetchAllocationList();
  }, []);

  useEffect(() => {
    const endpoint = `internal/instrument_forms`;
    // Define parameters
    const get_params = {
      apiType: "api_classname",
    };

    async function fetchInstrumentForms() {
      const response = await GET(endpoint, get_params);
      setInstrumentForms(response.data);
    }

    fetchInstrumentForms();
  }, []);

  // only keep allocations in allocationList where there is a corresponding
  // instrument form params with a non null formSchema
  useEffect(() => {
    async function filterAllocations() {
      setSettingFilteredList(true);
      if (requestType === "triggered") {
        const filtered = (allocationList || []).filter(
          (allocation) =>
            allocation.instrument_id in instrumentForms &&
            instrumentForms[allocation.instrument_id].formSchema !== null &&
            instrumentForms[allocation.instrument_id].formSchema !==
              undefined &&
            allocation.types.includes("triggered")
        );
        setFilteredAllocationList(filtered);
      } else if (requestType === "forced_photometry") {
        const filtered = (allocationList || []).filter(
          (allocation) =>
            allocation.instrument_id in instrumentForms &&
            instrumentForms[allocation.instrument_id]
              .formSchemaForcedPhotometry !== null &&
            instrumentForms[allocation.instrument_id]
              .formSchemaForcedPhotometry !== undefined &&
            allocation.types.includes("forced_photometry")
        );
        setFilteredAllocationList(filtered);
      }
      setSettingFilteredList(false);
    }
    if (
      allocationList !== null &&
      allocationList.length > 0 &&
      instrumentForms !== null &&
      Object.keys(instrumentForms).length > 0 &&
      settingFilteredList === false
    ) {
      filterAllocations();
    }
  }, [allocationList, instrumentForms, settingFilteredList, requestType]);

  useEffect(() => {
    if (
      filteredAllocationList?.length > 0 &&
      (!selectedAllocationId ||
        !filteredAllocationList.some(
          (allocation) => allocation.id === selectedAllocationId
        ))
    ) {
      setSelectedAllocationId(filteredAllocationList[0]?.id);
    }
  }, [filteredAllocationList]);

  if (
    filteredAllocationList.length === 0 ||
    Object.keys(instrumentForms).length === 0
  ) {
    return (
      <Text>
        {`No allocations with an API class ${
          requestType === "forced_photometry" ? "(for forced photometry) " : ""
        }where found..`}
        .
      </Text>
    );
  }

  if (
    telescopeList === null ||
    telescopeList.length === 0 ||
    instrumentList === null ||
    instrumentList.length === 0 ||
    groupList === null ||
    groupList.length === 0 ||
    !filteredAllocationList.some(
      (allocation) => allocation.id === selectedAllocationId
    )
  ) {
    return <ActivityIndicator size="small" />;
  }

  const groupLookUp = {};
  groupList?.forEach((group) => {
    groupLookUp[group.id] = group;
  });

  const allocationLookUp = {};
  filteredAllocationList?.forEach((allocation) => {
    allocationLookUp[allocation.id] = allocation;
  });

  const telLookUp = {};
  telescopeList?.forEach((tel) => {
    telLookUp[tel.id] = tel;
  });

  const instLookUp = {};
  instrumentList?.forEach((instrumentObj) => {
    instLookUp[instrumentObj.id] = instrumentObj;
  });

  const schema =
    requestType === "forced_photometry"
      ? instrumentForms[allocationLookUp[selectedAllocationId].instrument_id]
          .formSchemaForcedPhotometry
      : instrumentForms[allocationLookUp[selectedAllocationId].instrument_id]
          .formSchema;

  if (schema === null) {
    return <ActivityIndicator size="small" />;
  }

  if (schema && schema.properties?.start_date && schema.properties?.end_date) {
    if (requestType === "forced_photometry") {
      // edit the start and end date to be 30 days ending right now (in UTC)
      const endDate = new Date();
      const startDate = new Date(endDate - 30 * 24 * 60 * 60 * 1000);
      schema.properties.start_date.default = startDate // eslint-disable-line prefer-destructuring
        .toISOString()
        .replace("Z", "")
        .replace("T", " ")
        .split(".")[0];
      schema.properties.end_date.default = endDate // eslint-disable-line prefer-destructuring
        .toISOString()
        .replace("Z", "")
        .replace("T", " ")
        .split(".")[0];
    } else {
      // here, the range isn't necessarily 30 days, so we look at the values provided
      // calculate the range, and then update the default to be:
      // - start_date: now
      // - end_date: now + range
      const { start_date, end_date } = schema.properties;
      const startDate = new Date(start_date.default);
      const endDate = new Date(end_date.default);
      const range = endDate - startDate;
      const newStartDate = new Date();
      const newEndDate = new Date(newStartDate.getTime() + range);
      schema.properties.start_date.default = newStartDate // eslint-disable-line prefer-destructuring
        .toISOString()
        .split("T")[0];
      schema.properties.end_date.default = newEndDate // eslint-disable-line prefer-destructuring
        .toISOString()
        .split("T")[0];
    }
  }

  const handleFollowupRequestPost = async () => {
    // Define the API endpoint URL
    const endpoint = `followup_request`;

    async function postFollowupRequest() {
      await POST(endpoint, {
        obj_id: sourceId,
        allocation_id: selectedAllocationId,
        target_group_ids: [allocationLookUp[selectedAllocationId].group_id],
        payload: followupRequestData,
      });
    }
    postFollowupRequest();
  };

  function generateUISchema(jsonSchema) {
    const { properties } = jsonSchema;

    if (!properties) {
      throw new Error('JSON schema must have "properties" field.');
    }

    const uischema = {
      type: "Group",
      elements: Object.keys(properties).map((propertyName) => {
        const property = properties[propertyName];
        const isEnumPresent =
          property &&
          property.enum &&
          Array.isArray(property.enum) &&
          property.enum.length > 0;

        return {
          type: "Control",
          scope: `#/properties/${propertyName}`,
          title: property.title,
          options: {
            format: isEnumPresent ? "radio" : property.type,
          },
        };
      }),
    };

    return uischema;
  }

  const uischema = generateUISchema(schema);

  const options = filteredAllocationList.map((item) => ({
    label: `${instLookUp[item.instrument_id]?.name} - ${
      groupLookUp[item.group_id]?.name
    }`,
    value: item.id,
    key: item.id,
  }));

  const request_options = ["triggered", "forced_photometry"].map((item) => ({
    label: item,
    key: item,
    value: item,
  }));

  const handleAllocationChange = (value) => {
    if (value && value !== -1) {
      setSelectedAllocationId(value);
    }
  };

  const handleSetRequestType = (value) => {
    if (value && value !== -1) {
      setRequestType(value);
    }
  };

  const objectContainsKeys = (obj, keys) => keys.every((key) => key in obj);

  const containsAllKeys = objectContainsKeys(
    followupRequestData,
    schema.required
  );

  return (
    <View style={{ flex: 1, height: 500 }}>
      <Text>Follow-up Request</Text>
      <RNPickerSelect
        items={request_options}
        onValueChange={handleSetRequestType}
        value={requestType}
        useNativeAndroidPickerStyle={false}
        hideDoneBar
      />
      <RNPickerSelect
        items={options}
        onValueChange={handleAllocationChange}
        value={selectedAllocationId}
        useNativeAndroidPickerStyle={false}
        hideDoneBar
      />
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={followupRequestData}
        renderers={RNRenderers}
        cells={RNCells}
        onChange={({ data }) => setFollowupRequestData(data)}
      />
      {containsAllKeys ? (
        <Button title="Submit" onPress={handleFollowupRequestPost} />
      ) : null}
    </View>
  );
}

PostFollowupRequest.propTypes = {
  sourceId: PropTypes.string,
};

PostFollowupRequest.defaultProps = {
  sourceId: null,
};

export default PostFollowupRequest;
