import Chart from "../components/Chart";

async function fetchTickerData() {
  const response = await fetch(`${process.env.URL}/ticker/TSLA`, {
    headers: {
      "X-API-Key": process.env.CLIO_API_KEY,
    },
  });
  return await response.json();
}

export default async function TickerPage() {
  const tickerData = await fetchTickerData();
  const priceData = tickerData.data.price_data.docs;
  const sentimentData = tickerData.data.sentiment_data.docs;

  // Find the earliest news date
  let earliestNewsDate = null;
  if (sentimentData.length > 0) {
    // Sort news data by date (ascending)
    const sortedNewsData = [...sentimentData].sort(
      (a, b) => new Date(a.published_utc) - new Date(b.published_utc)
    );
    earliestNewsDate = sortedNewsData[0].published_utc.split("T")[0];
  }

  // Create a map of dates to news articles
  const newsMap = sentimentData.reduce((acc, item) => {
    const date = item.published_utc.split("T")[0]; // Extract YYYY-MM-DD
    if (!acc[date]) {
      acc[date] = {
        count: 0,
        articles: [],
      };
    }
    acc[date].count += 1;
    acc[date].articles.push({
      title: item.title,
      description: item.description,
    });
    return acc;
  }, {});

  // Filter price data to start at or after the earliest news date
  const filteredPriceData = earliestNewsDate
    ? priceData.filter((item) => {
        const priceDate = new Date(item.timestamp).toISOString().split("T")[0];
        return priceDate >= earliestNewsDate;
      })
    : priceData;

  // Create chart data that combines price and news data
  const chartData = filteredPriceData.map((item) => {
    // Convert timestamp to YYYY-MM-DD
    const date = new Date(item.timestamp).toISOString().split("T")[0];

    // Get news data for this date if available
    const newsForDate = newsMap[date] || { count: 0, articles: [] };

    return {
      date,
      // Price data
      price: item.close,
      open: item.open,
      high: item.high,
      low: item.low,
      volume: item.volume,
      // News data
      newsCount: newsForDate.count,
      news: newsForDate.articles,
      // For backward compatibility - first article title and description
      title: newsForDate.articles[0]?.title || "",
      description: newsForDate.articles[0]?.description || "",
    };
  });

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 w-full bg-white">
      <div className="max-w-[95%] sm:max-w-3xl lg:max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-center sm:text-left">
          TSLA Stock Sentiment
        </h1>
        <div className="mt-6 w-full overflow-hidden">
          <Chart data={chartData} />
        </div>
      </div>
    </div>
  );
}
