import { JsonSchema, Layout } from "@jsonforms/core";
import { ResolvedJsonFormsDispatch, useJsonForms } from "@jsonforms/react";
import isEmpty from "lodash/isEmpty";
import React, { useState } from "react";
import { Button, View } from "../Themed.tsx";

export interface RenderChildrenProps {
  layout: Layout;
  schema: JsonSchema;
  path: string;
}

export const renderChildren = (
  layout: Layout,
  schema: JsonSchema,
  path: string
) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isEmpty(layout.elements)) {
    return [];
  }

  const { renderers, cells } = useJsonForms();

  const onBackPress = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onNextPress = () => {
    if (currentIndex < layout.elements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      <ResolvedJsonFormsDispatch
        renderers={renderers}
        cells={cells}
        uischema={layout.elements[currentIndex]}
        schema={schema}
        path={path}
      />
      <View style={{ flexDirection: "row" }}>
        {currentIndex > 0 ? (
          <Button title="Back" onPress={onBackPress} />
        ) : (
          <></>
        )}
        {currentIndex < layout.elements.length - 1 ? (
          <Button title="Next" onPress={onNextPress} />
        ) : (
          <></>
        )}
      </View>
    </>
  );
};
