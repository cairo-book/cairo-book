## Appendix E - Starknet Plugin

In this appendix, we explain what actually happens when the compiler expands the code of a `#[contract]` module to make it a cairo contract

### Storage variables modules

In `handle_mod()`, if declare as Struct, call `handle_storage_struct()`. And generate getters and setters skeleton for a non-mapping member in the storage struct. The address of storage var is form `starknet::StorageBaseAddress` and it generate write and read functions that access to `starknet::StorageAccess:`.

Lets check the simple example of Storage variable.

Before it expand, code is :

```rust
struct Storage {
    my_storage_var: felt252
}
```

After generate, code will be expand like this :

```rust
mod my_storage_var {
        use super::IAnotherContractDispatcherTrait;
        use super::IAnotherContractDispatcher;
        use super::IAnotherContractLibraryDispatcher;
        use super::Felt252DictTrait;
        use starknet::class_hash::ClassHashSerde;
        use starknet::contract_address::ContractAddressSerde;
        use starknet::storage_access::StorageAddressSerde;
        use option::OptionTrait;
        use option::OptionTraitImpl;
        use starknet::SyscallResultTrait;
        use starknet::SyscallResultTraitImpl;
        fn address() -> starknet::StorageBaseAddress {
            starknet::storage_base_address_const::<0x1275130f95dda36bcbb6e9d28796c1d7e10b6e9fd5ed083e0ede4b12f613528>()
        }
        fn read() -> felt252 {
            // Only address_domain 0 is currently supported.
            let address_domain = 0_u32;
            starknet::StorageAccess::<felt252>::read(
                address_domain,
                address(),
            ).unwrap_syscall()
        }
        fn write(value: felt252) {
            // Only address_domain 0 is currently supported.
            let address_domain = 0_u32;
            starknet::StorageAccess::<felt252>::write(
                address_domain,
                address(),
                value,
            ).unwrap_syscall()
        }
    }
```

### Events code expansion

### Generated contract `__abi` trait

### `external` mmodule
