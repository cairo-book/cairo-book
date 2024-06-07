//! # MyContract and Implementation
//!
//! This is an example description of MyContract and some of its features.
//!
//! # Examples
//!
//! ```
//! #[starknet::contract]
//! mod MyContractExtended {
//!   use path::to::MyContract;
//!
//!   #[storage]
//!   struct Storage {}
//!
//!   fn foo() {
//!     MyContract.my_selector();
//!   }
//! }
#[starknet::contract]
mod MyContract {
    #[storage]
    struct Storage {}
// rest of implementation...
}
