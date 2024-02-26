fn _upgrade(new_class_hash: ClassHash) {
    assert(!new_class_hash.is_zero(), 'Class hash cannot be zero');
    starknet::replace_class_syscall(new_class_hash).unwrap();
}