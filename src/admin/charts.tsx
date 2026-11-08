// Chart components for statistics: single-series plots with direct labels, hover values and a data table.
import type { CountBucket } from "../api/client";

const plot = { width: 640, height: 220, top: 16, bottom: 36, left: 40, right: 8 };

type Format = (value: number) => string;
const count: Format = (value) => value.toLocaleString("en-GB");
const shortDay = (key: string) => {
  const [, m, d] = key.split("-");
  return `${d}.${m}`;
};

function Empty({ data }: { data: CountBucket[] }) {
  return data.every((item) => item.count === 0) ? <p className="hint">No records in this period.</p> : null;
}

/** Table with the same numbers as the drawing; available next to every chart. */
function DataTable({ title, data, format }: { title: string; data: CountBucket[]; format: Format }) {
  return (
    <details className="chart-data">
      <summary>Show data table: {title}</summary>
      <table>
        <caption className="sr-only">{title}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.key}>
              <td>{item.label}</td>
              <td>{format(item.count)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

/** Daily or ordered series as columns; the peak day is labelled and every column carries a hover value. */
export function ColumnChart({
  title,
  data,
  format = count,
  dayLabels = true,
}: {
  title: string;
  data: CountBucket[];
  format?: Format;
  dayLabels?: boolean;
}) {
  const max = Math.max(1, ...data.map((item) => item.count));
  const innerWidth = plot.width - plot.left - plot.right;
  const innerHeight = plot.height - plot.top - plot.bottom;
  const slot = innerWidth / Math.max(1, data.length);
  const barWidth = Math.max(2, Math.min(28, slot - 2));
  const peak = data.reduce((best, item) => (item.count > best.count ? item : best), data[0] ?? { key: "", label: "", count: 0 });
  const every = Math.max(1, Math.ceil(data.length / 8));
  return (
    <figure className="chart" aria-labelledby={`${title}-caption`}>
      <figcaption id={`${title}-caption`}>{title}</figcaption>
      <Empty data={data} />
      <svg
        role="img"
        aria-label={`${title}: ${data.length} ${dayLabels ? "days" : "categories"}, peak ${peak.label} at ${format(peak.count)}`}
        viewBox={`0 0 ${plot.width} ${plot.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {[0, 0.5, 1].map((step) => {
          const y = plot.top + innerHeight * (1 - step);
          return (
            <g key={step}>
              <line className="chart-gridline" x1={plot.left} x2={plot.width - plot.right} y1={y} y2={y} />
              <text className="chart-axis" x={plot.left - 6} y={y + 4} textAnchor="end">
                {format(Math.round(max * step))}
              </text>
            </g>
          );
        })}
        {data.map((item, index) => {
          const h = (item.count / max) * innerHeight;
          const x = plot.left + index * slot + (slot - barWidth) / 2;
          const y = plot.top + innerHeight - h;
          return (
            <g key={item.key}>
              <rect className="chart-bar" x={x} y={y} width={barWidth} height={Math.max(0, h)} rx={3}>
                <title>{`${item.label}: ${format(item.count)}`}</title>
              </rect>
              {dayLabels && index % every === 0 && (
                <text className="chart-axis" x={x + barWidth / 2} y={plot.height - 12} textAnchor="middle">
                  {shortDay(item.key)}
                </text>
              )}
            </g>
          );
        })}
        {peakLabel(peak, data, plot, max, slot, barWidth, format)}
      </svg>
      <DataTable title={title} data={data} format={format} />
    </figure>
  );
}
function peakLabel(
  peak: CountBucket,
  data: CountBucket[],
  geometry: typeof plot,
  max: number,
  slot: number,
  barWidth: number,
  format: Format,
) {
  if (!peak.count) return null;
  const index = data.indexOf(peak);
  const innerHeight = geometry.height - geometry.top - geometry.bottom;
  const x = geometry.left + index * slot + (slot - barWidth) / 2 + barWidth / 2;
  const y = geometry.top + innerHeight - (peak.count / max) * innerHeight - 4;
  return (
    <text className="chart-value" x={x} y={y} textAnchor="middle">
      {format(peak.count)}
    </text>
  );
}

/** Categories as horizontal bars with a direct value at every bar end. */
export function BarList({
  title,
  data,
  format = count,
  wide = false,
}: {
  title: string;
  data: CountBucket[];
  format?: Format;
  wide?: boolean;
}) {
  const max = Math.max(1, ...data.map((item) => item.count));
  return (
    <figure className={wide ? "chart chart-wide" : "chart"} aria-labelledby={`${title}-caption`}>
      <figcaption id={`${title}-caption`}>{title}</figcaption>
      <Empty data={data} />
      {data.length > 0 && (
        <ul className="bar-list">
          {data.map((item) => (
            <li key={item.key}>
              <span className="bar-label">{item.label}</span>
              <span className="bar-track" aria-hidden="true">
                <span className="bar-fill" style={{ width: `${(item.count / max) * 100}%` }} />
              </span>
              <span className="bar-value">{format(item.count)}</span>
            </li>
          ))}
        </ul>
      )}
      <DataTable title={title} data={data} format={format} />
    </figure>
  );
}
