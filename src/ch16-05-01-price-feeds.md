# Price Feeds

Price feeds enabled by an oracle serves as a bridge between real-world data feed and the blockchain. It provide real time pricing data that is aggregated from multiple trusted external sources ( e.g. crypto exchanges or financial data providers ) to the blockchain network.

## Interacting with Price Feed on Starknet using Pragma Oracle

```rust,noplayground
{{#include ../listings/ch16-building-advanced-starknet-smart-contracts/listing_08_price_feed/src/lib.cairo:here}}
```

You can get a detail guide on consuming data using Pragma price feeds [here](https://docs.pragma.build/Resources/Cairo%201/data-feeds/consuming-data).
