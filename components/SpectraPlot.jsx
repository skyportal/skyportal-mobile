import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  VictoryLegend,
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
} from "victory-native";
import { Text } from "./Themed.tsx";

import { median, mean, colorScaleRainbow } from "./utils";

function SpectraPlot({ spectra, redshift }) {
  const [data, setData] = useState(null);
  const [specStats, setSpecStats] = useState(null);

  useEffect(() => {
    const prepareSpectra = (spectraData) => {
      const stats = {
        flux: {
          min: 0,
          max: 0,
          maxLines: 0,
          range: [0, 1],
        },
        wavelength: {
          min: 100000,
          max: 0,
          range: [0, 100000],
        },
      };

      const newSpectra = spectraData.map((spectrum) => {
        const newSpectrum = { ...spectrum };
        let normfac = Math.abs(median(newSpectrum.fluxes));
        normfac = normfac !== 0.0 ? normfac : 1e-20;
        newSpectrum.fluxes_normed = newSpectrum.fluxes.map(
          (flux) => flux / normfac
        );
        newSpectrum.date = newSpectrum.observed_at.split("T")[0].split("-");
        newSpectrum.name = `${newSpectrum.instrument_name} (${
          newSpectrum.date[1]
        }/${newSpectrum.date[2].slice(-2)}/${newSpectrum.date[0].slice(-2)})`;

        newSpectrum.data = newSpectrum.wavelengths.map((wave, index) => ({
          wavelength: wave,
          flux: newSpectrum.fluxes_normed[index],
        }));

        stats.wavelength.min = Math.min(
          stats.wavelength.min,
          Math.min(...newSpectrum.wavelengths)
        );
        stats.wavelength.max = Math.max(
          stats.wavelength.max,
          Math.max(...newSpectrum.wavelengths)
        );
        // it happens that some spectra have a few ridiculously large flux peaks, and that messes up the plot
        // the problem here is that we use the max of the fluxes to set the range of the y axis
        // so when a spectrum's max value is > 10 times the median or the mean,
        // we'll use the upper fence of the interquartile range to set the max flux
        const medianFlux = median(newSpectrum.fluxes_normed);
        const meanFlux = mean(newSpectrum.fluxes_normed);
        const maxFlux = Math.max(...newSpectrum.fluxes_normed);

        if (maxFlux > 10 * medianFlux || maxFlux > 10 * meanFlux) {
          const sortedFluxes = [...newSpectrum.fluxes_normed].sort(
            (a, b) => a - b
          );
          // set negative fluxes to 0
          sortedFluxes.forEach((flux, index) => {
            if (flux < 0) {
              sortedFluxes[index] = 0;
            }
          });
          const q1 = sortedFluxes[Math.floor(sortedFluxes.length * 0.25)];
          const q3 = sortedFluxes[Math.floor(sortedFluxes.length * 0.75)];
          const iqr = q3 - q1;
          const upperFence = q3 + 1.5 * iqr;
          stats.flux.max = Math.max(stats.flux.max, upperFence);
        } else {
          stats.flux.max = Math.max(stats.flux.max, maxFlux);
        }
        // for the lines we show on top of the plot, we want to use the max flux of all spectra
        stats.flux.maxLines = Math.max(stats.flux.maxLines, maxFlux);

        return newSpectrum;
      });

      stats.wavelength.range = [
        stats.wavelength.min - 100,
        stats.wavelength.max + 100,
      ];
      stats.flux.range = [0, stats.flux.max * 1.05];

      return [newSpectra, stats];
    };

    const [newSpectra, newSpecStats] = prepareSpectra(spectra);
    setSpecStats(newSpecStats);
    setData(newSpectra);
  }, [spectra]);

  if (data === null) {
    return <Text>Loading spectra...</Text>;
  }

  const xDomain = specStats.wavelength.range;
  const yDomain = specStats.flux.range;

  return (
    <VictoryChart
      padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
      theme={VictoryTheme.material}
      domain={{ x: xDomain, y: yDomain }}
    >
      <VictoryAxis crossAxis label="Wavelength" />
      {redshift ? (
        <VictoryAxis
          crossAxis
          label="Rest Wavelength"
          offsetY={340}
          tickFormat={(t) => (t / redshift).toFixed(1)}
        />
      ) : null}
      <VictoryAxis dependentAxis crossAxis label="Flux" />
      {data.map((line, index) => (
        <VictoryLine
          key={line.name}
          data={line.data}
          x="wavelength"
          y="flux"
          style={{
            data: {
              stroke: colorScaleRainbow(index, data.length - 1),
              strokeWidth: 2,
            },
          }}
        />
      ))}
      <VictoryLegend
        x={50}
        y={0}
        orientation="vertical"
        gutter={10}
        data={data.map((line, index) => ({
          name: line.name,
          symbol: { fill: colorScaleRainbow(index, data.length - 1) },
        }))}
      />
    </VictoryChart>
  );
}

SpectraPlot.propTypes = {
  redshift: PropTypes.number,
  spectra: PropTypes.arrayOf(
    PropTypes.shape({
      observed_at: PropTypes.string.isRequired,
      instrument_name: PropTypes.string.isRequired,
      pi: PropTypes.string,
      origin: PropTypes.string,
    })
  ).isRequired,
};

SpectraPlot.defaultProps = {
  redshift: null,
};

export default SpectraPlot;
