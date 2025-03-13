// app/ticker/page.js
import Chart from "../components/Chart"; // Adjust path

async function fetchNewsData() {
  const data = await fetch("http://localhost:8000/ticker/TSLA");

  return (await data.json()).data.docs;
}

export default async function TickerPage() {
  const newsData = await fetchNewsData();

  // Aggregate news by date and keep one article’s details per day for tooltip
  const dateMap = newsData.reduce((acc, item) => {
    const date = item.published_utc.split("T")[0]; // Extract YYYY-MM-DD
    if (!acc[date]) {
      acc[date] = {
        count: 0,
        title: item.title,
        description: item.description,
      };
    }
    acc[date].count += 1;
    return acc;
  }, {});

  // Convert to array for Recharts
  const chartData = Object.entries(dateMap).map(
    ([date, { count, title, description }]) => ({
      date,
      count,
      title,
      description,
    })
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Financial News Timeline</h1>
      <Chart data={chartData} />
    </div>
  );
}
