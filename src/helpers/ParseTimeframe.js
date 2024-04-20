export default function ParseTimeframe(timeframe){
    return timeframe.slice(-2).concat(" ").concat(timeframe.slice(0,5)).concat(timeframe.slice(7,9));
}

// console.log(ParseTimeframe("2023-2024_Q2"));

