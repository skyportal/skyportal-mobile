import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  VictoryContainer,
  VictoryLegend,
  VictoryScatter,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
  VictoryAxis,
} from "victory-native";
import { Text } from "./Themed.tsx";

import { PHOT_ZP, mjdnow } from "./utils";

function PhotometryPlot({ dm, photometry }) {
  const [data, setData] = useState(null);
  const [photStats, setPhotStats] = useState(null);

  // const filter2color = config?.bandpassesColors || {};

  const getColorForType = (type) => {
    switch (type) {
      case "ZTF/ztfr":
        return "red";
      case "ZTF/ztfg":
        return "green";
      case "ZTF/ztfi":
        return "black";
      default:
        return "black";
    }
  };
  const now = mjdnow();

  useEffect(() => {
    const preparePhotometry = (photometryData) => {
      const stats = {
        mag: {
          min: 100,
          max: 0,
          range: [100, 0],
        },
        flux: {
          min: 100,
          max: 0,
          range: [0, 100],
        },
        days_ago: {
          min: 100000,
          max: 0,
          extra: [100000, 0],
        },
        mjd: {
          min: 100000,
          max: 0,
          extra: [100000, 0],
        },
      };

      const newPhotometryData = photometryData.map((point) => {
        const newPoint = { ...point };
        newPoint.days_ago = now - newPoint.mjd;
        if (newPoint.mag !== null) {
          newPoint.flux = 10 ** (-0.4 * (newPoint.mag - PHOT_ZP));
          newPoint.fluxerr =
            (newPoint.magerr / (2.5 / Math.log(10))) * newPoint.flux;
          newPoint.snr = newPoint.flux / newPoint.fluxerr;
          if (newPoint.snr < 0) {
            newPoint.snr = null;
          }
          newPoint.symbol = "circle";
          newPoint.opacity = 0.3;
        } else {
          newPoint.mag = newPoint.limiting_mag;
          newPoint.flux = 10 ** (-0.4 * (newPoint.limiting_mag - PHOT_ZP));
          newPoint.fluxerr = 0;
          newPoint.snr = null;
          newPoint.symbol = "triangleDown";
          newPoint.opacity = 0.1;
        }
        newPoint.streams = (newPoint.streams || [])
          .map((stream) => stream?.name || stream)
          .filter((value, index, self) => self.indexOf(value) === index);
        // also, we only want to keep the stream names that are not substrings of others
        // for example, if we have a stream called 'ZTF Public', we don't want to keep
        // 'ZTF Public+Partnership' because it's a substring of 'ZTF Public'.
        newPoint.streams = newPoint.streams.filter((name) => {
          const names = newPoint.streams.filter(
            (c) => c !== name && c.includes(name)
          );
          return names.length === 0;
        });
        newPoint.label = `MJD: ${newPoint.mjd.toFixed(6)}`;
        if (newPoint.mag) {
          newPoint.label += `
        Mag: ${newPoint.mag ? newPoint.mag.toFixed(3) : "NaN"}
        Magerr: ${newPoint.magerr ? newPoint.magerr.toFixed(3) : "NaN"}
        `;
        }
        newPoint.label += `
        Limiting Mag: ${
          newPoint.limiting_mag ? newPoint.limiting_mag.toFixed(3) : "NaN"
        }
        Flux: ${newPoint.flux ? newPoint.flux.toFixed(3) : "NaN"}
      `;
        if (newPoint.mag) {
          newPoint.label += `Fluxerr: ${newPoint.fluxerr.toFixed(3) || "NaN"}`;
        }
        newPoint.label += `
        Filter: ${newPoint.filter}
        Instrument: ${newPoint.instrument_name}
      `;
        if ([null, undefined, "", "None"].includes(newPoint.origin) === false) {
          newPoint.label += `Origin: ${newPoint.origin}`;
        }
        if (
          [null, undefined, "", "None", "undefined"].includes(
            newPoint.altdata?.exposure
          ) === false
        ) {
          newPoint.label += `Exposure: ${newPoint.altdata?.exposure || ""}`;
        }
        if (newPoint.snr) {
          newPoint.label += `SNR: ${newPoint.snr.toFixed(3)}`;
        }
        if (newPoint.streams.length > 0) {
          newPoint.label += `Streams: ${newPoint.streams.join(", ")}`;
        }

        stats.mag.min = Math.min(
          stats.mag.min,
          newPoint.mag || newPoint.limiting_mag
        );
        stats.mag.max = Math.max(
          stats.mag.max,
          newPoint.mag || newPoint.limiting_mag
        );
        stats.mjd.min = Math.min(stats.mjd.min, newPoint.mjd);
        stats.mjd.max = Math.max(stats.mjd.max, newPoint.mjd);
        stats.days_ago.min = Math.min(stats.days_ago.min, newPoint.days_ago);
        stats.days_ago.max = Math.max(stats.days_ago.max, newPoint.days_ago);
        stats.flux.min = Math.min(
          stats.flux.min,
          newPoint.flux || newPoint.fluxerr
        );
        stats.flux.max = Math.max(
          stats.flux.max,
          newPoint.flux || newPoint.fluxerr
        );

        return newPoint;
      });

      stats.mag.range = [stats.mag.max * 1.02, stats.mag.min * 0.98];
      stats.mjd.range = [stats.mjd.min - 1, stats.mjd.max + 1];
      stats.days_ago.range = [stats.days_ago.max + 1, stats.days_ago.min - 1];
      stats.flux.range = [stats.flux.min - 1, stats.flux.max + 1];

      return [newPhotometryData, stats];
    };

    const groupPhotometry = (photometryData) => {
      // before grouping, we compute the max and min for mag, flux, and days_ago
      // we will use these values to set the range of the plot

      const groupedPhotometry = photometryData.reduce((acc, point) => {
        let key = `${point.instrument_name}/${point.filter}`;
        if (
          point?.origin !== "None" &&
          point.origin !== "" &&
          point.origin !== null
        ) {
          key += `/${point.origin}`;
        }
        // limit the key to 30 characters
        if (key.length > 30) {
          key = `${key.substring(0, 27)}...`;
        }
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(point);
        return acc;
      }, {});

      return groupedPhotometry;
    };

    const [newPhotometry, newPhotStats] = preparePhotometry([...photometry]);
    const groupedPhotometry = groupPhotometry(newPhotometry);
    setPhotStats(newPhotStats);
    setData(groupedPhotometry);
  }, [photometry, now]);

  if (data === null) {
    return <Text>Loading photometry...</Text>;
  }

  const xDomain = photStats.days_ago.range;
  const yDomain = photStats.mag.range;

  return (
    <VictoryChart
      containerComponent={<VictoryContainer responsive={false} />}
      padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
      theme={VictoryTheme.material}
      domain={{ x: xDomain, y: yDomain }}
    >
      <VictoryAxis crossAxis label="Days ago" />
      <VictoryAxis
        crossAxis
        label="MJD"
        offsetY={340}
        tickFormat={(t) => (t + now).toFixed(1)}
      />
      {dm ? (
        <VictoryAxis
          crossAxis
          dependentAxis
          label="m-DM"
          offsetX={360}
          tickFormat={(t) => (t - dm).toFixed(1)}
        />
      ) : null}
      <VictoryAxis dependentAxis crossAxis label="Mag" />
      {Object.keys(data).map((setType) => (
        <VictoryScatter
          key={setType}
          data={data[setType]}
          x="days_ago"
          y="mag"
          size={5}
          labelComponent={
            <VictoryTooltip constrainToVisibleArea renderInPortal={false} />
          }
          style={{ data: { fill: getColorForType(setType) } }}
        />
      ))}
      <VictoryLegend
        x={50}
        y={0}
        orientation="vertical"
        gutter={10}
        data={Object.keys(data).map((setType) => ({
          name: setType,
          symbol: { fill: getColorForType(setType) },
        }))}
      />
    </VictoryChart>
  );
}

PhotometryPlot.propTypes = {
  dm: PropTypes.number,
  photometry: PropTypes.arrayOf(
    PropTypes.shape({
      mjd: PropTypes.number.isRequired,
      mag: PropTypes.number,
      magerr: PropTypes.number,
      limiting_mag: PropTypes.number,
      filter: PropTypes.string.isRequired,
      instrument_name: PropTypes.string.isRequired,
      origin: PropTypes.string,
    })
  ).isRequired,
  config: PropTypes.shape({
    bandpassesColors: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  }).isRequired,
};

PhotometryPlot.defaultProps = {
  dm: null,
};

export default PhotometryPlot;
