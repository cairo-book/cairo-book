use core::num::traits::Zero;
use starknet::{ClassHash, syscalls};

fn upgrade(new_class_hash: ClassHash) {
    assert!(!new_class_hash.is_zero(), "Class hash cannot be zero");
    syscalls::replace_class_syscall(new_class_hash).unwrap();
}
