//ANCHOR: here
use starknet::ContractAddress;

//ANCHOR:price_interface
#[starknet::interface]
pub trait IPriceFeedExample<TContractState> {
    fn buy_item(ref self: TContractState);
    fn get_asset_price(self: @TContractState, asset_id: felt252) -> u128;
}
//ANCHOR_END:price_interface

#[starknet::contract]
mod PriceFeedExample {
    use super::ContractAddress;
    //ANCHOR: pragma_lib
    use pragma_lib::abi::{IPragmaABIDispatcher, IPragmaABIDispatcherTrait};
    use pragma_lib::types::{DataType, PragmaPricesResponse};
    //ANCHOR_END: pragma_lib
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use starknet::contract_address::contract_address_const;
    use starknet::{get_caller_address};

    const ETH_USD: felt252 = 19514442401534788;

    #[storage]
    struct Storage {
        pragma_contract: ContractAddress,
        product_price_in_usd: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, pragma_contract: ContractAddress) {
        self.pragma_contract.write(pragma_contract);
        self.product_price_in_usd.write(10);
    }

    #[abi(embed_v0)]
    impl PriceFeedExampleImpl of super::IPriceFeedExample<ContractState> {
        fn buy_item(ref self: ContractState) {
            let caller_address = get_caller_address();
            let eth_price = self.get_asset_price(ETH_USD);
            let product_price = self.product_price_in_usd.read();

            // Calculate the amount of ETH needed to buy the iPhone
            let eth_needed = product_price * (10 * 8) / eth_price.into();

            // assert user has enough ETH
            let eth_dispatcher = ERC20ABIDispatcher {
                contract_address: contract_address_const::<
                    0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
                >() // ETH Contract Address
            };
            eth_dispatcher.approve(caller_address, eth_needed);
            // Transfer the ETH to the caller
            eth_dispatcher
                .transfer_from(
                    caller_address,
                    contract_address_const::<
                        0x067f9ffb4a1b4f9c233abbad4fc5fc543724ac913e02b99b9e0cbe9875bfae66
                    >(),
                    eth_needed
                );
        }

        //ANCHOR: price_feed_impl
        fn get_asset_price(self: @ContractState, asset_id: felt252) -> u128 {
            // Retrieve the oracle dispatcher
            let oracle_dispatcher = IPragmaABIDispatcher {
                contract_address: self.pragma_contract.read()
            };

            // Call the Oracle contract, for a spot entry
            let output: PragmaPricesResponse = oracle_dispatcher
                .get_data_median(DataType::SpotEntry(asset_id));

            return output.price;
        }
    //ANCHOR_END: price_feed_impl
    }
}
//ANCHOR_END: here

