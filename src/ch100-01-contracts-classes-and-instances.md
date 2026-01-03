# Starknet contract classes and instances

As in object-oriented programming, Starknet distinguishes between a contract and
its implementation by separating contracts into [classes](#contract-classes) and
[instances](#contract-instances) A contract class is the definition of a
contract, while a contract instance is a deployed contract that corresponds to a
class. Only contract instances act as true contracts, in that they have their
own storage and can be called by transactions or other contracts.

<!-- > Note: A contract class does not necessarily require a deployed instance in Starknet. -->

## Contract classes

### Components of a Cairo class definition

The components that define a class are:

| Name                                     | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contract class version                   | The version of the contract class object. Currently, the Starknet OS supports version 0.1.0.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Array of external functions entry points | An entry point is a pair `(_selector_, _function_idx_)`, where `_function_idx_` is the index of the function inside the Sierra program. A selector is an identifier through which the function is callable in transactions or in other classes. The selector is the `starknet_keccak` hash of the function name, encoded in ASCII.                                                                                                                                                                                                                                                                                                                                     |
| Array of L1 handlers entry points        | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Array of constructors entry points       | Currently, the compiler allows only one constructor.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ABI                                      | A string representing the ABI of the class. The ABI hash (which affects the class hash) is given by `starknet_keccak(bytes(ABI, "UTF-8"))`. This string is supplied by the user declaring the class (and is signed on as part of the `DECLARE` transaction), and is not enforced to be the true ABI of the associated class. Without seeing the underlying source code (i.e. the Cairo code generating the class's Sierra), this ABI should be treated as the "intended" ABI by the declaring party, which may be incorrect (intentionally or otherwise). The "honest" string would be the json serialization of the contract's ABI as produced by the Cairo compiler. |
| Sierra program                           | An array of field elements representing the Sierra instructions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

### Class hash

Each class is uniquely identified by its _class hash_, comparable to a class
name in traditional object-oriented programming languages. The hash of the class
is the chain hash of its components, computed as follows:

```
class_hash = h(
    contract_class_version,
    external_entry_points,
    l1_handler_entry_points,
    constructor_entry_points,
    abi_hash,
    sierra_program_hash
)
```

Where:

- `h` is the Poseidon hash function
- The hash of an entry point array \\( (selector,index)\_{i=1}^n] \\) is given
  by \\(
  h(\text{selector}\_1,\text{index}\_1,...,\text{selector}\_n,\text{index}\_n)
  \\)
- `sierra_program_hash` is the Poseidon hash of the program's bytecode array

> Note: The Starknet OS currently supports contract class version 0.1.0, which
> is represented in the above hash computation as the ASCII encoding of the
> string `CONTRACT_CLASS_V0.1.0` (hashing the version in this manner gives us
> domain separation between the hashes of classes and other objects). For more
> details, see the
> [Cairo implementation](https://github.com/starkware-libs/cairo-lang/blob/7712b21fc3b1cb02321a58d0c0579f5370147a8b/src/starkware/starknet/core/os/contracts.cairo#L47).

### Working with classes

- Adding new classes: To introduce new classes to Starknet's state, use the
  `DECLARE` transaction.
- Deploying instances: To deploy a new instance of a previously declared class,
  use the `deploy` system call.
- Using class functionality: To use the functionality of a declared class
  without deploying an instance, use the `library_call` system call. Analogous
  to Ethereum's `delegatecall`, it enables you to use code in an existing class
  without deploying a contract instance.

## Contract instances

### Contract nonce

A contract instance has a nonce, the value of which is the number of
transactions originating from this address plus 1. For example, when you deploy
an account with a `DEPLOY_ACCOUNT` transaction, the nonce of the account
contract in the transaction is `0`. After the `DEPLOY_ACCOUNT` transaction,
until the account contract sends its next transaction, the nonce is `1`.

### Contract address

The contract address is a unique identifier of the contract on Starknet. It is a
chain hash of the following information:

- `prefix`: The ASCII encoding of the constant string
  `STARKNET_CONTRACT_ADDRESS`.
- `deployer_address`, which is:
  - `0` when the contract is deployed via a `DEPLOY_ACCOUNT` transaction
  - determined by the value of the `deploy_from_zero` parameter when the
    contract is deployed via the `deploy` system call
    > Note: For information on the `deploy_from_zero` parameter, see the
    > [`deploy` system call]().
- `salt`: The salt passed by the contract calling the syscall, provided by the
  transaction sender.
- `class_hash`: See [Class hash](#class-hash).
- `constructor_calldata_hash`:: Array hash of the inputs to the constructor.

The address is computed as follows:

```
contract_address = pedersen(
    “STARKNET_CONTRACT_ADDRESS”,
    deployer_address,
    salt,
    class_hash,
    constructor_calldata_hash)
```

> Note: A random `salt` ensures unique addresses for smart contract deployments,
> preventing conflicts when deploying identical contract classes. It also
> thwarts replay attacks by influencing the transaction hash with a unique
> sender address.

For more information on the address computation, see
[`contract_address.cairo`](https://github.com/starkware-libs/cairo/blob/2c96b181a6debe9a564b51dbeaaf48fa75808d53/corelib/src/starknet/contract_address.cairo)
in the Cairo GitHub repository.
