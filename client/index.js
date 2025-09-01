const getData = async () => {
  const url = `http://localhost:4000/proxy?symbol=BTCUSDT&interval=1m&limit=1500`
  const res = await fetch(url)
  const resp = await res.json()
  //   console.log(resp)
  const cdata = resp.map((row) => {
    const [time1, open, high, low, close, volume] = row
    return {
      time: time1 / 1000,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume),
    }
  })
  return cdata
}

chart = new Kline("tvchart")
const main = async () => {
  const klinedata = await getData()
  klinedata.forEach((k) => chart.upsert1minKline(k))

  const socket = io.connect("http://127.0.0.1:4000/")

  socket.on("KLINE", (pl) => {
    chart.upsert1minKline(pl)
  })
  displayChart()
}

const displayChart = async (targetTimeframe = "1m") => {
  chart.setTargetTimeframe(targetTimeframe)
}

main()
