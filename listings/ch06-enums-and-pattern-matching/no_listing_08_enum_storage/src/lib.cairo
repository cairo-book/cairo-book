#[starknet::contract]
mod Enums {

    #[storage]
    struct Storage {
        location: Direction,
    }

    // ANCHOR: enum_store
    #[derive(Drop, starknet::Store)]
    enum Direction {
        North,
        East,
        South,
        West,
    }
    // ANCHOR_END: enum_store

    fn locate(ref self: ContractState) {
    // ANCHOR: write
        let location = Direction::North;
        self.location.write(location);
    // ANCHOR_END: write
    }

    fn get_location(self: @ContractState) -> Direction {
    // ANCHOR: read
        self.location.read()
    // ANCHOR_END: read
    }

}