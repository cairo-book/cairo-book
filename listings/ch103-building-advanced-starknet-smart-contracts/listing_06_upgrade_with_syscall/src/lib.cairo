use core::num::traits::Zero;
use starknet::class_hash::class_hash_const;
use starknet::{ClassHash, syscalls};

fn _upgrade(new_class_hash: ClassHash) {
    assert(!new_class_hash.is_zero(), 'Class hash cannot be zero');
    syscalls::replace_class_syscall(new_class_hash).unwrap();
}
